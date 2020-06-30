ProjectManager.Views.ProjectDetailsTeamMembers = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-team-members',
    className: '',
    template: _.template(TemplateManager.templates.projectDetailsTeamMembers),

    events: {
        'click #project-details-invite-team-member-button': 'showInput'
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.collection.users, "update", this.render);

        $('body').on('mousedown', function () {
            if (self.$('#project-details-invite-team-member-input:hover').length) return;
            else self.hideInput();
        });
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

    showInput: function () {
        this.$('#project-details-invite-team-member-button').addClass('hidden');
        this.$('#project-details-invite-team-member-input').removeClass('hidden');
        this.$('#project-details-invite-team-member-input').focus();
    },

    hideInput: function () {
        this.$('#project-details-invite-team-member-button').removeClass('hidden');
        this.$('#project-details-invite-team-member-input').addClass('hidden');
        this.$('#project-details-invite-team-member-input').val('');
    }
});