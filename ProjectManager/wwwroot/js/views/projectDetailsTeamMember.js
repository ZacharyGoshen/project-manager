ProjectManager.Views.ProjectDetailsTeamMember = Backbone.View.extend({
    tagName: 'div',
    className: 'project-details-team-member border-white flex-align-center flex-row hover-child-visible',
    template: _.template(TemplateManager.templates.projectDetailsTeamMember),

    events: {
        'click .remove-button-small': 'remove'
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

    remove: function () {
        console.log('removing team member');
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Project/RemoveTeamMember",
                data: {
                    projectId: 1,
                    userId: self.model.get('userId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.collection.users.remove(self.model);
        });
    }
});