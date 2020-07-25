ProjectManager.Views.ProjectDetails = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details',
    className: 'background-color-white border-light-gray flex-column',
    template: _.template(TemplateManager.templates.projectDetails),

    events: {
        'click #project-details-close-button': 'close',
        'click #project-details-leave-button': 'onClickLeave',
        'click #project-details-delete-button': 'onClickDelete'
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let projectDetailsNameView = new ProjectManager.Views.ProjectDetailsName({
            model: self.model
        });
        this.$('#project-details-name').replaceWith(projectDetailsNameView.render().$el);

        let projectDetailsDescriptionView = new ProjectManager.Views.ProjectDetailsDescription({
            model: self.model
        });
        this.$('#project-details-description').replaceWith(projectDetailsDescriptionView.render().$el);

        let projectDetailsOwnerView = new ProjectManager.Views.ProjectDetailsOwner({
            model: self.model,
            collection: self.collection
        });
        this.$('#project-details-owner').replaceWith(projectDetailsOwnerView.render().$el);

        let projectDetailsTeamMembersView = new ProjectManager.Views.ProjectDetailsTeamMembers({
            model: self.model,
            collection: self.collection
        });
        this.$('#project-details-team-members').replaceWith(projectDetailsTeamMembersView.render().$el);

        let projectDetailsTagsView = new ProjectManager.Views.ProjectDetailsTags({
            model: self.model,
            collection: self.collection
        });
        this.$('#project-details-tags').replaceWith(projectDetailsTagsView.render().$el);

        if (self.model.get('ownerId') != ProjectManager.LoggedInUserId) self.$('#project-details-delete-button').remove();

        return this;
    },

    close: function () {
        $('.popup').last().remove();
    },

    onClickLeave: function () {
        let self = this;

        let message = null;
        let submitText = null;
        let onSubmit = null;
        if (self.model.get('teamMemberIds').length == 1) {
            message = 'You are the only user in this project. Leaving this project will also delete it. Are you sure?';
            submitText = 'Delete Project';
            onSubmit = self.delete.bind(self);
        } else {
            message = 'Leaving this project will delete all of your comments and unassign all of your tasks. Are you sure?';
            submitText = 'Leave Project';
            onSubmit = self.leave.bind(self);
        }

        let confirmationView = new ProjectManager.Views.Confirmation({
            message: message,
            submitText: submitText,
            onSubmit: onSubmit
        });
        $('#background-blur').append(confirmationView.render().$el);

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);
        $('.popup').last().append(confirmationView.render().$el);
    },

    leave: function () {
        let self = this;

        //this.collection.comments.where({ userId: ProjectManager.LoggedInUserId }).forEach(function (comment) {
        //    comment.destroy();
        //});

        this.collection.invites.where({ inviterId: ProjectManager.LoggedInUserId }).forEach(function (invite) {
            invite.destroy();
        });

        this.collection.tasks.where({ assignedUserId: ProjectManager.LoggedInUserId }).forEach(function (task) {
            task.save({ assignedUserId: 0 });
        });

        let teamMemberIdsClone = this.model.get('teamMemberIds').slice();
        teamMemberIdsClone.splice(teamMemberIdsClone.indexOf(ProjectManager.LoggedInUserId), 1);

        let ownerId = ProjectManager.LoggedInUserId;
        if (this.model.get('ownerId') == ProjectManager.LoggedInUserId) ownerId = teamMemberIdsClone[0];

        this.model.save({
            ownerId: ownerId,
            teamMemberIds: teamMemberIdsClone
        });

        let user = this.collection.users.findWhere({ id: ProjectManager.LoggedInUserId })
        let projectIdsClone = user.get('projectIds').slice();
        projectIdsClone.splice(projectIdsClone.indexOf(self.model.get('id')), 1);
        user.save({
            currentProjectId: 0,
            projectIds: projectIdsClone
        });

        location.reload();
    },

    onClickDelete: function () {
        let self = this;

        let confirmationView = new ProjectManager.Views.Confirmation({
            message: 'Deleting this project will also delete all of its categories, tasks, and tags. Are you sure?',
            submitText: 'Delete Project',
            onSubmit: self.delete.bind(self)
        });
        $('#background-blur').append(confirmationView.render().$el);

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);
        $('.popup').last().append(confirmationView.render().$el);
    },

    delete: function () {
        let self = this;

        let categoryPromises = [];
        this.collection.categories.where().forEach(function (category) {
            let taskPromises = [];
            this.collection.tasks.where({ categoryId: category.get('id') }).forEach(function (task) {
                let commentPromises = [];
                self.collection.comments.where({ taskId: task.get('id') }).forEach(function (comment) {
                    let tagPromises = [];
                    task.get('tagIds').forEach(function (tagId) {
                        tagPromises.push(new Promise(function (resolve) {
                            let tag = self.collection.tags.findWhere({ id: tagId });
                            let tagTaskIdsClone = tag.get('taskIds').slice();
                            tagTaskIdsClone.splice(tagTaskIdsClone.indexOf(task.get('id')), 1);
                            tag.save(
                                { taskIds: tagTaskIdsClone },
                                { success: function () { resolve(); } }
                            )
                        }));
                    });

                    taskPromises.push(new Promise(function (resolve) {
                        Promise.all(tagPromises).then(function () {
                            Promise.all(commentPromises).then(function () {
                                task.destroy({
                                    success: function () {
                                        resolve();
                                    }
                                });
                            });
                        });
                    }));

                    taskPromises.push(new Promise(function (resolve) {
                        if (task.get('assignedUserId') == 0) {
                            resolve();
                            return;
                        }

                        let user = self.collection.users.findWhere({ id: task.get('assignedUserId') });
                        let assignedTaskIdsClone = user.get('assignedTaskIds').slice();
                        assignedTaskIdsClone.splice(assignedTaskIdsClone.indexOf(task.get('id')), 1);
                        user.save(
                            { assignedTaskIds: assignedTaskIdsClone },
                            { success: function () { resolve(); } }
                        );
                    }));

                    taskPromises.push(new Promise(function (resolve) {
                        let user = self.collection.users.findWhere({ id: task.get('submittingUserId') });
                        let submittedTaskIdsClone = user.get('submittedTaskIds').slice();
                        submittedTaskIdsClone.splice(submittedTaskIdsClone.indexOf(task.get('id')), 1);
                        user.save(
                            { submittedTaskIds: submittedTaskIdsClone },
                            { success: function () { resolve(); } }
                        );
                    }));

                    commentPromises.push(new Promise(function (resolve) {
                        comment.destroy({
                            success: function () {
                                resolve();
                            }
                        });
                    }));

                    commentPromises.push(new Promise(function (resolve) {
                        let user = self.collection.users.findWhere({ id: comment.get('userId') });
                        let commentIdsClone = user.get('commentIds').slice();
                        commentIdsClone.splice(commentIdsClone.indexOf(comment.get('id')), 1);
                        user.save(
                            { commentIds: commentIdsClone },
                            { success: function () { resolve(); } }
                        );
                    }));
                });
            });

            categoryPromises.push(function () {
                new Promise(function (resolve) {
                    Promise.all(taskPromises).then(function () {
                        category.destroy({
                            wait: true,
                            success: function () {
                                resolve();
                            }
                        });
                    })
                }).then(function () {
                    let project = self.collection.projects.findWhere({ id: ProjectManager.CurrentProjectId });
                    let categoryIdsClone = project.get('categoryIds').slice();
                    categoryIdsClone.splice(categoryIdsClone.indexOf(category.get('id')), 1);
                    project.save({ categoryIds: categoryIdsClone });
                });
            });
        });

        Promise.all(categoryPromises).then(function () {
            let invitePromises = [];
            invitePromises.push(
                new Promise(function (resolve) {
                    self.collection.invites.where({ projectId: self.model.get('id') }).forEach(function (invite) {
                        invite.destroy({ success: function () { resolve(); } })
                    });
                })
            );

            new Promise(function (resolve) {
                self.model.destroy({ success: function () { resolve(); } })
            }).then(function () {
                let userPromises = [];

                self.collection.users.forEach(function (user) {
                    if (!user.get('projectIds').includes(self.model.get('id'))) return;

                    userPromises.push(
                        new Promise(function (resolve) {
                            let currentProjectId = user.get('currentProjectId');
                            if (currentProjectId == self.model.get('id')) currentProjectId = 0;

                            let projectIdsClone = user.get('projectIds').slice();
                            projectIdsClone.splice(projectIdsClone.indexOf(self.model.get('id')), 1);
                            user.save(
                                {
                                    currentProjectId: currentProjectId,
                                    projectIds: projectIdsClone
                                },
                                { success: function () { resolve(); } }
                            );
                        })
                    );
                });

                Promise.all(userPromises).then(function () {
                    location.reload();
                });
            })
        });
    }
});