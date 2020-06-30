ProjectManager.Views.Confirmation = Backbone.View.extend({
    tagName: 'div',
    id: 'confirmation',
    className: 'background-color-white border-light-gray',
    template: _.template(TemplateManager.templates.confirmation),

    events: {
        'click #confirmation-submit': 'submit',
        'click #confirmation-cancel': 'close'
    },

    initialize: function (options) {
        this.message = options.message;
        this.submitText = options.submitText;
        this.cancelText = options.cancelText;
        this.onSubmit = options.onSubmit;
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.$('#confirmation-message').html(self.message);

        if (self.submitText) this.$('#confirmation-submit').html(self.submitText);
        else this.$('#confirmation-submit').html('Submit');

        if (self.cancelText) this.$('#confirmation-cancel').html(self.cancelText);
        else this.$('#confirmation-cancel').html('Cancel');

        return this;
    },

    submit: function () {
        this.onSubmit();
        this.close();
    },

    close: function () {
        $('.popup').last().remove();
    }
});