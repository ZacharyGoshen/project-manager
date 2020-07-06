ProjectManager.Views.BoardDraggedTaskCopy = Backbone.View.extend({
    tagName: 'div',
    id: 'board-dragged-task-copy',
    className: 'background-color-white border-light-gray border-shadow flex-row flex-space-between hidden',

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