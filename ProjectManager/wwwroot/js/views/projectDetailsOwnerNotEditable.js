ProjectManager.Views.ProjectDetailsOwnerNotEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-owner',
    className: 'border-white flex-align-center flex-row',
    template: _.template(TemplateManager.templates.projectDetailsOwner),

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('ownerId'),
            hover: false
        });
        this.$("#project-details-owner-picture").html(userPictureView.render().$el);

        let owner = self.collection.users.findWhere({ id: self.model.get('ownerId') });
        this.$("#project-details-owner-name").html(owner.get('firstName') + ' ' + owner.get('lastName'));

        return this;
    }
});