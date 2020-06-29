ProjectManager.Views.UserDropdownMenu = Backbone.View.extend({
    tagName: 'div',
    id: 'user-dropdown-menu',
    className: 'background-color-white border-light-gray font-small',
    template: _.template(TemplateManager.templates.userDropdownMenu),

    events: {
        'click #logout-button': 'logOut'
    },

    initialize: function () {
        let self = this;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            else self.remove();
        });
    },

    render: function () {
        let html = this.template();
        this.$el.html(html);
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
    },

    logOut: function () {
        location.href = 'BackboneLogin'
    }
});