ProjectManager.Views.TagSelectionResult = Backbone.View.extend({
    tagName: 'div',
    className: 'tag-selection-result corners-round font-white font-small hidden hover-cursor-pointer hover-translucent text-center-horizontal',

    events: {
        'click': 'onClick'
    },

    initialize: function (options) {
        this.onResultClick = options.onResultClick;
    },

    render: function () {
        let self = this;

        this.$el.html(self.model.get('name'));
        this.$el.addClass('background-color-option-' + self.model.get('backgroundColor'));
        return this;
    },

    onClick: function () {
        let self = this;
        this.onResultClick(self.model);
    }
});