ProjectManager.Views.TaskDetailsComments = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-comments',

    initialize: function () {
        this.listenTo(this.collection.comments, "remove", this.render);
    },

    renderOne: function (comment) {
        let self = this;

        let taskDetailsCommentView = new ProjectManager.Views.TaskDetailsComment({
            model: comment,
            collection: self.collection
        });
        return this.$el.append(taskDetailsCommentView.render().$el);
    },

    render: function () {
        let self = this;

        this.$el.html('');
        this.collection.comments.forEach(function (comment) {
            self.renderOne(comment);
        });
        return this;
    }
});