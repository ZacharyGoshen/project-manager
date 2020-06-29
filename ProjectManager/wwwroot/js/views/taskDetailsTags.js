ProjectManager.Views.TaskDetailsTags = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-tags',
    template: _.template(TemplateManager.templates.taskDetailsTags),

    events: {
        'click #task-details-add-tag-button': 'toggleSelectTag',
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    },

    toggleSelectTag: function () {
        let self = this;

        if ($("#tag-selection").length) {
            $('body').off('mousedown');
            $("#tag-selection").remove();
        } else {
            let tagSelectionView = new ProjectManager.Views.TagSelection({
                collection: self.collection
            });

            $("#main-container").append(tagSelectionView.render().$el);
            tagSelectionView.position(self.$el);
        }
    },
});