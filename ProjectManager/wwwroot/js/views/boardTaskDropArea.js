ProjectManager.Views.BoardTaskDropArea = Backbone.View.extend({
    tagName: 'div',
    className: 'board-task-drop-area',

    initialize: function (options) {
        this.boardTask = options.boardTask;
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

        this.$el.offset({ top: self.boardTask.offset().top, left: self.boardTask.offset().left });
        this.$el.outerHeight(self.boardTask.outerHeight(true));
        this.$el.outerWidth(self.boardTask.outerWidth());
    }
});