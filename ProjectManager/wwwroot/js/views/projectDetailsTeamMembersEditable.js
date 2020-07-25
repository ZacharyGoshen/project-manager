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

        this.listenTo(this.model, "change:teamMemberIds", this.render);

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
            if (!self.model.get('teamMemberIds').includes(user.get('id'))) return;
            if (user.get('id') == ProjectManager.LoggedInUserId) return;

            self.renderOne(user);
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

        let inviter = this.collection.users.findWhere({ id: ProjectManager.LoggedInUserId });
        if (input == inviter.get('email')) {
            self.$('#project-details-invite-team-member-message').html('You cannot invite yourself.');
            self.$('#project-details-invite-team-member-message').removeClass('hidden');
            return;
        }

        let invitee = null;
        new Promise(function (resolve) {
            if (ProjectManager.Demo) {
                invitee = this.collection.users.findWhere({ email: input });
                resolve();
            } else {
                Backbone.ajax({
                    type: "GET",
                    url: "/User/GetWithEmail",
                    data: { email: input },
                    success: function (user) {
                        invitee = new ProjectManager.Models.User(user);
                        resolve();
                    }
                });
            }
        }).then(function () {
            if (!invitee) {
                self.$('#project-details-invite-team-member-message').html('User does not exist with that email.');
                self.$('#project-details-invite-team-member-message').removeClass('hidden');
                return;
            }

            if (invitee.get('projectIds').includes(ProjectManager.CurrentProjectId)) {
                self.$('#project-details-invite-team-member-message').html('User is already a team member.');
                self.$('#project-details-invite-team-member-message').removeClass('hidden');
                return;
            }

            if (self.collection.invites.findWhere({
                inviteeId: invitee.get('id'),
                inviterId: inviter.get('id')
            })) {
                self.$('#project-details-invite-team-member-message').html('User has already been invited.');
                self.$('#project-details-invite-team-member-message').removeClass('hidden');
                return;
            }

            self.collection.invites.create(
                {
                    inviteeId: invitee.get('id'),
                    inviterId: ProjectManager.LoggedInUserId,
                    projectId: ProjectManager.CurrentProjectId
                },
                {
                    success: function () {
                        self.$('#project-details-invite-team-member-message').html('Invite sent.');
                        self.$('#project-details-invite-team-member-message').removeClass('hidden');
                    }
                }
            );
        });
    }
});