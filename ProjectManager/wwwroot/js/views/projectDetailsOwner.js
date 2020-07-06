ProjectManager.Views.ProjectDetailsOwner = Backbone.View.extend({
    tagOwner: 'div',

    render: function () {
        let self = this;

        if (this.model.get('ownerId') == ProjectManager.LoggedInUserId) {
            let projectDetailsOwnerEditableView = new ProjectManager.Views.ProjectDetailsOwnerEditable({
                model: self.model,
                collection: self.collection
            });
            let html = projectDetailsOwnerEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        } else {
            let projectDetailsOwnerNotEditableView = new ProjectManager.Views.ProjectDetailsOwnerNotEditable({
                model: self.model,
                collection: self.collection
            });
            let html = projectDetailsOwnerNotEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        }

        return this;
    }
});