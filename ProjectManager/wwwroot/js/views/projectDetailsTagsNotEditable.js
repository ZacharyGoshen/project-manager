ProjectManager.Views.ProjectDetailsTagsNotEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-tags',
    template: _.template(TemplateManager.templates.projectDetailsTagsNotEditable),

    renderOne: function (tag) {
        let self = this;

        let projectDetailsTagNotEditableView = new ProjectManager.Views.ProjectDetailsTagNotEditable({
            model: tag,
            collection: self.collection
        });
        return this.$el.append(projectDetailsTagNotEditableView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.tags.where({ projectId: ProjectManager.CurrentProjectId }).forEach(function (tag) {
            self.renderOne(tag);
        });
        return this;
    }
});