ProjectManager.Views.PrioritySelectionOption = Backbone.View.extend({
    tagName: 'div',
    className: 'priority-selection-option font-white hover-cursor-pointer hover-translucent sides-round text-center-horizontal',

    events: {
        'click': 'onClick'
    },

    initialize: function (options) {
        this.priority = options.priority;
        this.onPriorityClick = options.onPriorityClick;
    },

    render: function () {
        let self = this;

        this.$el.html(priorityToString(self.priority));
        this.$el.addClass('background-color-priority-' + self.priority);
        return this;
    },

    onClick: function () {
        let self = this;
        this.onPriorityClick(self.priority);
    }
});