ProjectManager.Views.ProjectDropdownMenu = Backbone.View.extend({
    tagName: 'div',
    id: 'project-dropdown-menu',
    className: 'background-color-white border-light-gray font-small',
    template: _.template(TemplateManager.templates.projectDropdownMenu),

    events: {
        'click #new-project-button': 'openNewProject'
    },

    initialize: function () {
        let self = this;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            else self.remove();
        });
    },

    renderOne: function (project) {
        let self = this;

        let projectDropdownMenuOptionView = new ProjectManager.Views.ProjectDropdownMenuOption({
            model: project,
            collection: self.collection
        });
        this.$('#new-project-button').before(projectDropdownMenuOptionView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.projects.forEach(function (project) {
            if (project.get('id') != ProjectManager.CurrentProjectId) self.renderOne(project);
        });

        return this;
    },

    position: function (button) {
        let self = this;

        this.$el.offset({
            top: button.offset().top + button.outerHeight(),
            left: button.offset().left
        });
    },

    remove: function () {
        $('body').off('mousedown');
        this.$el.remove();
    },

    openNewProject: function () {
        let self = this;

        let newProjectView = new ProjectManager.Views.NewProject({
            collection: self.collection
        });

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);
        $(".popup").last().append(newProjectView.render().$el);

        self.remove();
    }
});