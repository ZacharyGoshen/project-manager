ProjectManager.Views.BoardCategory = Backbone.View.extend({
    tagName: 'div',
    className: 'board-category border-white flex-column',
    template: _.template(TemplateManager.templates.boardCategory),

    events: {
        'mousedown .board-category-header': 'onMouseDown',
        'mouseover .board-category-header': 'onMouseOverHeader',
        'mouseout .board-category-header': 'onMouseOutHeader',
        'click .board-category-header': 'showNameInput',
        'click .board-new-task-button': 'toggleInput',
        'click .board-category-delete-button': 'onClickDelete',
        'keypress .board-category-name-input': 'updateNameOnEnter',
        'keypress .board-new-task-input': 'createTaskOnEnter'
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.model, 'change:taskIds', this.render);
        this.listenTo(this.model, 'change:name', this.render);
        this.listenTo(this.model, 'sort', this.render);
        this.listenTo(this.model, 'taskMove', this.render);

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$('.board-new-task-input'))) return;
            if (self.$('.board-new-task-button:hover').length) return;
            else self.hideInput();
        });

        $('body').on('mousedown', function () {
            if (self.$('.board-category-name-input:hover').length) return;
            else self.hideNameInput();
        });
    },

    renderOne: function (task) {
        let self = this;

        let boardTaskView = new ProjectManager.Views.BoardTask({
            model: task,
            collection: self.collection
        });
        this.$('.board-category-extra-height').before(boardTaskView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let categoryId = this.model.get('id');

        this.collection.tasks.comparator = 'order';
        this.collection.tasks.sort();
        this.collection.tasks.where({ categoryId: categoryId }).forEach(task => self.renderOne(task));
        return this;
    },

    showNameInput: function () {
        if (self.$('.board-category-delete-button:hover').length) return;

        this.$('.board-category-name').addClass('hidden');
        this.$('.board-category-name-input').removeClass('hidden');
        this.$('.board-category-name-input').focus();
        this.$('.board-category-name-input').val(this.$('.board-category-name').html());
    },

    hideNameInput: function () {
        this.$('.board-category-name').removeClass('hidden');
        this.$('.board-category-name-input').addClass('hidden');
        this.$('.board-category-name-input').val('');
    },

    updateNameOnEnter: function (event) {
        if (event.keyCode != 13) return;

        event.preventDefault();

        let input = this.$('.board-category-name-input').val();
        if (!input) return;

        this.model.save({ name: input });
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

        self.collection.tasks.where({ categoryId: self.model.get('id') }).forEach(function (task) {
            task.save({ order: task.get('order') + 1 });
        });

        this.collection.tasks.create(
            {
                categoryId: self.model.get('id'),
                name: input,
                projectId: ProjectManager.CurrentProjectId,
                submittingUserId: ProjectManager.LoggedInUserId
            },
            {
                success: function (newTask, newTaskId) {
                    if (newTask.get('id')) {
                        newTaskId = newTask.get('id');
                    }
                    newTask.set('id', newTaskId);

                    let categoryTaskIdsClone = self.model.get('taskIds').slice();
                    categoryTaskIdsClone.push(newTask.get('id'));
                    self.model.set('taskIds', categoryTaskIdsClone);

                    let project = self.collection.projects.findWhere({ id: ProjectManager.CurrentProjectId });
                    let projectTaskIdsClone = project.get('taskIds').slice();
                    projectTaskIdsClone.push(newTask.get('id'));
                    project.set('taskIds', projectTaskIdsClone);

                    let user = self.collection.users.findWhere({ id: ProjectManager.LoggedInUserId });
                    let submittedTaskIdsClone = user.get('submittedTaskIds').slice();
                    submittedTaskIdsClone.push(newTask.get('id'));
                    user.set('submittedTaskIds', submittedTaskIdsClone);
                }
            }
        );
    },

    onClickDelete: function () {
        let self = this;

        if (this.model.get('taskIds').length) {
            let confirmationView = new ProjectManager.Views.Confirmation({
                message: 'Deleting this category will also delete all of its tasks. Are you sure?',
                submitText: 'Delete Category',
                onSubmit: self.delete.bind(self),
                model: self.model,
                collection: self.collection
            });

            let popupView = new ProjectManager.Views.Popup();
            $("#main-container").append(popupView.render().$el);
            $('.popup').last().append(confirmationView.render().$el);
        } else {
            self.delete();
        }
    },

    delete: function () {
        let self = this;

        let taskPromises = [];
        this.collection.tasks.where({ categoryId: self.model.get('id') }).forEach(function (task) {
            let commentPromises = [];
            self.collection.comments.where({ taskId: task.get('id') }).forEach(function (comment) {
                commentPromises.push(new Promise(function (resolve) {
                    comment.destroy({
                        success: function () {
                            resolve();
                        }
                    });
                }));

                commentPromises.push(new Promise(function (resolve) {
                    let user = self.collection.users.findWhere({ id: comment.get('userId') });
                    let commentIdsClone = user.get('commentIds').slice();
                    commentIdsClone.splice(commentIdsClone.indexOf(comment.get('id')), 1);
                    user.save(
                        { commentIds: commentIdsClone },
                        { success: function () { resolve(); }}
                    );
                }));
            });

            let tagPromises = [];
            task.get('tagIds').forEach(function (tagId) {
                tagPromises.push(new Promise(function (resolve) {
                    let tag = self.collection.tags.findWhere({ id: tagId });
                    let tagTaskIdsClone = tag.get('taskIds').slice();
                    tagTaskIdsClone.splice(tagTaskIdsClone.indexOf(task.get('id')), 1);
                    tag.save(
                        { taskIds: tagTaskIdsClone },
                        { success: function () { resolve(); } }
                    )
                }));
            });

            taskPromises.push(new Promise(function (resolve) {
                Promise.all(tagPromises).then(function () {
                    Promise.all(commentPromises).then(function () {
                        task.destroy({
                            success: function () {
                                resolve();
                            }
                        });
                    });
                });
            }));

            taskPromises.push(new Promise(function (resolve) {
                if (task.get('assignedUserId') == 0) {
                    resolve();
                    return;
                }

                let user = self.collection.users.findWhere({ id: task.get('assignedUserId') });
                let assignedTaskIdsClone = user.get('assignedTaskIds').slice();
                assignedTaskIdsClone.splice(assignedTaskIdsClone.indexOf(task.get('id')), 1);
                user.save(
                    { assignedTaskIds: assignedTaskIdsClone },
                    { success: function () { resolve(); } }
                );
            }));

            taskPromises.push(new Promise(function (resolve) {
                let user = self.collection.users.findWhere({ id: task.get('submittingUserId') });
                let submittedTaskIdsClone = user.get('submittedTaskIds').slice();
                submittedTaskIdsClone.splice(submittedTaskIdsClone.indexOf(task.get('id')), 1);
                user.save(
                    { submittedTaskIds: submittedTaskIdsClone },
                    { success: function () { resolve(); } }
                );
            }));
        });

        new Promise(function (resolve) {
            Promise.all(taskPromises).then(function () {
                self.model.destroy({
                    wait: true,
                    success: function () {
                        resolve();
                    }
                });
            })
        }).then(function () {
            let categoryPromises = [];

            self.collection.categories.forEach(function (category) {
                if (category.get('order') <= self.model.get('order')) return;

                categoryPromises.push(
                    new Promise(function (resolve) {
                        category.save(
                            { order: category.get('order') - 1 },
                            { success: function () { resolve(); } }
                        );
                    })
                );
            });

            Promise.all(categoryPromises).then(function () {
                let project = self.collection.projects.findWhere({ id: ProjectManager.CurrentProjectId });
                let categoryIdsClone = project.get('categoryIds').slice();
                categoryIdsClone.splice(categoryIdsClone.indexOf(self.model.get('id')), 1);
                project.save({ categoryIds: categoryIdsClone });
            });
        });
    },

    onMouseOverHeader: function () {
        this.$el.removeClass('border-white');
        this.$el.addClass('border-dark-gray');
    },

    onMouseOutHeader: function () {
        this.$el.removeClass('border-dark-gray');
        this.$el.addClass('border-white');
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

        let boardDraggedCategoryCopyView = this.renderDraggedCategoryCopy();
        boardDraggedCategoryCopyView.$el.removeClass('hidden');

        let boardCategoryDropAreaIndicatorView = this.renderDropAreaIndicator();

        $('#board-extra-width').outerWidth(boardDraggedCategoryCopyView.$el.outerWidth());

        this.$el.addClass('hidden');

        this.renderDropAreas();

        $(document).on('mousemove.drag', function (categoryDragEvent) {
            boardDraggedCategoryCopyView.position(categoryDragEvent.pageX - xOffsetDifference, categoryDragEvent.pageY - yOffsetDifference);

            let dropArea = getElementHovered(categoryDragEvent, $('.board-category-drop-area'));

            $('#board-new-category').css('margin-left', '0px');
            $('#board-extra-width').outerWidth(boardDraggedCategoryCopyView.$el.outerWidth());

            if (self.dropArea) {
                self.dropArea.next().css('margin-left', '0px');
                self.dropArea = null;
            }

            boardCategoryDropAreaIndicatorView.$el.addClass('hidden');

            if (dropArea) {
                self.dropArea = dropArea;

                dropAreaIndex = dropArea.parent().find('.board-category-drop-area').index(dropArea);
                dropArea.next().css('margin-left', boardDraggedCategoryCopyView.$el.outerWidth() + 'px');

                $('#board-extra-width').outerWidth(0);

                boardCategoryDropAreaIndicatorView.$el.removeClass('hidden');
                boardCategoryDropAreaIndicatorView.position(dropArea.offset().left, dropArea.offset().top);
            } else if (getElementHovered(categoryDragEvent, $('#board-container'))) {
                boardCategoryDropAreaIndicatorView.$el.removeClass('hidden');
                if ($('.board-category').length == 1) {
                    boardCategoryDropAreaIndicatorView.position(
                        $('#board-container').offset().left + parseInt($('#board-container').css('padding-left').slice(0, -2)),
                        $('#board-container').offset().top + parseInt($('#board-container').css('padding-top').slice(0, -2))
                    );
                } else {
                    let lastCategory = null;
                    if ($('.board-category').last().hasClass('hidden')) {
                        lastCategory = $('.board-category').eq($('.board-category').length - 2);
                    } else {
                        lastCategory = $('.board-category').last();
                    }
                    boardCategoryDropAreaIndicatorView.position(
                        lastCategory.offset().left + lastCategory.outerWidth(),
                        lastCategory.offset().top
                    );
                }
                $('#board-new-category').css('margin-left', boardDraggedCategoryCopyView.$el.outerWidth() + 'px');
            }

            let boardTopBound = 0;
            let boardBottomBound = window.innerHeight;
            let boardLeftBound = 0;
            let boardRightBound = window.innerWidth;
            let horizontalScrollAreaWidth = 100;

            self.pageX = categoryDragEvent.pageX;
            self.pageY = categoryDragEvent.pageY;

            if (categoryDragEvent.pageX >= boardLeftBound &&
                categoryDragEvent.pageX <= boardLeftBound + horizontalScrollAreaWidth &&
                categoryDragEvent.pageY >= boardTopBound &&
                categoryDragEvent.pageY <= boardBottomBound) {
                if (!self.scrollLeftIntervalId && $('#board-container').scrollLeft() > 0) {
                    self.scrollLeftIntervalId = setInterval(function () {
                        if ($('#board-container').scrollLeft() < 10) {
                            $('.board-category-drop-area').each(function () {
                                $(this).offset({ left: $(this).offset().left + $('#board-container').scrollLeft() });
                            });
                            $('#board-container').scrollLeft(0);
                            clearInterval(self.scrollLeftIntervalId);
                            self.scrollLeftIntervalId = 0;
                        } else {
                            $('.board-category-drop-area').each(function () {
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

            if (categoryDragEvent.pageX >= boardRightBound - horizontalScrollAreaWidth &&
                categoryDragEvent.pageX <= boardRightBound &&
                categoryDragEvent.pageY >= boardTopBound &&
                categoryDragEvent.pageY <= boardBottomBound) {
                if (!self.scrollRightIntervalId && $('#board-container').scrollLeft() + $('#board-container').outerWidth() < $('#board-container').get(0).scrollWidth - $('#board-extra-width').outerWidth()) {
                    self.scrollRightIntervalId = setInterval(function () {
                        if ($('#board-container').scrollLeft() + $('#board-container').outerWidth() + 10 > $('#board-container').get(0).scrollWidth - $('#board-extra-width').outerWidth()) {
                            $('.board-category-drop-area').each(function () {
                                $(this).offset({ left: $(this).offset().left - $('#board-container').get(0).scrollWidth + $('#board-extra-width').outerWidth() + $('#board-container').scrollLeft() + $('#board-container').outerWidth() });
                            });
                            $('#board-container').scrollLeft($('#board-container').get(0).scrollWidth - $('#board-container').outerWidth());
                            clearInterval(self.scrollRightIntervalId);
                            self.scrollRightIntervalId = 0;
                        } else {
                            $('.board-category-drop-area').each(function () {
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
        });

        document.dispatchEvent(new MouseEvent('mousemove', {
            'clientX': mouseMoveEvent.pageX,
            'clientY': mouseMoveEvent.pageY
        }));

        $(document).on('mouseup.endDrag', function (mouseUpEvent) {
            $(document).off('mousemove.drag');
            $(document).off('mouseup.endDrag');

            if (getElementHovered(mouseUpEvent, $('#board-container'))) {
                self.$el.remove();

                let categoryIndex = null;
                if (self.dropArea) {
                    categoryIndex = $('.board-category-drop-area').index(self.dropArea);
                } else {
                    categoryIndex = $('.board-category').length;
                }

                self.dropArea = null;

                $('.board-category-drop-area').each(function () {
                    $(this).remove();
                });

                self.collection.categories.each(function (category) {
                    if (category.get('order') == self.model.get('order')) return;

                    let order = category.get('order');
                    if (order > self.model.get('order')) order -= 1;
                    if (order >= categoryIndex) order += 1;
                    if (order != category.get('order')) category.save({ order: order });
                });

                self.model.save({ order: categoryIndex });
                self.collection.categories.trigger('categoryMove');
                $('#board-dragged-category-copy').remove();
                $('#board-category-drop-area-indicator').remove();
            } else {
                $('.board-category-drop-area').each(function () {
                    $(this).remove();
                });
                self.$el.removeClass('hidden');
                $('#board-dragged-category-copy').remove();
                $('#board-category-drop-area-indicator').remove();
            }
        });
    },

    renderDraggedCategoryCopy: function () {
        let self = this;

        let boardDraggedCategoryCopyView = new ProjectManager.Views.BoardDraggedCategoryCopy();
        $('#main-container').append(boardDraggedCategoryCopyView.render().$el);
        boardDraggedCategoryCopyView.$el.html(self.$el.html());
        boardDraggedCategoryCopyView.$el.outerWidth(self.$el.outerWidth());

        return boardDraggedCategoryCopyView;
    },

    renderDropAreaIndicator: function () {
        let self = this;

        let boardCategoryDropAreaIndicatorView = new ProjectManager.Views.BoardCategoryDropAreaIndicator();
        $('#main-container').append(boardCategoryDropAreaIndicatorView.render().$el);
        boardCategoryDropAreaIndicatorView.$el.outerWidth(self.$el.outerWidth());
        boardCategoryDropAreaIndicatorView.$el.outerHeight(self.$el.outerHeight());

        return boardCategoryDropAreaIndicatorView;
    },

    renderDropAreas: function () {
        $('.board-category').each(function () {
            if (!$(this).hasClass('hidden')) {
                let boardCategoryDropAreaView = new ProjectManager.Views.BoardCategoryDropArea({
                    boardCategory: $(this)
                });
                $(this).before(boardCategoryDropAreaView.render().$el);
            }
        });
    }
});