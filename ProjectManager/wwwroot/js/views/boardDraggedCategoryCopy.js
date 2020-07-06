ProjectManager.Views.BoardDraggedCategoryCopy = Backbone.View.extend({
    tagName: 'div',
    id: 'board-dragged-category-copy',
    className: 'background-color-white border-light-gray flex-column',

    render: function () {
        return this;
    },

    position: function (x, y) {
        this.$el.offset({ top: y, left: x });
    },

    remove: function () {
        this.$el.remove();
    }
});