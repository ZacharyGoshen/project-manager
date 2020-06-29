ProjectManager.Views.ProjectDetailsOwner = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-owner',
    className: 'border-white flex-align-center flex-row hover-border-dark-gray hover-cursor-pointer',
    template: _.template(TemplateManager.templates.projectDetailsOwner),

    events: {
        'click': 'toggleSelectUser'
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
            userId: self.model.get('ownerId'),
            hover: false
        });
        this.$("#project-details-owner-picture").html(userPictureView.render().$el);

        let owner = self.collection.users.findWhere({ userId: self.model.get('ownerId') });
        this.$("#project-details-owner-name").html(owner.get('firstName') + ' ' + owner.get('lastName'));

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
                url: "/Project/UpdateOwner",
                data: {
                    projectId: self.model.get('projectId'),
                    userId: user.get('userId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('ownerId', user.get('userId'));
            self.toggleSelectUser();
        });
    },
});