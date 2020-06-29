ProjectManager.Views.Popup = Backbone.View.extend({
    tagName: 'div',
    id: 'background-blur',
    className: 'child-center',
    template: _.template(TemplateManager.templates.popup),

    render: function () {
        let html = this.template();
        this.$el.html(html);
        return this;
    }
});