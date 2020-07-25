ProjectManager.Views.UserPictureDefaultLarge = Backbone.View.extend({
    tagName: 'div',
    className: 'profile-picture-large child-center hover-cursor-pointer hover-translucent',
    template: _.template(TemplateManager.templates.userPictureDefault),

    initialize: function () {
        this.listenTo(this.model, 'change:backgroundColor', this.render);
        this.listenTo(this.model, 'change:firstName', this.render);
        this.listenTo(this.model, 'change:lastName', this.render);
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        this.$el.removeClass();
        this.$el.addClass(self.className);
        this.$el.addClass('background-color-option-' + this.model.get('backgroundColor'));

        return this;
    }
});