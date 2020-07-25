ProjectManager.Views.ProjectDetailsOwnerEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-owner',
    className: 'border-white flex-align-center flex-row hover-border-dark-gray hover-cursor-pointer',
    template: _.template(TemplateManager.templates.projectDetailsOwner),

    events: {
        'click': 'toggleSelectUser'
    },

    initialize: function () {
        this.listenTo(this.model, "change:ownerId", this.render);
    },

    render: function () {
        let self = this;

        if (!this.model.get('ownerId')) return;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: self.model.get('ownerId'),
            hover: false
        });
        this.$("#project-details-owner-picture").html(userPictureView.render().$el);

        let owner = self.collection.users.findWhere({ id: self.model.get('ownerId') });
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
                onResultClick: self.onUpdate.bind(self)
            });

            $("#main-container").append(userSelectionView.render().$el);
            userSelectionView.position(self.$el);
        }
    },

    onUpdate: function (user) {
        let self = this;

        let confirmationView = new ProjectManager.Views.Confirmation({
            message: 'You will lose all owner privilidges and only the new owner can give them back. Are you sure?',
            submitText: 'Update Owner',
            onSubmit: self.update.bind(self, user)
        });
        $('#background-blur').append(confirmationView.render().$el);

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);
        $('.popup').last().append(confirmationView.render().$el);
    },

    update: function (user) {
        this.model.save(
            { ownerId: user.get('id') },
            { success: function () { location.reload(); } }
        );
    }
});