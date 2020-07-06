ProjectManager.Views.ProjectDetailsTeamMemberEditable = Backbone.View.extend({
    tagName: 'div',
    className: 'project-details-team-member flex-align-center flex-row hover-child-visible',
    template: _.template(TemplateManager.templates.projectDetailsTeamMemberEditable),

    events: {
        'click .remove-button-small': 'onClickRemove'
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('userId'),
            hover: false
        });
        this.$(".project-details-team-member-picture").html(userPictureView.render().$el);

        let user = self.collection.users.findWhere({ userId: self.model.get('userId') });
        this.$(".project-details-team-member-name").html(user.get('firstName') + ' ' + user.get('lastName'));

        return this;
    },

    onClickRemove: function () {
        let self = this;

        let confirmationView = new ProjectManager.Views.Confirmation({
            message: 'Removing this user will delete all of their comments and unassign all of their tasks. Are you sure?',
            submitText: 'Remove User',
            onSubmit: self.remove.bind(self)
        });
        $('#background-blur').append(confirmationView.render().$el);

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);
        $('.popup').last().append(confirmationView.render().$el);
    },

    remove: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Project/RemoveTeamMember",
                data: {
                    projectId: ProjectManager.CurrentProjectId,
                    userId: self.model.get('userId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            let teamMemberIds = self.collection.projects
                .findWhere({ projectId: ProjectManager.CurrentProjectId })
                .get('teamMemberIds');
            teamMemberIds.splice(teamMemberIds.indexOf(self.model.get('userId'), 1));
            self.collection.projects
                .findWhere({ projectId: ProjectManager.CurrentProjectId })
                .trigger('change');

            self.collection.tasks
                .where({ assignedUserId: self.model.get('userId') })
                .forEach(function (task) { task.set('assignedUserId', 0); });

            self.collection.comments
                .where({ userId: self.model.get('userId') })
                .forEach(function (comment) { self.collection.comments.remove(comment); });

            self.collection.users.remove(self.model);
            self.collection.users.trigger('update');
        });
    }
});