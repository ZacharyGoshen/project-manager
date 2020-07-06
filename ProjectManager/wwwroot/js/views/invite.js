ProjectManager.Views.Invite = Backbone.View.extend({
    tagName: 'div',
    className: 'invite font-light-gray font-small',
    template: _.template(TemplateManager.templates.invite),

    events: {
        'click .invite-accept-button': 'accept'
    },

    render: function () {
        let self = this;

        let html = this.template(self.model.toJSON());
        this.$el.html(html);

        return this;
    },

    accept: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Project/AddTeamMember",
                data: {
                    projectId: self.model.get('projectId'),
                    userId: self.model.get('inviteeId')
                },
                success: function () {
                    resolve()
                }
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "POST",
                    url: "/Invite/Delete",
                    data: {
                        inviteId: self.model.get('inviteId')
                    },
                    success: function () {
                        resolve()
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Project/Get",
                    data: {
                        projectId: self.model.get('projectId')
                    },
                    success: function (project) {
                        resolve(project)
                    }
                });
            });
        }).then(function (project) {
            if (ProjectManager.CurrentProjectId == 0) location.reload();

            self.collection.projects.add(project);
            self.collection.invites.remove(self.model);
            self.remove();
        });
    }
});