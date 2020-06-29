﻿ProjectManager.Views.NavigationBar = Backbone.View.extend({
    tagName: 'div',
    id: 'navigation-bar',
    className: 'border-bottom-light-gray flex-align-center flex-fit-content flex-row flex-space-between',
    template: _.template(TemplateManager.templates.navigationBar),

    events: {
        'click #navigation-bar-project': 'openProjectDetails'
    },

    initialize: function () {
        this.listenTo(this.collection.projects.findWhere({ projectId: 1 }), "change", this.render);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        let project = this.collection.projects.findWhere({ projectId: 1 });
        this.$('#navigation-bar-project').html(project.get('name'));

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: 1,
            hover: true
        });
        this.$('#navigation-bar-user').html(userPictureView.render().$el);

        return this;
    },

    openProjectDetails: function () {
        let self = this;

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);

        let projectDetailsView = new ProjectManager.Views.ProjectDetails({
            model: self.collection.projects.findWhere({ projectId: 1 }),
            collection: self.collection
        });
        $("#popup").replaceWith(projectDetailsView.render().$el);
    },
})