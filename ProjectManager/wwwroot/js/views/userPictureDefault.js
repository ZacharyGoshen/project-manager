﻿ProjectManager.Views.UserPictureDefault = Backbone.View.extend({
    tagName: 'div',
    className: 'profile-picture-small child child-center',
    template: _.template(TemplateManager.templates.userPictureDefault),

    initialize: function (options) {
        this.hover = options.hover;
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        this.$el.addClass('background-color-option-' + this.model.get('backgroundColor'));

        if (this.hover) this.$el.addClass("hover-translucent");

        return this;
    }
});