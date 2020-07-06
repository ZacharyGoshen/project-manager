ProjectManager.Views.AccountSettings = Backbone.View.extend({
    tagName: 'div',
    id: 'account-settings',
    className: 'background-color-white border-light-gray flex-column',
    template: _.template(TemplateManager.templates.accountSettings),

    events: {
        'click #account-settings-info-link': 'openInfo',
        'click #account-settings-password-link': 'openPassword',
        'click #account-settings-close-button': 'close'
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        this.openInfo();

        return this;
    },

    openInfo: function () {
        let self = this;

        let accountInfoView = new ProjectManager.Views.AccountInfo({
            model: self.model,
            collection: self.collection
        });
        this.$('#account-settings-content').html(accountInfoView.render().$el);
    },

    openPassword: function () {
        let self = this;

        let accountPasswordView = new ProjectManager.Views.AccountPassword({
            model: self.model,
            collection: self.collection
        });
        this.$('#account-settings-content').html(accountPasswordView.render().$el);
    },

    close: function () {
        $('.popup').last().remove();
    }
});