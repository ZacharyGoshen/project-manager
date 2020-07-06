ProjectManager.Views.TaskDetailsComment = Backbone.View.extend({
    tagName: 'div',
    className: 'task-details-comment flex-align-baseline flex-row flex-space-between hover-child-visible',
    template: _.template(TemplateManager.templates.taskDetailsComment),

    events: {
        'click .task-details-comment-delete-button': 'delete'
    },

    render: function () {
        let self = this;

        let html = this.template(self.model.toJSON());
        this.$el.html(html);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('userId'),
            hover: false
        });
        this.$('.task-details-comment-user').html(userPictureView.render().$el);

        let creationTime = new Date(this.model.get('creationTime') + 'Z');
        let creationTimeString = creationTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour12: true, hour: '2-digit', minute: '2-digit'});
        this.$('.task-details-comment-creation-time').html(creationTimeString);

        if (this.model.get('userId') != ProjectManager.LoggedInUserId) self.$('.task-details-comment-delete-button').remove();

        return this;
    },

    delete: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Comment/Delete",
                data: {
                    commentId: self.model.get('commentId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.collection.comments.remove(self.model);
        });
    }
});