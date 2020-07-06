ProjectManager.Views.ProjectDetailsTeamMembersNotEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-team-members-not-editable',
    className: '',
    template: _.template(TemplateManager.templates.projectDetailsTeamMembersNotEditable),

    initialize: function () {
        this.listenTo(this.collection.users, "update", this.render);
    },

    renderOne: function (user) {
        let self = this;

        let projectDetailsTeamMemberNotEditableView = new ProjectManager.Views.ProjectDetailsTeamMemberNotEditable({
            model: user,
            collection: self.collection
        });
        return this.$el.append(projectDetailsTeamMemberNotEditableView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.users.forEach(function (user) {
            if (user.get('userId') != ProjectManager.LoggedInUserId) self.renderOne(user);
        });
        return this;
    }
});