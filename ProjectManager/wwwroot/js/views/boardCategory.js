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

        this.listenTo(this.collection.tasks, "update", this.render);
        this.listenTo(this.model, "change", this.render);

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

        let categoryId = this.model.get('categoryId');

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
        let self = this;
        if (event.keyCode != 13) return;

        event.preventDefault();

        let input = this.$('.board-category-name-input').val();
        if (!input) return;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Category/UpdateName",
                data: {
                    categoryId: self.model.get('categoryId'),
                    name: input
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('name', input);
        });
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
                    userId: ProjectManager.LoggedInUserId,
                    projectId: ProjectManager.CurrentProjectId,
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

                new Promise(function (resolve) {
                    Backbone.ajax({
                        type: "POST",
                        url: "/Category/Move",
                        data: {
                            categoryId: self.model.get('categoryId'),
                            order: categoryIndex
                        },
                        success: function () {
                            resolve();
                        }
                    });
                }).then(function () {
                    return new Promise(function (resolve) {
                        self.collection.categories.fetch({
                            data: {
                                projectId: ProjectManager.CurrentProjectId
                            },
                            success: function () {
                                resolve();
                            }
                        });
                    });
                }).then(function () {
                    self.collection.categories.trigger('update');
                    $('#board-dragged-category-copy').remove();
                    $('#board-category-drop-area-indicator').remove();
                });
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