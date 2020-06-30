ProjectManager.Views.ProjectDetails = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details',
    className: 'background-color-white border-light-gray flex-column',
    template: _.template(TemplateManager.templates.projectDetails),

    events: {
        'click #project-details-close-button': 'close',
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

        return this;
    },

    close: function () {
        $('.popup').last().remove();
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