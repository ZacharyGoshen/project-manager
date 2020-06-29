ProjectManager.Views.TaskDetailsUser = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-user',
    className: 'border-white flex-align-center flex-row hover-border-dark-gray hover-child-visible hover-cursor-pointer',
    template: _.template(TemplateManager.templates.taskDetailsUser),

    events: {
        'click': 'toggleSelectUser',
        'click .remove-button-small': 'remove'
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('assignedUserId'),
            hover: false
        });
        this.$("#task-details-user-picture").html(userPictureView.render().$el);

        if (self.model.get('assignedUserId')) {
            let assignedUser = self.collection.users.findWhere({ userId: self.model.get('assignedUserId') });
            this.$("#task-details-user-name").html(assignedUser.get('firstName') + ' ' + assignedUser.get('lastName'));
        } else {
            this.$("#task-details-user-name").html('Select a user');
        }

        return this;
    },

    toggleSelectUser: function () {
        let self = this;

        if (this.$('.remove-button-small:hover').length) return;

        if ($("#user-selection").length) {
            $('body').off('mousedown');
            $("#user-selection").remove();
        } else {
            let userSelectionView = new ProjectManager.Views.UserSelection({
                collection: self.collection,
                onResultClick: self.update.bind(self)
            });

            $("#main-container").append(userSelectionView.render().$el);
            userSelectionView.position(self.$el);
        }
    },

    update: function (user) {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/UpdateAssignedUser",
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

    remove: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/UpdateAssignedUser",
                data: {
                    taskId: self.model.get('taskId'),
                    userId: 0
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('assignedUserId', 0);
        });
    }
});