ProjectManager.Views.TaskDetailsTag = Backbone.View.extend({
    tagName: 'div',
    className: 'task-details-tag flex-align-center flex-row hover-child-visible',
    template: _.template(TemplateManager.templates.taskDetailsTag),

    events: {
        'click .remove-button-small': 'remove'
    },

    initialize: function (options) {
        this.taskId = options.taskId;
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    },

    remove: function () {
        let self = this;

        let task = this.collection.tasks.findWhere({ id: self.taskId });
        let tagIdsClone = task.get('tagIds').slice();
        tagIdsClone.splice(tagIdsClone.indexOf(self.model.get('id')), 1);
        task.save({ tagIds: tagIdsClone });

        let taskIdsClone = self.model.get('taskIds').slice();
        taskIdsClone.splice(taskIdsClone.indexOf(self.taskId), 1);
        self.model.save({ taskIds: taskIdsClone });
    }
});