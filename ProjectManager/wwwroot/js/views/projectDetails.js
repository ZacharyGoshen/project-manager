ProjectManager.Views.ProjectDetails = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details',
    className: 'background-color-white border-light-gray',
    template: _.template(TemplateManager.templates.projectDetails),

    events: {
        'click #project-details-close-button': 'close',
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let projectDetailsNameView = new ProjectManager.Views.ProjectDetailsName({
            model: self.model
        });
        this.$('#project-details-name').replaceWith(projectDetailsNameView.render().$el);

        let projectDetailsDescriptionView = new ProjectManager.Views.ProjectDetailsDescription({
            model: self.model
        });
        this.$('#project-details-description').replaceWith(projectDetailsDescriptionView.render().$el);

        let projectDetailsOwnerView = new ProjectManager.Views.ProjectDetailsOwner({
            model: self.model,
            collection: self.collection
        });
        this.$('#project-details-owner').replaceWith(projectDetailsOwnerView.render().$el);

        let projectDetailsTeamMembersView = new ProjectManager.Views.ProjectDetailsTeamMembers({
            model: self.model,
            collection: self.collection
        });
        this.$('#project-details-team-members').replaceWith(projectDetailsTeamMembersView.render().$el);

        return this;
    },

    close: function () {
        $('#background-blur').remove();
    },
});