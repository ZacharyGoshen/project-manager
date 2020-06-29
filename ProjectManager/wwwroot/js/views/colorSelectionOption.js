ProjectManager.Views.ColorSelectionOption = Backbone.View.extend({
    tagName: 'div',
    className: 'color-selection-option corners-round hover-cursor-pointer hover-translucent',

    events: {
        'click': 'onClick'
    },

    initialize: function (options) {
        this.color = options.color;
        this.onColorClick = options.onColorClick;
    },

    render: function () {
        let self = this;

        this.$el.addClass('background-color-option-' + self.color);
        return this;
    },

    position: function (button) {
        this.$el.offset({
            top: button.offset().top + button.outerHeight(),
            left: button.offset().left
        });
    },

    remove: function () {
        $('body').off('mousedown');
        this.$el.remove();
    },

    onClick: function () {
        let self = this;
        this.onColorClick(self.color);
    }
});