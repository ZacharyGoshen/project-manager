ProjectManager.Views.Login = Backbone.View.extend({
    tagName: 'div',
    id: 'login-container',
    className: 'background-color-option-7 child-center flex-grow',
    template: _.template(TemplateManager.templates.entry),

    events: {
        'click #login-button': 'logIn',
        'click #demo-login-button': 'logInAsDemoUser',
        'click #signup-button': 'signUp'
    },

    render: function () {
        let html = this.template();
        this.$el.html(html);
        return this;
    },

    logIn: function () {
        let self = this;

        this.$('#login-error-message').addClass('hidden');

        let email = this.$('#login-email').val();
        if (!self.validateEmail(email)) {
            self.logInError('Email is invalid.');
            return;
        }

        let password = this.$('#login-password').val();
        if (password.length < 8) {
            self.logInError('Password must be atleast 8 characters long.');
            return;
        }
        if (!self.validatePassword(password)) {
            self.logInError('Password can only contain letters, numbers, and/or the symbols: #, ?, !, @, $, %, ^, &, *, -');
            return;
        }

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/User/LogIn',
                data: {
                    email: email,
                    password: password
                },
                success: function (result) {
                    resolve(result);
                }
            });
        }).then(function (result) {
            if (result) {
                location.href = '../Home/Board'
            } else {
                self.logInError('Email or password is incorrect.');
            }
        });
    },

    logInError: function (message) {
        this.$('#login-error-message').removeClass('hidden');
        this.$('#login-error-message').html(message);
    },

    logInAsDemoUser: function () {
        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/Home/SetDemo',
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            location.href = '../Home/Board';
        });
    },

    signUp: function () {
        let self = this;

        this.$('#signup-error-message').addClass('hidden');

        let firstName = this.$('#signup-first-name').val();
        if (!self.validateName(firstName)) {
            self.signUpError('First name is invalid.');
            return;
        }

        let lastName = this.$('#signup-last-name').val();
        if (!self.validateName(lastName)) {
            self.signUpError('Last name is invalid.');
            return;
        }

        let email = this.$('#signup-email').val();
        if (!self.validateEmail(email)) {
            self.signUpError('Email is invalid.');
            return;
        }

        let password = this.$('#signup-password').val();
        let passwordConfirmation = this.$('#signup-password-confirmation').val();
        if (password.length < 8) {
            self.signUpError('Password must be atleast 8 characters long.');
            return;
        }
        if (!self.validatePassword(password)) {
            self.signUpError('Password can only contain letters, numbers, and/or the symbols: #, ?, !, @, $, %, ^, &, *, -');
            return;
        }
        if (password != passwordConfirmation) {
            self.signUpError('Passwords do not match.');
            return;
        }

        new Promise(function (resolve) {
            Backbone.ajax({
                type: 'POST',
                url: '/User/SignUp',
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                },
                success: function (result) {
                    resolve(result);
                }
            });
        }).then(function (result) {
            if (result) {
                location.href = '../Home/Board'
            } else {
                self.signUpError('A user already exists with that email.');
            }
        });
    },

    signUpError: function (message) {
        this.$('#signup-error-message').removeClass('hidden');
        this.$('#signup-error-message').html(message);
    },

    validateEmail: function (email) {
        if (email.length > 254) {
            return false;
        } else {
            let regex = /^[A-Za-z0-9_\.\-]*[A-Za-z0-9]+@[A-Za-z0-9\-]+\.[A-Za-z]{2,}$/;
            if (email.match(regex)) {
                return true;
            } else {
                return false;
            }
        }
    },

    validatePassword: function (password) {
        let regex = /^[A-Za-z0-9#?!@$%^&*-]{8,128}$/;
        if (password.match(regex)) {
            return true;
        } else {
            return false;
        }
    },

    validateName: function (name) {
        let regex = /^[A-Za-z]{2,30}$/
        if (name.match(regex)) {
            return true;
        } else {
            return false;
        }
    }
});