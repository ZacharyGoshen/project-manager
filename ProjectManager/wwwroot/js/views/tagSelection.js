ProjectManager.Views.TagSelection = Backbone.View.extend({
    tagName: 'div',
    id: 'tag-selection',
    className: 'background-color-white border-light-gray font-small font-light-gray',
    template: _.template(TemplateManager.templates.tagSelection),

    events: {
        'keyup #tag-selection-input': 'search',
        'focusin #tag-selection-input': 'showResults',
        'focusout #tag-selection-input': 'hideResults'
    },

    initialize: function (options) {
        let self = this;

        this.onResultClick = options.onResultClick;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            if (self.$('.tag-selection-result:hover').length) return;
            else self.remove();
        });
    },

    renderOne: function (tag) {
        let self = this;
        let tagSelectionResultView = new ProjectManager.Views.TagSelectionResult({
            model: tag,
            onResultClick: self.onResultClick
        });
        this.$('#tag-selection-results').append(tagSelectionResultView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.tags.forEach(function (tag) {
            self.renderOne(tag);
        });

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

    search: function () {
        this.clearResults();

        let input = this.$("#tag-selection-input").val().toLowerCase();
        if (input == "") return;

        this.$(".tag-selection-result").each(function () {
            if ($(this).html().toLowerCase().includes(input)) {
                $(this).removeClass("hidden");
            }
        });
    },

    showResults: function () {
        this.$("#tag-selection-results").removeClass("hidden");
    },

    hideResults: function () {
        let self = this;
        if (self.$('.tag-selection-result:hover').length) return;
        else this.$("#tag-selection-results").addClass("hidden");
    },

    clearResults: function () {
        this.$(".tag-selection-result").each(function () {
            $(this).addClass("hidden");
        });
    }
});