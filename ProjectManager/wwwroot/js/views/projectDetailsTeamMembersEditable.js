ProjectManager.Views.ProjectDetailsTeamMembersEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-team-members-editable',
    className: '',
    template: _.template(TemplateManager.templates.projectDetailsTeamMembersEditable),

    events: {
        'click #project-details-invite-team-member-button': 'showInput',
        'keypress #project-details-invite-team-member-input': 'sendInviteOnEnter'
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

        let projectDetailsTeamMemberEditableView = new ProjectManager.Views.ProjectDetailsTeamMemberEditable({
            model: user,
            collection: self.collection
        });
        return this.$('#project-details-invite-team-member-button').parent().before(projectDetailsTeamMemberEditableView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.users.forEach(function (user) {
            if (user.get('userId') != ProjectManager.LoggedInUserId) self.renderOne(user);
        });
        return this;
    },

    showInput: function () {
        self.$('#project-details-invite-team-member-message').addClass('hidden');
        this.$('#project-details-invite-team-member-button').addClass('hidden');
        this.$('#project-details-invite-team-member-input').removeClass('hidden');
        this.$('#project-details-invite-team-member-input').focus();
    },

    hideInput: function () {
        this.$('#project-details-invite-team-member-button').removeClass('hidden');
        this.$('#project-details-invite-team-member-input').addClass('hidden');
        this.$('#project-details-invite-team-member-input').val('');
    },

    sendInviteOnEnter: function (event) {
        let self = this;

        if (event.keyCode != 13) return;

        event.preventDefault();

        let input = this.$('#project-details-invite-team-member-input').val();
        if (!input) return;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Invite/Create",
                data: {
                    inviterId: ProjectManager.LoggedInUserId,
                    projectId: ProjectManager.CurrentProjectId,
                    email: input
                },
                success: function (inviteId) {
                    resolve(inviteId);
                }
            });
        }).then(function (inviteId) {
            if (inviteId == -1) {
                self.$('#project-details-invite-team-member-message').html('You cannot invite yourself.');
            } else if (inviteId == -2) {
                self.$('#project-details-invite-team-member-message').html('User does not exist with that email.');
            } else if (inviteId == -3) {
                self.$('#project-details-invite-team-member-message').html('User has already been invited.');
            } else if (inviteId == -4) {
                self.$('#project-details-invite-team-member-message').html('User is already a team member.');
            } else {
                self.$('#project-details-invite-team-member-message').html('Invite sent!');
            }
            self.$('#project-details-invite-team-member-message').removeClass('hidden');
            self.hideInput();
        });
    }
});