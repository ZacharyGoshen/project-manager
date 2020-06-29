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
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let dueDateIconView = new ProjectManager.Views.DueDateIcon({
            hover: false
        });
        this.$('#task-details-due-date-icon').html(dueDateIconView.render().$el);

        let dueDate = new Date(this.model.get('dueDate'));
        let dueDateUtc = new Date(this.model.get('dueDate') + 'Z')
        if (dueDateUtc.getTime() == new Date('0001-01-01T00:00:00Z').getTime()) {
            this.$("#task-details-due-date-text").html('Set a due date');
        } else {
            let dueDateString = dueDate.toLocaleDateString(undefined, { month: "long", day: "numeric" });
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

    update: function (date) {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/UpdateDueDate",
                data: {
                    taskId: self.model.get('taskId'),
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('dueDate', date);
            self.toggleSelectDate();
        });
    },

    remove: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/UpdateDueDate",
                data: {
                    taskId: self.model.get('taskId'),
                    year: 0,
                    month: 0,
                    day: 1
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('dueDate', '0001-01-01T00:00:00');
        });
    },
});