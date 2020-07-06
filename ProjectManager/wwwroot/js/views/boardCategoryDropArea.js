ProjectManager.Views.BoardCategoryDropArea = Backbone.View.extend({
    tagName: 'div',
    className: 'board-category-drop-area',

    initialize: function (options) {
        this.boardCategory = options.boardCategory;
    },

    render: function () {
        this.position();
        return this;
    },

    remove: function () {
        this.$el.remove();
    },

    position: function () {
        let self = this;

        this.$el.offset({ top: self.boardCategory.offset().top, left: self.boardCategory.offset().left });
        this.$el.outerHeight(self.boardCategory.outerHeight(true));
        this.$el.outerWidth(self.boardCategory.outerWidth());
    }
});