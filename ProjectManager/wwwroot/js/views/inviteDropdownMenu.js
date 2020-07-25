ProjectManager.Views.InviteDropdownMenu = Backbone.View.extend({
    tagName: 'div',
    id: 'invite-dropdown-menu',
    className: 'background-color-white border-light-gray font-small',
    template: _.template(TemplateManager.templates.inviteDropdownMenu),

    initialize: function () {
        let self = this;

        this.listenTo(this.collection.invites, "update", this.render);

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            else self.remove();
        });
    },

    renderOne: function (invite) {
        let self = this;

        let inviteView = new ProjectManager.Views.Invite({
            model: invite,
            collection: self.collection
        });
        this.$el.append(inviteView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        if (this.collection.invites.where({ inviteeId: ProjectManager.LoggedInUserId }).length == 0) {
            self.$('#invite-empty').removeClass('hidden');
        }

        this.collection.invites.where({ inviteeId: ProjectManager.LoggedInUserId }).forEach(function (invite) {
            self.renderOne(invite);
        });

        return this;
    },

    position: function (button) {
        let self = this;

        this.$el.offset({
            top: button.offset().top + button.outerHeight(),
            left: button.offset().left + button.outerWidth() - self.$el.outerWidth()
        });
    },

    remove: function () {
        $('body').off('mousedown');
        this.$el.remove();
    }
});