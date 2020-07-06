ProjectManager.Views.SortIcon = Backbone.View.extend({
    tagName: 'div',
    className: 'icon-user flex-align-center flex-row hover-child-background-color-very-dark-gray hover-child-border-top-color-very-dark-gray',
    template: _.template(TemplateManager.templates.sortIcon),

    render: function () {
        let html = this.template();
        this.$el.html(html);
        return this;
    }
});