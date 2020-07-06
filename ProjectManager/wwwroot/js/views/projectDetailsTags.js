ProjectManager.Views.ProjectDetailsTags = Backbone.View.extend({
    tagName: 'div',

    render: function () {
        let self = this;

        if (this.model.get('ownerId') == ProjectManager.LoggedInUserId) {
            let projectDetailsTagsEditableView = new ProjectManager.Views.ProjectDetailsTagsEditable({
                model: self.model,
                collection: self.collection
            });
            let html = projectDetailsTagsEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        } else {
            let projectDetailsTagsNotEditableView = new ProjectManager.Views.ProjectDetailsTagsNotEditable({
                model: self.model,
                collection: self.collection
            });
            let html = projectDetailsTagsNotEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        }

        return this;
    }
});