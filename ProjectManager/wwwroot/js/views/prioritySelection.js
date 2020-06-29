ProjectManager.Views.PrioritySelection = Backbone.View.extend({
    tagName: 'div',
    id: 'priority-selection',
    className: 'background-color-white border-light-gray font-small',

    initialize: function (options) {
        let self = this;
        this.onPriorityClick = options.onPriorityClick;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            if (self.$('.user-selection-result:hover').length) return;
            else self.remove();
        });
    },

    renderOne: function (priority) {
        let self = this;

        let prioritySelectionOptionView = new ProjectManager.Views.PrioritySelectionOption({
            priority: priority,
            onPriorityClick: this.onPriorityClick
        });
        this.$el.append(prioritySelectionOptionView.render().$el);
    },

    render: function () {
        for (let priority = 0; priority < 6; priority++) {
            this.renderOne(priority);
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
    }
});