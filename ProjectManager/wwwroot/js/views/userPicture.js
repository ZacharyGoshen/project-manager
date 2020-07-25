ProjectManager.Views.UserPicture = Backbone.View.extend({
    tagName: 'div',

    initialize: function (options) {
        this.userId = options.userId;
        this.hover = options.hover;
        this.listenTo(this.model, "change:backgroundColor", this.render);
        this.listenTo(this.model, "change:firstName", this.render);
        this.listenTo(this.model, "change:lastName", this.render);
    },

    render: function () {
        let self = this;

        let user = this.collection.users.findWhere({ id: self.userId });
        if (user) {
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