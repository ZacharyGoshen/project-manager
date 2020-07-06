ProjectManager.Views.ProjectDetailsName = Backbone.View.extend({
    tagName: 'div',

    render: function () {
        let self = this;

        if (this.model.get('ownerId') == ProjectManager.LoggedInUserId) {
            let projectDetailsNameEditableView = new ProjectManager.Views.ProjectDetailsNameEditable({
                model: self.model
            });
            let html = projectDetailsNameEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        } else {
            let projectDetailsNameNotEditableView = new ProjectManager.Views.ProjectDetailsNameNotEditable({
                model: self.model
            });
            let html = projectDetailsNameNotEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        }

        return this;
    }
});