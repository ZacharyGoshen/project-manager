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

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/RemoveTag",
                data: {
                    taskId: self.taskId,
                    tagId: self.model.get('tagId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            let task = self.collection.tasks.findWhere({ taskId: self.taskId });

            let tagIds = task.get('tagIds');
            tagIds.splice(tagIds.indexOf(self.model.get('tagId')), 1);
            task.trigger('change');

            let taskIds = self.model.get('taskIds');
            taskIds.splice(taskIds.indexOf(self.taskId), 1);
            self.model.trigger('change');
        });
    }
});