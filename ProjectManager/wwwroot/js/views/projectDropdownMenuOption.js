ProjectManager.Views.ProjectDropdownMenuOption = Backbone.View.extend({
    tagName: 'div',
    className: 'project-dropdown-menu-option font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray',

    events: {
        'click': 'updateCurrentProject'
    },

    render: function () {
        let self = this;

        this.$el.html(self.model.get('name'));
        return this;
    },

    updateCurrentProject: function () {
        let self = this;

        let user = this.collection.users.findWhere({ id: ProjectManager.LoggedInUserId });
        user.save(
            { currentProjectId: self.model.get('id') },
            { success: function () { location.reload(); } }
        );
    }
});