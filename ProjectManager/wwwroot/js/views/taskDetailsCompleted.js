ProjectManager.Views.TaskDetailsCompleted = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-completed',
    className: 'flex-row font-small flex-align-center font-light-gray hover-cursor-pointer hover-font-dark-gray',
    template: _.template(TemplateManager.templates.taskDetailsCompleted),

    events: {
        'click': 'update'
    },

    initalize: function () {
        this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.append(html);

        if (this.model.get('isCompleted')) this.$('#task-details-completed-text').html('Completed');
        else this.$('#task-details-completed-text').html('Mark Completed');

        return this;
    },

    update: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/UpdateIsCompleted",
                data: {
                    taskId: self.model.get('taskId'),
                    isCompleted: !self.model.get('isCompleted')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('isCompleted', !self.model.get('isCompleted'));
        });
    }
});