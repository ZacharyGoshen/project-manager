ProjectManager.Views.ProjectDetailsTeamMemberNotEditable = Backbone.View.extend({
    tagName: 'div',
    className: 'project-details-team-member flex-align-center flex-row',
    template: _.template(TemplateManager.templates.projectDetailsTeamMemberNotEditable),

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('id'),
            hover: false
        });
        this.$(".project-details-team-member-picture").html(userPictureView.render().$el);

        let user = self.collection.users.findWhere({ id: self.model.get('id') });
        this.$(".project-details-team-member-name").html(user.get('firstName') + ' ' + user.get('lastName'));

        return this;
    }
});