ProjectManager.Views.BoardCategory = Backbone.View.extend({
    tagName: 'div',
    className: 'board-category flex-column',
    template: _.template(TemplateManager.templates.boardCategory),

    events: {
        'click .board-new-task-button': 'toggleInput',
        'click .board-category-delete-button': 'delete',
        'keypress .board-new-task-input': 'createTaskOnEnter'
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.collection.tasks, "update", function () {
            self.render();
        });
        this.listenTo(this.model, "change", this.render);

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$('.board-new-task-input'))) return;
            if (self.$('.board-new-task-button:hover').length) return;
            else self.hideInput();
        });
    },

    renderOne: function (task) {
        let self = this;
        let taskView = new ProjectManager.Views.BoardTask({
            model: task,
            collection: self.collection
        });
        this.$('.board-category-tasks').append(taskView.render().$el);
    },

    render: function () {
        let self = this;
        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let categoryId = this.model.get('categoryId');

        this.collection.tasks.comparator = 'order';
        this.collection.tasks.sort();
        this.collection.tasks.where({ categoryId: categoryId }).forEach(task => self.renderOne(task));
        return this;
    },

    toggleInput: function () {
        let input = this.$('.board-new-task-input');
        if (input.hasClass('hidden')) {
            input.removeClass('hidden');
        } else {
            this.hideInput();
        }
    },

    hideInput: function () {
        let input = this.$('.board-new-task-input');
        input.val('');
        input.addClass('hidden');
    },

    createTaskOnEnter: function (event) {
        let self = this;
        if (event.keyCode != 13) return;

        event.preventDefault();

        let input = this.$('.board-new-task-input').val();
        if (!input) return;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/Create",
                data: {
                    userId: 1,
                    projectId: 1,
                    categoryId: self.model.get('categoryId'),
                    taskName: input
                },
                success: function (newTaskId) {
                    self.model.get('taskIds').push(newTaskId);
                    self.collection.tasks.where({ categoryId: self.model.get('categoryId') }).forEach(
                        task => task.set('order', task.get('order') + 1)
                    );
                    resolve(newTaskId);
                }
            });
        }).then(function (newTaskId) {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Task/Get",
                    data: {
                        taskId: newTaskId
                    },
                    success: function (newTask) {
                        resolve(newTask);
                    }
                });
            });
        }).then(function (newTask) {
            self.collection.tasks.add(newTask);
        });
    },

    delete: function () {
        let self = this;

        if (this.model.get('taskIds').length) {
            let popupView = new ProjectManager.Views.Popup();
            $('#main-container').append(popupView.render().$el);

            let deleteCategoryConfirmationView = new ProjectManager.Views.DeleteCategoryConfirmation({
                model: self.model,
                collection: self.collection
            });
            $('#popup').replaceWith(deleteCategoryConfirmationView.render().$el);
        } else {
            new Promise(function (resolve) {
                Backbone.ajax({
                    type: "POST",
                    url: "/Category/Delete",
                    data: {
                        categoryId: self.model.get('categoryId')
                    },
                    success: function () {
                        resolve();
                    }
                });
            }).then(function () {
                self.collection.categories.remove(self.model);
            });
        }
    }
});