ProjectManager.Views.ProjectDetailsTeamMembers = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-team-members',
    className: '',
    template: _.template(TemplateManager.templates.projectDetailsTeamMembers),

    events: {
        'click #project-details-invite-team-member-button': 'toggleSelectUser'
    },

    initialize: function () {
        this.listenTo(this.collection.users, "update", this.render);
    },

    renderOne: function (user) {
        let self = this;

        let projectDetailsTeamMemberView = new ProjectManager.Views.ProjectDetailsTeamMember({
            model: user,
            collection: self.collection
        });
        return this.$('#project-details-invite-team-member-button').before(projectDetailsTeamMemberView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.users.forEach(function (user) {
            self.renderOne(user);
        });
        return this;
    },

    toggleSelectUser: function () {
        let self = this;

        if ($("#user-selection").length) {
            $('body').off('mousedown');
            $("#user-selection").remove();
        } else {
            let userSelectionView = new ProjectManager.Views.UserSelection({
                collection: self.collection
                //,
                //onResultClick: self.update.bind(self)
            });

            $("#main-container").append(userSelectionView.render().$el);
            userSelectionView.position(self.$('#project-details-invite-team-member-button'));
        }
    },
});