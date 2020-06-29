ProjectManager.Views.DateSelection = Backbone.View.extend({
    tagName: 'div',
    id: 'date-selection',
    className: 'background-color-white border-light-gray',
    template: _.template(TemplateManager.templates.dateSelection),

    events: {
        'click #previous-month-button': 'previousMonth',
        'click #next-month-button': 'nextMonth'
    },

    initialize: function (options) {
        let self = this;
        this.month = options.month;
        this.onDateClick = options.onDateClick;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            else self.remove();
        });
    },

    renderWeek: function (sunday) {
        let self = this;
        let dateSelectionWeekView = new ProjectManager.Views.DateSelectionWeek({
            month: self.month,
            sunday: sunday,
            onDateClick: self.onDateClick
        });
        this.$('#date-selection-weeks').append(dateSelectionWeekView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.$("#date-selection-month").html(
            self.month.toLocaleDateString(undefined, { month: "long", year: "numeric" })
        );

        let sunday = getSundayOfFirstWeek(self.month.getMonth(), self.month.getYear());
        for (let week = 0; week < getWeeksInMonth(self.month.getMonth(), self.month.getYear()); week++) {
            self.renderWeek(sunday);
            sunday.setDate(sunday.getDate() + 7);
        }

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

    previousMonth: function () {
        let self = this;
        if (this.month.getMonth() == 0) {
            this.month.setFullYear(self.month.getFullYear() - 1);
            this.month.setMonth(11);
        } else {
            this.month.setMonth(self.month.getMonth() - 1);
        }
        this.render();
    },

    nextMonth: function () {
        let self = this;
        if (this.month.getMonth() == 11) {
            this.month.setFullYear(self.month.getFullYear() + 1);
            this.month.setMonth(0);
        } else {
            this.month.setMonth(self.month.getMonth() + 1);
        }
        this.render();
    }
});