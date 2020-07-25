ProjectManager.Views.BoardTask = Backbone.View.extend({
    tagName: 'div',
    className: 'board-task border-light-gray border-shadow flex-row flex-space-between hover-border-dark-gray hover-cursor-pointer',
    template: _.template(TemplateManager.templates.boardTask),

    events: {
        'mousedown': 'onMouseDown',
        'click': 'openDetails',
        'click .board-task-user-picture': 'toggleSelectUser',
        'click .board-task-due-date': 'toggleSelectDate',
        'click .board-task-delete-button': 'delete'
    },

    initialize: function () {
        this.listenTo(this.model, 'change:assignedUserId', this.render);
        this.listenTo(this.model, 'change:dueDate', this.render);
        this.listenTo(this.model, 'change:isCompleted', this.render);
        this.listenTo(this.model, 'change:name', this.render);
        this.listenTo(this.model, 'change:priority', this.render);
        this.listenTo(this.model, 'change:tagIds', this.render);
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

        if (this.model.get('dueDate') == '') {
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
            let tag = self.collection.tags.findWhere({ id: tagId });
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

        let taskDetailsView = new ProjectManager.Views.TaskDetails({
            model: self.model,
            collection: self.collection
        });

        let popupView = new ProjectManager.Views.Popup();
        $('#main-container').append(popupView.render().$el);
        $('.popup').last().append(taskDetailsView.render().$el);
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

        this.model.save({ assignedUserId: user.get('id') });

        let assignedTaskIdsClone = user.get('assignedTaskIds').slice();
        assignedTaskIdsClone.push(self.model.get('id'));
        user.set('assignedTaskIds', assignedTaskIdsClone);

        this.toggleSelectUser();
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

    updateDueDate: function (dueDate) {
        let self = this;

        this.model.save({ dueDate: dueDate.toISOString() });
        self.toggleSelectDate();
    },

    delete: function () {
        let self = this;

        let promises = [];
        self.collection.comments.where({ taskId: self.model.get('id') }).forEach(function (comment) {
            promises.push(new Promise(function (resolve) {
                comment.destroy({
                    success: function () {
                        resolve();
                    }
                });
            }));

            promises.push(new Promise(function (resolve) {
                let user = self.collection.users.findWhere({ id: comment.get('userId') });
                let commentIdsClone = user.get('commentIds').slice();
                commentIdsClone.splice(commentIdsClone.indexOf(comment.get('id')), 1);
                user.save(
                    { commentIds: commentIdsClone },
                    { success: function () { resolve(); } }
                );
            }));
        });

        self.model.get('tagIds').forEach(function (tagId) {
            promises.push(new Promise(function (resolve) {
                let tag = self.collection.tags.findWhere({ id: tagId });
                let tagTaskIdsClone = tag.get('taskIds').slice();
                tagTaskIdsClone.splice(tagTaskIdsClone.indexOf(self.model.get('id')), 1);
                tag.save(
                    { taskIds: tagTaskIdsClone },
                    { success: function () { resolve(); } }
                )
            }));
        });

        Promise.all(promises).then(function () {
            return new Promise(function (resolve) {
                if (self.model.get('assignedUserId') == 0) {
                    resolve();
                    return;
                }

                let user = self.collection.users.findWhere({ id: self.model.get('assignedUserId') });
                let assignedTaskIdsClone = user.get('assignedTaskIds').slice();
                assignedTaskIdsClone.splice(assignedTaskIdsClone.indexOf(self.model.get('id')), 1);
                user.save(
                    { assignedTaskIds: assignedTaskIdsClone },
                    { success: function () { resolve(); } }
                );
            });
        }).then(function () {
            return new Promise(function (resolve) {
                let user = self.collection.users.findWhere({ id: self.model.get('submittingUserId') });
                let submittedTaskIdsClone = user.get('submittedTaskIds').slice();
                submittedTaskIdsClone.splice(submittedTaskIdsClone.indexOf(self.model.get('id')), 1);
                user.save(
                    { submittedTaskIds: submittedTaskIdsClone },
                    { success: function () { resolve(); } }
                );
            });
        }).then(function () {
            return new Promise(function (resolve) {
                self.model.destroy({
                    wait: true,
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function () {
            let taskPromises = [];

            self.collection.tasks.where({ categoryId: self.model.get('categoryId') }).forEach(function (task) {
                if (task.get('order') <= self.model.get('order')) return;

                taskPromises.push(
                    new Promise(function (resolve) {
                        task.save(
                            { order: task.get('order') - 1 },
                            { success: function () { resolve(); } }
                        );
                    })
                );
            });

            Promise.all(taskPromises).then(function () {
                let category = self.collection.categories.findWhere({ id: self.model.get('categoryId') });
                let taskIdsClone = category.get('taskIds').slice();
                taskIdsClone.splice(taskIdsClone.indexOf(self.model.get('id')), 1);
                category.save({ taskIds: taskIdsClone });
            });
        });
    },

    onMouseDown: function (mouseDownEvent) {
        let self = this;

        mouseDownEvent.preventDefault();

        $(document).on('mousemove.checkForDrag', function (mouseMoveEvent) {
            self.checkForDrag(mouseDownEvent, mouseMoveEvent);
        });

        $(document).on('mouseup.cancelCheckForDrag', function () {
            $(document).off('mousemove.checkForDrag');
        });
    },

    checkForDrag: function (mouseDownEvent, mouseMoveEvent) {
        if (Math.abs(mouseDownEvent.pageX - mouseMoveEvent.pageX) > 5 ||
            Math.abs(mouseDownEvent.pageX - mouseMoveEvent.pageY) > 5) {
            $(document).off('mouseup.cancelCheckForDrag');
            $(document).off('mousemove.checkForDrag');

            this.startDrag(mouseDownEvent, mouseMoveEvent);
        }
    },

    startDrag: function (mouseDownEvent, mouseMoveEvent) {
        let self = this;

        let xOffsetDifference = mouseDownEvent.pageX - this.$el.offset().left;
        let yOffsetDifference = mouseDownEvent.pageY - this.$el.offset().top;

        let boardDraggedTaskCopyView = this.renderDraggedTaskCopy();
        boardDraggedTaskCopyView.$el.removeClass('hidden');

        let boardTaskDropAreaIndicatorView = this.renderDropAreaIndicator();

        let spaceBetweenTasks = parseInt(this.$el.css('margin-bottom').slice(0, -2));
        $('.board-category-extra-height').outerHeight(boardDraggedTaskCopyView.$el.outerHeight() + spaceBetweenTasks);

        this.$el.addClass('hidden');

        this.renderDropAreas();

        $(document).on('mousemove.drag', function (taskDragEvent) {
            boardDraggedTaskCopyView.position(taskDragEvent.pageX - xOffsetDifference, taskDragEvent.pageY - yOffsetDifference);

            let dropArea = getElementHovered(taskDragEvent, $('.board-task-drop-area'));
            let category = getElementHovered(taskDragEvent, $('.board-category-tasks'));

            $('.board-category-extra-height').outerHeight(boardDraggedTaskCopyView.$el.outerHeight() + spaceBetweenTasks);

            if (self.category) {
                self.category = null;
            }

            if (self.dropArea) {
                self.dropArea.next().css('margin-top', '0px');
                self.dropArea = null;
            }

            boardTaskDropAreaIndicatorView.$el.addClass('hidden');

            if (category) {
                self.category = category;

                if (dropArea) {
                    self.dropArea = dropArea;

                    dropAreaIndex = dropArea.parent().find('.board-task-drop-area').index(dropArea);
                    if (dropAreaIndex) {
                        dropArea.next().css('margin-top', boardDraggedTaskCopyView.$el.outerHeight() + (2 * spaceBetweenTasks) + 'px');
                    } else {
                        dropArea.next().css('margin-top', boardDraggedTaskCopyView.$el.outerHeight() + spaceBetweenTasks + 'px');
                    }

                    category.find('.board-category-extra-height').outerHeight(0);

                    boardTaskDropAreaIndicatorView.$el.removeClass('hidden');
                    boardTaskDropAreaIndicatorView.position(dropArea.offset().left, dropArea.offset().top);
                } else {
                    boardTaskDropAreaIndicatorView.$el.removeClass('hidden');
                    if (category.find('.board-task').length == 0 ||
                        (category.find('.board-task').length == 1 && category.find('.board-task').last().hasClass('hidden'))
                    ) {
                        boardTaskDropAreaIndicatorView.position(
                            category.offset().left + parseInt(category.css('padding-left').slice(0, -2)),
                            category.offset().top
                        );
                    } else if (category.find('.board-task').last().hasClass('hidden')) {
                        let lastTask = category.find('.board-task').eq(category.find('.board-task').length - 2);
                        boardTaskDropAreaIndicatorView.position(
                            lastTask.offset().left,
                            lastTask.offset().top + lastTask.outerHeight() + parseInt(lastTask.css('margin-bottom').slice(0, -2))
                        );
                    } else {
                        let lastTask = category.find('.board-task').last();
                        boardTaskDropAreaIndicatorView.position(
                            lastTask.offset().left,
                            lastTask.offset().top + lastTask.outerHeight() + parseInt(lastTask.css('margin-bottom').slice(0, -2))
                        );
                    }
                }
            }

            let boardTopBound = 0;
            let boardBottomBound = window.innerHeight;
            let boardLeftBound = 0;
            let boardRightBound = window.innerWidth;
            let taskContainerTopBound = $('.board-category-tasks').eq(0).offset().top;
            let horizontalScrollAreaWidth = 100;
            let verticalScrollAreaHeight = 100;

            self.pageX = taskDragEvent.pageX;
            self.pageY = taskDragEvent.pageY;

            if (taskDragEvent.pageX >= boardLeftBound &&
                taskDragEvent.pageX <= boardLeftBound + horizontalScrollAreaWidth &&
                taskDragEvent.pageY >= boardTopBound &&
                taskDragEvent.pageY <= boardBottomBound) {
                if (!self.scrollLeftIntervalId && $('#board-container').scrollLeft() > 0) {
                    self.scrollLeftIntervalId = setInterval(function () {
                        if ($('#board-container').scrollLeft() < 10) {
                            $('.board-task-drop-area').each(function () {
                                $(this).offset({ left: $(this).offset().left + $('#board-container').scrollLeft() });
                            });
                            $('#board-container').scrollLeft(0);
                            clearInterval(self.scrollLeftIntervalId);
                            self.scrollLeftIntervalId = 0;
                        } else {
                            $('.board-task-drop-area').each(function () {
                                $(this).offset({ left: $(this).offset().left + 10 });
                            });
                            $('#board-container').scrollLeft($('#board-container').scrollLeft() - 10);
                        }
                        document.dispatchEvent(new MouseEvent('mousemove', {
                            'clientX': self.pageX,
                            'clientY': self.pageY
                        }));
                    }, 20);
                }
            } else {
                clearInterval(self.scrollLeftIntervalId);
                self.scrollLeftIntervalId = 0;
            }

            if (taskDragEvent.pageX >= boardRightBound - horizontalScrollAreaWidth &&
                taskDragEvent.pageX <= boardRightBound &&
                taskDragEvent.pageY >= boardTopBound &&
                taskDragEvent.pageY <= boardBottomBound) {
                if (!self.scrollRightIntervalId && $('#board-container').scrollLeft() + $('#board-container').outerWidth() < $('#board-container').get(0).scrollWidth) {
                    self.scrollRightIntervalId = setInterval(function () {
                        if ($('#board-container').scrollLeft() + $('#board-container').outerWidth() + 10 > $('#board-container').get(0).scrollWidth) {
                            $('.board-task-drop-area').each(function () {
                                $(this).offset({ left: $(this).offset().left - $('#board-container').get(0).scrollWidth + $('#board-container').scrollLeft() + $('#board-container').outerWidth() });
                            });
                            $('#board-container').scrollLeft($('#board-container').get(0).scrollWidth - $('#board-container').outerWidth());
                            clearInterval(self.scrollRightIntervalId);
                            self.scrollRightIntervalId = 0;
                        } else {
                            $('.board-task-drop-area').each(function () {
                                $(this).offset({ left: $(this).offset().left - 10 });
                            });
                            $('#board-container').scrollLeft($('#board-container').scrollLeft() + 10);
                        }
                        document.dispatchEvent(new MouseEvent('mousemove', {
                            'clientX': self.pageX,
                            'clientY': self.pageY
                        }));
                    }, 20);
                }
            } else {
                clearInterval(self.scrollRightIntervalId);
                self.scrollRightIntervalId = 0;
            }

            if (taskDragEvent.pageY <= taskContainerTopBound + verticalScrollAreaHeight) {
                let taskContainer = null;
                $('.board-category-tasks').each(function () {
                    let taskContainerLeftBound = $(this).offset().left;
                    let taskContainerRightBound = taskContainerLeftBound + $(this).outerWidth();
                    if (taskDragEvent.pageX >= taskContainerLeftBound && taskDragEvent.pageX <= taskContainerRightBound) {
                        taskContainer = $(this);
                    }
                });

                if (taskContainer && !self.scrollUpIntervalId && taskContainer.scrollTop() > 0) {
                    self.scrollUpIntervalId = setInterval(function () {
                        if (taskContainer.scrollTop() < 10) {
                            taskContainer.find('.board-task-drop-area').each(function () {
                                $(this).offset({ top: $(this).offset().top + taskContainer.scrollTop() });
                            });
                            taskContainer.scrollTop(0);
                            clearInterval(self.scrollUpIntervalId);
                            self.scrollUpIntervalId = 0;
                        } else {
                            taskContainer.find('.board-task-drop-area').each(function () {
                                $(this).offset({ top: $(this).offset().top + 10 });
                            });
                            taskContainer.scrollTop(taskContainer.scrollTop() - 10);
                        }
                        document.dispatchEvent(new MouseEvent('mousemove', {
                            'clientX': self.pageX,
                            'clientY': self.pageY
                        }));
                    }, 20);
                }
            } else {
                clearInterval(self.scrollUpIntervalId);
                self.scrollUpIntervalId = 0;
            }

            if (taskDragEvent.pageY >= boardBottomBound - verticalScrollAreaHeight) {
                let taskContainer = null;
                $('.board-category-tasks').each(function () {
                    let taskContainerLeftBound = $(this).offset().left;
                    let taskContainerRightBound = taskContainerLeftBound + $(this).outerWidth();
                    if (taskDragEvent.pageX >= taskContainerLeftBound && taskDragEvent.pageX <= taskContainerRightBound) {
                        taskContainer = $(this);
                    }
                });

                if (taskContainer && !self.scrollDownIntervalId && taskContainer.scrollTop() + taskContainer.outerHeight() < taskContainer.get(0).scrollHeight) {
                    self.scrollDownIntervalId = setInterval(function () {
                        if (taskContainer.scrollTop() + taskContainer.outerHeight() + 10 > taskContainer.get(0).scrollHeight) {
                            taskContainer.find('.board-task-drop-area').each(function () {
                                $(this).offset({ top: $(this).offset().top - taskContainer.get(0).scrollHeight + taskContainer.scrollTop() + taskContainer.outerHeight() });
                            });
                            taskContainer.scrollTop(taskContainer.get(0).scrollHeight - taskContainer.outerHeight());
                            clearInterval(self.scrollDownIntervalId);
                            self.scrollDownIntervalId = 0;
                        } else {
                            taskContainer.find('.board-task-drop-area').each(function () {
                                $(this).offset({ top: $(this).offset().top - 10 });
                            });
                            taskContainer.scrollTop(taskContainer.scrollTop() + 10);
                        }
                        document.dispatchEvent(new MouseEvent('mousemove', {
                            'clientX': self.pageX,
                            'clientY': self.pageY
                        }));
                    }, 20);
                }
            } else {
                clearInterval(self.scrollDownIntervalId);
                self.scrollDownIntervalId = 0;
            }
        });

        document.dispatchEvent(new MouseEvent('mousemove', {
            'clientX': mouseMoveEvent.pageX,
            'clientY': mouseMoveEvent.pageY
        }));

        $(document).on('mouseup.endDrag', function () {
            $(document).off('mousemove.drag');
            $(document).off('mouseup.endDrag');

            if (self.category) {
                self.$el.remove();

                let categoryIndex = $('.board-category-tasks').index(self.category);
                let categoryId = self.collection.categories.at(categoryIndex).get('id');

                let taskIndex = null;
                if (self.dropArea) {
                    taskIndex = self.dropArea.parent().find('.board-task-drop-area').index(self.dropArea);
                } else {
                    taskIndex = self.category.find('.board-task').length;
                }

                let scrollTop = self.category.scrollTop();

                $('.board-task-drop-area').each(function () {
                    $(this).remove();
                });

                let promises = [];
                let originCategory = self.collection.categories.findWhere({ id: self.model.get('categoryId') });
                let destinationCategory = null;

                if (self.model.get('categoryId') == categoryId) {
                    self.collection.tasks.where({ categoryId: self.model.get('categoryId') }).forEach(function (task) {
                        if (task.get('order') == self.model.get('order')) return;

                        let order = task.get('order');
                        if (order > self.model.get('order')) order -= 1;
                        if (order >= taskIndex) order += 1;
                        if (order != task.get('order')) {
                            promises.push(new Promise(function (resolve) {
                                task.save(
                                    { order: order },
                                    { success: function () { resolve(); } }
                                );
                            }));
                        }
                    });
                } else {
                    destinationCategory = self.collection.categories.findWhere({ id: categoryId });

                    self.collection.tasks.where({ categoryId: self.model.get('categoryId') }).forEach(function (task) {
                        if (task.get('order') > self.model.get('order')) {
                            promises.push(new Promise(function (resolve) {
                                task.save(
                                    { order: task.get('order') - 1 },
                                    { success: function () { resolve(); } }
                                );
                            }));
                        }
                    });

                    self.collection.tasks.where({ categoryId: categoryId }).forEach(function (task) {
                        if (task.get('order') >= taskIndex) {
                            promises.push(new Promise(function (resolve) {
                                task.save(
                                    { order: task.get('order') + 1 },
                                    { success: function () { resolve(); } }
                                );
                            }));
                        }
                    });

                    promises.push(
                        new Promise(function (resolve) {
                            let originCategoryTaskIdsClone = originCategory.get('taskIds').slice();
                            originCategoryTaskIdsClone.splice(originCategoryTaskIdsClone.indexOf(self.model.get('id')), 1);
                            originCategory.save(
                                { taskIds: originCategoryTaskIdsClone },
                                { success: function () { resolve(); } }
                            )
                        })
                    );

                    promises.push(
                        new Promise(function (resolve) {
                            let destinationCategoryTaskIdsClone = destinationCategory.get('taskIds').slice();
                            destinationCategoryTaskIdsClone.push(self.model.get('id'));
                            destinationCategory.save(
                                { taskIds: destinationCategoryTaskIdsClone },
                                { success: function () { resolve(); } }
                            )
                        })
                    );
                }

                Promise.all(promises).then(function () {
                    self.model.save(
                        {
                            categoryId: categoryId,
                            order: taskIndex
                        },
                        {
                            success: function () {
                                originCategory.trigger('taskMove');
                                if (destinationCategory) destinationCategory.trigger('taskMove');

                                $('#board-dragged-task-copy').remove();
                                $('#board-task-drop-area-indicator').remove();

                                $('.board-category-tasks').eq(categoryIndex).scrollTop(scrollTop);

                                self.dropArea = null;
                                self.category = null;
                            }
                        }
                    );
                })
            } else {
                $('.board-task-drop-area').each(function () {
                    $(this).remove();
                });
                self.$el.removeClass('hidden');
                $('#board-dragged-task-copy').remove();
                $('#board-task-drop-area-indicator').remove();
            }
        });
    },

    renderDraggedTaskCopy: function () {
        let self = this;

        let boardDraggedTaskCopyView = new ProjectManager.Views.BoardDraggedTaskCopy();
        $('#main-container').append(boardDraggedTaskCopyView.render().$el);
        boardDraggedTaskCopyView.$el.html(self.$el.html());
        boardDraggedTaskCopyView.$el.outerWidth(self.$el.outerWidth());

        return boardDraggedTaskCopyView;
    },

    renderDropAreaIndicator: function () {
        let self = this;

        let boardTaskDropAreaIndicatorView = new ProjectManager.Views.BoardTaskDropAreaIndicator();
        $('#main-container').append(boardTaskDropAreaIndicatorView.render().$el);
        boardTaskDropAreaIndicatorView.$el.outerWidth(self.$el.outerWidth());
        boardTaskDropAreaIndicatorView.$el.outerHeight(self.$el.outerHeight());

        return boardTaskDropAreaIndicatorView;
    },

    renderDropAreas: function () {
        $('.board-task').each(function () {
            if (!$(this).hasClass('hidden')) {
                let boardTaskDropAreaView = new ProjectManager.Views.BoardTaskDropArea({
                    boardTask: $(this)
                });
                $(this).before(boardTaskDropAreaView.render().$el);
            }
        });
    }
});