ProjectManager.Views.UserSelection = Backbone.View.extend({
    tagName: 'div',
    id: 'user-selection',
    className: 'background-color-white border-light-gray font-small font-light-gray',
    template: _.template(TemplateManager.templates.userSelection),

    events: {
        'keyup': 'search',
        'focusin #user-selection-input': 'showResults',
        'focusout #user-selection-input': 'hideResults'
    },

    initialize: function (options) {
        let self = this;
        this.onResultClick = options.onResultClick;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            if (self.$('.user-selection-result:hover').length) return;
            else self.remove();
        });
    },

    renderOne: function (user) {
        let self = this;
        let userSelectionResultView = new ProjectManager.Views.UserSelectionResult({
            model: user,
            onResultClick: self.onResultClick
        });
        this.$('#user-selection-results').append(userSelectionResultView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.users
            .forEach(function (user) {
                self.renderOne(user);
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

        let input = this.$("#user-selection-input").val().toLowerCase();
        if (input == "") return;

        this.$(".user-selection-result-name").each(function () {
            if ($(this).html().toLowerCase().includes(input)) $(this).parent().removeClass("hidden");
        });
    },

    showResults: function () {
        this.$("#user-selection-results").removeClass("hidden");
    },

    hideResults: function () {
        let self = this;
        if (self.$('.user-selection-result:hover').length) return;
        else this.$("#user-selection-results").addClass("hidden");
    },

    clearResults: function () {
        this.$(".user-selection-result-name").each(function () {
            $(this).parent().addClass("hidden");
        });
    }
});