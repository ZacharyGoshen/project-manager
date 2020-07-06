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

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
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

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Project/RemoveTeamMember",
                data: {
                    projectId: ProjectManager.CurrentProjectId,
                    userId: ProjectManager.LoggedInUserId
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.collection.tasks
                .where({ assignedUserId: self.model.get('userId') })
                .forEach(function (task) { task.set('assignedUserId', 0) });

            self.collection.tasks
                .where({ assignedUserId: self.model.get('userId') })
                .forEach(function (task) { task.set('assignedUserId', 0) });

            self.collection.users.remove(self.model);
            self.collection.users.trigger('update');

            location.reload();
        });
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

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/Project/Delete',
                data: {
                    projectId: self.model.get('projectId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: 'POST',
                    url: '/User/UpdateCurrentProjectId',
                    data: {
                        userId: ProjectManager.LoggedInUserId,
                        projectId: 0
                    },
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function() {
            location.reload();
        });
    }
});