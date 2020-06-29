ProjectManager.Views.DateSelectionWeek = Backbone.View.extend({
    tagName: 'div',
    className: 'date-selection-week flex-row',

    initialize: function (options) {
        this.month = options.month;
        this.sunday = options.sunday;
        this.onDateClick = options.onDateClick;
    },

    renderDay: function (date) {
        let self = this;

        let dateSelectionDayView = new ProjectManager.Views.DateSelectionDay({
            month: self.month,
            date: date,
            onDateClick: self.onDateClick
        });
        this.$el.append(dateSelectionDayView.render().$el);
    },

    render: function () {
        let self = this;

        let date = new Date(this.sunday);
        for (let day = 0; day < 7; day++) {
            self.renderDay(date)
            date.setDate(date.getDate() + 1);
        }

        return this;
    }
});