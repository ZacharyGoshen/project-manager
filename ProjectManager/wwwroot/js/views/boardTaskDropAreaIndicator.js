ProjectManager.Views.BoardTaskDropAreaIndicator = Backbone.View.extend({
    tagName: 'div',
    id: 'board-task-drop-area-indicator',
    className: 'background-color-light-gray corners-round hidden',

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