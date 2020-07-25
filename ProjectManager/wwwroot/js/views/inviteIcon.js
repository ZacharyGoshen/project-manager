ProjectManager.Views.InviteIcon = Backbone.View.extend({
    tagName: 'div',
    className: 'icon-invite background-color-dark-gray hover-background-color-very-dark-gray hover-child-border-top-very-dark-gray hover-cursor-pointer',
    template: _.template(TemplateManager.templates.inviteIcon),

    events: {
        'click': 'toggleInviteDropdownMenu',
    },

    initialize: function () {
        this.listenTo(this.collection.invites, 'update', this.render);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.$('.icon-invite-number').html(self.collection.invites.where({ inviteeId: ProjectManager.LoggedInUserId }).length);

        return this;
    },

    toggleInviteDropdownMenu: function () {
        let self = this;

        if ($("#invite-drop-down-menu").length) {
            $('body').off('mousedown');
            $("#invite-drop-down-menu").remove();
        } else {
            let inviteDropdownMenuView = new ProjectManager.Views.InviteDropdownMenu({
                collection: self.collection
            });

            $("#main-container").append(inviteDropdownMenuView.render().$el);
            inviteDropdownMenuView.position(self.$el);
        }
    }
});