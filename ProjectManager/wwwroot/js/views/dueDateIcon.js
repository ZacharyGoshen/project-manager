ProjectManager.Views.DueDateIcon = Backbone.View.extend({
    tagName: 'div',
    className: 'child-center due-date-unassigned-small',
    template: _.template(TemplateManager.templates.dueDateIcon),

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