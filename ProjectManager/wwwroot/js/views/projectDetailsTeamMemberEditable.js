ProjectManager.Views.ProjectDetailsTeamMemberEditable = Backbone.View.extend({
    tagName: 'div',
    className: 'project-details-team-member flex-align-center flex-row hover-child-visible',
    template: _.template(TemplateManager.templates.projectDetailsTeamMemberEditable),

    events: {
        'click .remove-button-small': 'onClickRemove'
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('id'),
            hover: false
        });
        this.$(".project-details-team-member-picture").html(userPictureView.render().$el);

        let user = self.collection.users.findWhere({ id: self.model.get('id') });
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

        this.collection.invites.where({ inviterId: self.model.get('id') }).forEach(function (invite) {
            invite.destroy();
        });

        let assignedTaskIdsClone = self.model.get('assignedTaskIds').slice();
        this.collection.tasks.where({ assignedUserId: self.model.get('id') }).forEach(function (task) {
            assignedTaskIdsClone.splice(assignedTaskIdsClone.indexOf(task.get('id')), 1);
            task.save({ assignedUserId: 0 });
        });

        let project = this.collection.projects.findWhere({ id: ProjectManager.CurrentProjectId });
        let teamMemberIdsClone = project.get('teamMemberIds').slice();
        teamMemberIdsClone.splice(teamMemberIdsClone.indexOf(self.model.get('id')), 1);
        project.save({
            teamMemberIds: teamMemberIdsClone
        });

        let projectIdsClone = self.model.get('projectIds').slice();
        projectIdsClone.splice(projectIdsClone.indexOf(project.get('id')), 1);
        self.model.save({
            assignedTaskIds: assignedTaskIdsClone,
            currentProjectId: 0,
            projectIds: projectIdsClone
        });
    }
});