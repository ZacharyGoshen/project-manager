ProjectManager.Views.ProjectDetailsTagNotEditable = Backbone.View.extend({
    tagName: 'div',
    className: 'project-details-tag flex-align-center flex-row',
    template: _.template(TemplateManager.templates.projectDetailsTagNotEditable),

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    }
});