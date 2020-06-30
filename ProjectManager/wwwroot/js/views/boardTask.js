ProjectManager.Views.BoardTask = Backbone.View.extend({
    tagName: 'div',
    className: 'board-task border-light-gray border-shadow flex-row flex-space-between hover-border-dark-gray hover-cursor-pointer',
    template: _.template(TemplateManager.templates.boardTask),

    events: {
        'click': 'openDetails',
        'click .board-task-user-picture': 'toggleSelectUser',
        'click .board-task-due-date': 'toggleSelectDate',
        'click .board-task-delete-button': 'delete'
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
        let self = this;

        let taskHtml = this.template(this.model.toJSON());
        this.$el.html(taskHtml);

        this.$('.board-task-priority').html(priorityToString(self.model.get('priority')));

        if (this.model.get('isCompleted') == true) {
            this.$el.addClass('translucent');
        } else {
            this.$el.removeClass('translucent');
            this.$('.board-task-check').remove();
        }

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('assignedUserId'),
            hover: true
        });
        this.$('.board-task-user-picture').html(userPictureView.render().$el);

        let dueDateUtc = new Date(this.model.get('dueDate') + 'Z')
        if (dueDateUtc.getTime() == new Date('0001-01-01T00:00:00Z').getTime()) {
            let dueDateIconView = new ProjectManager.Views.DueDateIcon({
                hover: true
            });
            this.$('.board-task-due-date').html(dueDateIconView.render().$el);
        } else {
            let dueDateAssignedView = new ProjectManager.Views.DueDateAssigned({
                model: self.model
            });
            this.$('.board-task-due-date').html(dueDateAssignedView.render().$el);
        }

        if (this.model.get('tagIds').length == 0) {
            self.$('.board-task-tags').addClass('hidden');
        }

        this.model.get('tagIds').forEach(function (tagId) {
            let tag = self.collection.tags.findWhere({ tagId: tagId });
            let boardTaskTagView = new ProjectManager.Views.BoardTaskTag({
                model: tag
            });
            self.$('.board-task-tags').append(boardTaskTagView.render().$el);
        });

        return this;
    },

    openDetails: function () {
        let self = this;

        if (self.$('.board-task-user-picture:hover').length) return;
        if (self.$('.board-task-due-date:hover').length) return;
        if (self.$('.board-task-delete-button:hover').length) return;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'GET',
                url: '/Comment/GetAllInTask',
                data: {
                    taskId: self.model.get('taskId'),
                },
                success: function (comments) {
                    self.collection.comments.reset();
                    for (comment of comments) {
                        self.collection.comments.add(comment);
                    }
                    resolve();
                }
            });
        }).then(function () {
            let taskDetailsView = new ProjectManager.Views.TaskDetails({
                model: self.model,
                collection: self.collection
            });

            let popupView = new ProjectManager.Views.Popup();
            $('#main-container').append(popupView.render().$el);
            $('.popup').last().append(taskDetailsView.render().$el);
        });
    },

    toggleSelectUser: function () {
        let self = this;
        if ($('#user-selection').length) {
            $('body').off('mousedown');
            $('#user-selection').remove();
        } else {
            let userSelectionView = new ProjectManager.Views.UserSelection({
                collection: self.collection,
                onResultClick: self.updateUser.bind(self)
            });

            $('#main-container').append(userSelectionView.render().$el);
            userSelectionView.position(self.$('.board-task-user-picture'));
        }
    },

    updateUser: function (user) {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/Task/UpdateAssignedUser',
                data: {
                    taskId: self.model.get('taskId'),
                    userId: user.get('userId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('assignedUserId', user.get('userId'));
            self.toggleSelectUser();
        });
    },

    toggleSelectDate: function () {
        let self = this;
        if ($('#date-selection').length) {
            $('body').off('mousedown');
            $('#date-selection').remove();
        } else {
            let dateSelectionView = new ProjectManager.Views.DateSelection({
                collection: self.collection,
                month: new Date(),
                onDateClick: self.updateDueDate.bind(self)
            });

            $('#main-container').append(dateSelectionView.render().$el);
            dateSelectionView.position(self.$('.board-task-due-date'));
        }
    },

    updateDueDate: function (date) {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/Task/UpdateDueDate',
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

    delete: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/Task/Delete',
                data: {
                    taskId: self.model.get('taskId')
                },
                success: function () {
                    let taskIds = self.collection.categories
                        .findWhere({ categoryId: self.model.get('categoryId') })
                        .get('taskIds');
                    taskIds.splice(taskIds.indexOf(self.model.get('taskId')), 1);

                    self.collection.tasks
                        .where({ categoryId: self.model.get('categoryId') })
                        .filter(function (task) {
                            return task.get('order') > self.model.get('order');
                        })
                        .forEach(
                            task => task.set('order', task.get('order') - 1)
                        );
                    resolve();
                }
            });
        }).then(function () {
            self.collection.tasks.remove(self.model);
        });
    }
});