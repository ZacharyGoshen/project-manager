ProjectManager.Views.Invite = Backbone.View.extend({
    tagName: 'div',
    className: 'invite font-light-gray font-small',
    template: _.template(TemplateManager.templates.invite),

    events: {
        'click .invite-accept-button': 'accept',
        'click .invite-decline-button': 'decline'
    },

    render: function () {
        let self = this;

        let html = this.template(self.model.toJSON());
        this.$el.html(html);

        return this;
    },

    accept: function () {
        let self = this;

        let project = new ProjectManager.Models.Project({ id: self.model.get('projectId') });
        new Promise(function (resolve) {
            project.fetch({
                success: function () { resolve(); }
            });
        }).then(function () {
            let teamMemberIdsClone = project.get('teamMemberIds').slice();
            teamMemberIdsClone.push(self.model.get('inviteeId'));
            project.save({ teamMemberIds: teamMemberIdsClone });
        });

        let user = this.collection.users.findWhere({ id: ProjectManager.LoggedInUserId })
        let projectIdsClone = user.get('projectIds').slice();
        projectIdsClone.push(ProjectManager.CurrentProjectId);
        user.save({
            currentProjectId: 0,
            projectIds: projectIdsClone
        });

        self.model.destroy();

        //if (ProjectManager.CurrentProjectId == 0) location.reload();
    },

    decline: function () {
        this.model.destroy();
    }
});