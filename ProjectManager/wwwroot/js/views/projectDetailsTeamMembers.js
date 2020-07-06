ProjectManager.Views.ProjectDetailsTeamMembers = Backbone.View.extend({
    tagName: 'div',

    render: function () {
        let self = this;

        if (this.model.get('ownerId') == ProjectManager.LoggedInUserId) {
            let projectDetailsTeamMembersEditableView = new ProjectManager.Views.ProjectDetailsTeamMembersEditable({
                model: self.model,
                collection: self.collection
            });
            let html = projectDetailsTeamMembersEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        } else {
            let projectDetailsTeamMembersNotEditableView = new ProjectManager.Views.ProjectDetailsTeamMembersNotEditable({
                model: self.model,
                collection: self.collection
            });
            let html = projectDetailsTeamMembersNotEditableView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        }

        return this;
    }
});