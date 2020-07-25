ProjectManager.Views.TaskDetailsCompleted = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-completed',
    className: 'flex-row font-small flex-align-center font-light-gray hover-cursor-pointer hover-font-dark-gray',
    template: _.template(TemplateManager.templates.taskDetailsCompleted),

    events: {
        'click': 'update'
    },

    initialize: function () {
        this.listenTo(this.model, 'change:isCompleted', this.render);
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        if (this.model.get('isCompleted')) this.$('#task-details-completed-text').html('Completed');
        else this.$('#task-details-completed-text').html('Mark Completed');

        return this;
    },

    update: function () {
        let self = this;

        this.model.save({ isCompleted: !self.model.get('isCompleted') });
    }
});