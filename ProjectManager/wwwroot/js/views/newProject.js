ProjectManager.Views.NewProject = Backbone.View.extend({
    tagName: 'div',
    id: 'new-project',
    className: 'background-color-white border-light-gray flex-column',
    template: _.template(TemplateManager.templates.newProject),

    events: {
        'click #new-project-close-button': 'close',
        'click #new-project-create-button': 'createProject'
    },

    initialize: function () {
        let self = this;
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);
        return this;
    },

    close: function () {
        $('.popup').last().remove();
    },

    createProject: function () {
        let self = this;

        let name = this.$('#new-project-name').val();
        if (!name) return;

        let description = this.$('#new-project-description').val();

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Project/Create",
                data: {
                    userId: ProjectManager.LoggedInUserId,
                    name: name,
                    description: description
                },
                success: function (newProjectId) {
                    resolve(newProjectId);
                }
            });
        }).then(function (newProjectId) {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "POST",
                    url: "/User/UpdateCurrentProjectId",
                    data: {
                        userId: ProjectManager.LoggedInUserId,
                        projectId: newProjectId
                    },
                    success: function () {
                        resolve()
                    }
                });
            });
        }).then(function () {
            location.reload()
        });
    },
});