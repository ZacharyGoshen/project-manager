ProjectManager.Views.ProjectDetailsDescription = Backbone.View.extend({
    tagName: 'div',

    render: function () {
        let self = this;

        if (this.model.get('ownerId') == ProjectManager.LoggedInUserId) {
            let projectDetailsDescriptionEditableView = new ProjectManager.Views.ProjectDetailsDescriptionEditable({
                model: self.model
            });
            let html = projectDetailsDescriptionEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        } else {
            let projectDetailsDescriptionNotEditableView = new ProjectManager.Views.ProjectDetailsDescriptionNotEditable({
                model: self.model
            });
            let html = projectDetailsDescriptionNotEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        }

        return this;
    }
});