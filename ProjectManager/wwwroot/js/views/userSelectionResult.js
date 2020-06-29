ProjectManager.Views.UserSelectionResult = Backbone.View.extend({
    tagName: 'div',
    className: 'user-selection-result flex-row flex-align-center hidden hover-cursor-pointer hover-background-color-light-gray',
    template: _.template(TemplateManager.templates.userSelectionResult),

    events: {
        'click': 'onClick'
    },

    initialize: function (options) {
        this.onResultClick = options.onResultClick;
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureDefaultView = new ProjectManager.Views.UserPictureDefault({
            model: self.model
        });
        this.$(".user-selection-result-picture").html(userPictureDefaultView.render().$el);

        return this;
    },

    onClick: function () {
        let self = this;
        this.onResultClick(self.model);
    }
});