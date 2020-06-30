ProjectManager.Views.TaskDetails = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details',
    className: 'background-color-white border-light-gray flex-column',
    template: _.template(TemplateManager.templates.taskDetails),

    events: {
        'click #task-details-close-button': 'close',
        'keypress #task-details-new-comment-input': 'createCommentOnEnter'
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.collection.comments, 'add', function () {
            self.render();
            let scrollContainer = self.$('#task-details-scroll-container');
            scrollContainer.scrollTop(scrollContainer.get(0).scrollHeight);
        });
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let taskDetailsCompletedView = new ProjectManager.Views.TaskDetailsCompleted({
            model: self.model
        });
        this.$('#task-details-completed').replaceWith(taskDetailsCompletedView.render().$el);

        let taskDetailsNameView = new ProjectManager.Views.TaskDetailsName({
            model: self.model
        });
        this.$('#task-details-name').replaceWith(taskDetailsNameView.render().$el);

        let taskDetailsDescriptionView = new ProjectManager.Views.TaskDetailsDescription({
            model: self.model
        });
        this.$('#task-details-description').replaceWith(taskDetailsDescriptionView.render().$el);

        let taskDetailsUserView = new ProjectManager.Views.TaskDetailsUser({
            model: self.model,
            collection: self.collection
        });
        this.$('#task-details-user').replaceWith(taskDetailsUserView.render().$el);

        let taskDetailsDueDateView = new ProjectManager.Views.TaskDetailsDueDate({
            model: self.model,
            collection: self.collection
        });
        this.$('#task-details-due-date').replaceWith(taskDetailsDueDateView.render().$el);

        let taskDetailsPriorityView = new ProjectManager.Views.TaskDetailsPriority({
            model: self.model
        });
        this.$('#task-details-priority').replaceWith(taskDetailsPriorityView.render().$el);

        let taskDetailsTagsView = new ProjectManager.Views.TaskDetailsTags({
            model: self.model,
            collection: self.collection
        });
        this.$('#task-details-tags').replaceWith(taskDetailsTagsView.render().$el);

        let taskDetailsCommentsView = new ProjectManager.Views.TaskDetailsComments({
            model: self.model,
            collection: self.collection
        });
        this.$('#task-details-comments').replaceWith(taskDetailsCommentsView.render().$el);

        return this;
    },

    close: function () {
        $('.popup').last().remove();
    },

    createCommentOnEnter: function (event) {

        let self = this;
        if (event.keyCode != 13) return;

        event.preventDefault();

        let input = this.$('#task-details-new-comment-input').val();
        if (!input) return;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/Comment/Create',
                data: {
                    taskId: self.model.get('taskId'),
                    userId: ProjectManager.LoggedInUserId,
                    text: input
                },
                success: function (newCommentId) {
                    resolve(newCommentId);
                }
            });
        }).then(function (newCommentId) {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: 'GET',
                    url: '/Comment/Get',
                    data: {
                        commentId: newCommentId
                    },
                    success: function (newComment) {
                        resolve(newComment);
                    }
                });
            });
        }).then(function (newComment) {
            self.collection.comments.add(newComment);
        });
    }
});