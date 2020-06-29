ProjectManager.Views.ColorSelection = Backbone.View.extend({
    tagName: 'div',
    id: 'color-selection',
    className: 'background-color-white border-light-gray font-small font-light-gray',
    template: _.template(TemplateManager.templates.colorSelection),

    initialize: function (options) {
        let self = this;
        this.onColorClick = options.onColorClick;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            if (self.$('.color-selection-option:hover').length) return;
            else self.remove();
        });
    },

    renderOne: function (color, row) {
        let self = this;
        let colorSelectionOptionView = new ProjectManager.Views.ColorSelectionOption({
            color: color,
            onColorClick: self.onColorClick
        });
        this.$('#color-selection-row-' + row).append(colorSelectionOptionView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        for (let color = 0; color < 16; color++) {
            self.renderOne(color, Math.floor(color / 8) + 1);
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