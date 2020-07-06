ProjectManager.Views.AccountPassword = Backbone.View.extend({
    tagName: 'div',
    id: 'account-password',
    className: 'flex-align-start flex-column',
    template: _.template(TemplateManager.templates.accountPassword),

    events: {
        'click #account-password-update-button': 'update'
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    },

    update: function () {
        let self = this;

        this.$('#account-password-error-message').addClass('hidden');

        let currentPassword = this.$('#account-password-current').val();
        if (currentPassword.length < 8) {
            self.error('Current password must be atleast 8 characters long.');
            return;
        }
        if (!self.validatePassword(currentPassword)) {
            self.error('Current password can only contain letters, numbers, and/or the symbols: #, ?, !, @, $, %, ^, &, *, -');
            return;
        }

        let newPassword = this.$('#account-password-new').val();
        if (newPassword.length < 8) {
            self.error('New password must be atleast 8 characters long.');
            return;
        }
        if (!self.validatePassword(newPassword)) {
            self.error('New password can only contain letters, numbers, and/or the symbols: #, ?, !, @, $, %, ^, &, *, -');
            return;
        }
        if (newPassword == currentPassword) {
            self.error('New password cannot be the same as the old password.');
            return;
        }

        let passwordConfirmation = this.$('#account-password-confirmation').val();
        if (newPassword != passwordConfirmation) {
            self.error('Passwords do not match.');
            return;
        }

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/User/Authenticate',
                data: {
                    userId: self.model.get('userId'),
                    password: currentPassword
                },
                success: function (result) {
                    if (result) {
                        resolve();
                    } else {
                        self.error('Current password is incorrect.')
                        return;
                    }
                }
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: 'POST',
                    url: '/User/UpdatePassword',
                    data: {
                        userId: self.model.get('userId'),
                        password: newPassword
                    },
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function () {
            self.error('Password updated.');
            self.$('#account-password-current').val('');
            self.$('#account-password-new').val('');
            self.$('#account-password-confirmation').val('');
        });
    },

    error: function (message) {
        this.$('#account-password-error-message').removeClass('hidden');
        this.$('#account-password-error-message').html(message);
    },

    validatePassword: function (password) {
        let regex = /^[A-Za-z0-9#?!@$%^&*-]{8,128}$/;
        if (password.match(regex)) {
            return true;
        } else {
            return false;
        }
    },
});