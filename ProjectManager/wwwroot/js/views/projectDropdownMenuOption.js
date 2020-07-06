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

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/User/UpdateCurrentProjectId",
                data: {
                    userId: ProjectManager.LoggedInUserId,
                    projectId: self.model.get('projectId')
                },
                success: function () {
                    resolve()
                }
            });
        }).then(function () {
            location.reload()
        });
    }
});