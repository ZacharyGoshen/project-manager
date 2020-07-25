ProjectManager.Views.TaskDetailsDueDate = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-due-date',
    className: 'border-white flex-align-center flex-row hover-border-dark-gray hover-child-visible hover-cursor-pointer',
    template: _.template(TemplateManager.templates.taskDetailsDueDate),

    events: {
        'click': 'toggleSelectDate',
        'click .remove-button-small': 'remove'
    },

    initialize: function () {
        this.listenTo(this.model, "change:dueDate", this.render);
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let dueDateIconView = new ProjectManager.Views.DueDateIcon({
            hover: false
        });
        this.$('#task-details-due-date-icon').html(dueDateIconView.render().$el);

        if (this.model.get('dueDate') == '') {
            this.$("#task-details-due-date-text").html('Set a due date');
            this.$('.remove-button-small').remove();
        } else {
            let dueDateString = new Date(self.model.get('dueDate')).toLocaleDateString(undefined, { month: "long", day: "numeric" });
            this.$("#task-details-due-date-text").html(dueDateString);
        }

        return this;
    },

    toggleSelectDate: function () {
        let self = this;

        if (this.$('.remove-button-small:hover').length) return;

        if ($("#date-selection").length) {
            $('body').off('mousedown');
            $("#date-selection").remove();
        } else {
            let dateSelectionView = new ProjectManager.Views.DateSelection({
                collection: self.collection,
                month: new Date(),
                onDateClick: self.update.bind(self)
            });

            $("#main-container").append(dateSelectionView.render().$el);
            dateSelectionView.position(self.$el);
        }
    },

    update: function (dueDate) {
        this.model.save({ dueDate: dueDate.toISOString() });
        this.toggleSelectDate();
    },

    remove: function () {
        this.model.save({ dueDate: '' });
    },
});