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
        this.listenTo(this.model, "change:assignedUserId", this.render);
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
            let assignedUser = self.collection.users.findWhere({ id: self.model.get('assignedUserId') });
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

        if (this.model.get('assignedUserId')) {
            let previousUser = this.collection.users.findWhere({ id: self.model.get('assignedUserId') });
            let assignedTaskIdsClone = previousUser.get('assignedTaskIds').slice();
            assignedTaskIdsClone.splice(assignedTaskIdsClone.indexOf(self.model.get('id')), 1);
            previousUser.save({ assignedTaskIds: assignedTaskIdsClone });
        }

        this.model.save({ assignedUserId: user.get('id') });
        
        let assignedTaskIdsClone = user.get('assignedTaskIds').slice();
        assignedTaskIdsClone.push(self.model.get('id'));
        user.save({ assignedTaskIds: assignedTaskIdsClone });

        this.toggleSelectUser();
    },

    remove: function () {
        let self = this;

        let previousUser = this.collection.users.findWhere({ id: self.model.get('assignedUserId') });
        let assignedTaskIdsClone = previousUser.get('assignedTaskIds').slice();
        assignedTaskIdsClone.splice(assignedTaskIdsClone.indexOf(self.model.get('id')), 1);
        previousUser.save({ assignedTaskIds: assignedTaskIdsClone });

        this.model.save({ assignedUserId: 0 });
    }
});