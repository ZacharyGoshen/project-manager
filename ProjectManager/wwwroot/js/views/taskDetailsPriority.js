ProjectManager.Views.TaskDetailsPriority = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-priority',
    className: 'border-white flex-align-center flex-row hover-border-dark-gray hover-child-visible hover-cursor-pointer',
    template: _.template(TemplateManager.templates.taskDetailsPriority),

    events: {
        'click': 'toggleSelectPriority',
        'click .remove-button-small': 'remove'
    },

    initialize: function () {
        this.listenTo(this.model, "change:priority", this.render);
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        this.$('#task-details-priority-text').html(priorityToString(self.model.get('priority')));

        if (!this.model.get('priority')) this.$('.remove-button-small').remove();

        return this;
    },

    toggleSelectPriority: function () {
        let self = this;

        if (this.$('.remove-button-small:hover').length) return;

        if ($("#priority-selection").length) {
            $('body').off('mousedown');
            $("#priority-selection").remove();
        } else {
            let prioritySelectionView = new ProjectManager.Views.PrioritySelection({
                collection: self.collection,
                onPriorityClick: self.update.bind(self)
            });

            $("#main-container").append(prioritySelectionView.render().$el);
            prioritySelectionView.position(self.$el);
        }
    },

    update: function (priority) {
        let self = this;

        this.model.save({ priority: priority });
        this.toggleSelectPriority();
    },

    remove: function () {
        this.model.save({ priority: 0 });
    }
});