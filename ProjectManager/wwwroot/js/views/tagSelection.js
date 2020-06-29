ProjectManager.Views.TagSelection = Backbone.View.extend({
    tagName: 'div',
    id: 'tag-selection',
    className: 'background-color-white border-light-gray font-small font-light-gray',
    template: _.template(TemplateManager.templates.tagSelection),

    events: {
        'focusin #tag-selection-input': 'showResults',
        'focusout #tag-selection-input': 'hideResults'
    },

    initialize: function () {
        let self = this;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            if (self.$('#task-details-add-tag-button:hover').length) return;
            else self.remove();
        });
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);
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

    showResults: function () {
        this.$("#tag-selection-results").removeClass("hidden");
    },

    hideResults: function () {
        let self = this;
        if (self.$('.tag-selection-result:hover').length) return;
        else this.$("#tag-selection-results").addClass("hidden");
    }
});