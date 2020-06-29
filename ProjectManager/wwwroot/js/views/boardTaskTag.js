﻿ProjectManager.Views.BoardTaskTag = Backbone.View.extend({
    tagName: 'div',
    className: 'board-task-tag font-very-small font-white sides-round',

    render: function () {
        let self = this;

        this.$el.html(self.model.get('name'));
        this.$el.addClass('background-color-option-' + self.model.get('backgroundColor'));
        return this;
    }
});