ProjectManager.Views.UserPictureDefaultLarge = Backbone.View.extend({
    tagName: 'div',
    className: 'profile-picture-large child-center hover-cursor-pointer hover-translucent',
    template: _.template(TemplateManager.templates.userPictureDefault),

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        this.$el.addClass('background-color-option-' + this.model.get('backgroundColor'));

        return this;
    }
});