ProjectManager.Views.UserPictureUnassigned = Backbone.View.extend({
    tagName: 'div',
    className: 'user-picture-unassigned-small child-center',
    template: _.template(TemplateManager.templates.userPictureUnassigned),

    initialize: function (options) {
        this.hover = options.hover;
    },

    render: function () {
        let html = this.template();
        this.$el.html(html);

        if (this.hover) this.$el.addClass("hover-border-very-dark-gray hover-icon");

        return this;
    }
});