ProjectManager.Views.DueDateAssigned = Backbone.View.extend({
    tagName: 'div',
    className: 'font-light-gray font-small hover-font-dark-gray',
    template: _.template(TemplateManager.templates.dueDateAssigned),

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    }
});