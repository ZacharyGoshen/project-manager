ProjectManager.Views.UserPicture = Backbone.View.extend({
    tagName: 'div',

    initialize: function (options) {
        this.userId = options.userId;
        this.hover = options.hover;
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let self = this;

        if (this.userId != 0) {
            let user = self.collection.users.findWhere({ userId: self.userId });
            let userPictureDefaultView = new ProjectManager.Views.UserPictureDefault({
                model: user,
                hover: self.hover
            });
            let html = userPictureDefaultView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        } else {
            let userPictureUnassignedView = new ProjectManager.Views.UserPictureUnassigned({
                hover: self.hover
            });
            let html = userPictureUnassignedView.render();
            this.$el.replaceWith(html.$el);
            this.setElement(html.$el);
        }

        return this;
    }
});