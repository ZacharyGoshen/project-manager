ProjectManager.Views.DateSelectionDay = Backbone.View.extend({
    tagName: 'div',
    className: 'date-selection-day child-center circle font-small hover-background-color-light-gray hover-cursor-pointer hover-font-white text-center-horizontal',

    events: {
        'click': 'onClick'
    },

    initialize: function (options) {
        this.month = options.month;
        this.date = new Date(options.date);
        this.onDateClick = options.onDateClick;
    },

    render: function () {
        let self = this;

        this.$el.html(self.date.getDate());

        if (this.month.getMonth() != this.date.getMonth()) {
            this.$el.addClass("font-light-gray");
        }

        if (this.date.getDate() == new Date().getDate() &&
            this.date.getMonth() == new Date().getMonth()
        ) {
            this.$el.addClass('underline');
        }

        return this;
    },

    onClick: function () {
        this.onDateClick(this.date);
    }
});