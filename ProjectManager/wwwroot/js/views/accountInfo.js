ProjectManager.Views.AccountInfo = Backbone.View.extend({
    tagName: 'div',
    id: 'account-info',
    className: 'flex-align-start flex-column',
    template: _.template(TemplateManager.templates.accountInfo),

    events: {
        'click #account-info-user-picture': 'toggleSelectColor',
        'click #account-info-update-button': 'updateInfo'
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        let userPictureDefaultLargeView = new ProjectManager.Views.UserPictureDefaultLarge({
            model: self.model
        });
        this.$('#account-info-user-picture').html(userPictureDefaultLargeView.render().$el);

        this.$('#account-info-first-name').val(self.model.get('firstName'));
        this.$('#account-info-last-name').val(self.model.get('lastName'));
        this.$('#account-info-email').val(self.model.get('email'));

        return this;
    },

    toggleSelectColor: function () {
        let self = this;

        if ($("#color-selection").length) {
            $('body').off('mousedown');
            $("#color-selection").remove();
        } else {
            let colorSelectionView = new ProjectManager.Views.ColorSelection({
                collection: self.collection,
                onColorClick: self.updateBackgroundColor.bind(self)
            });

            $("#main-container").append(colorSelectionView.render().$el);
            colorSelectionView.position(self.$('#account-info-user-picture'));
        }
    },

    updateBackgroundColor: function (color) {
        this.model.save({ backgroundColor: color });
        this.toggleSelectColor();
    },

    updateInfo: function () {
        let self = this;

        this.$('#account-info-error-message').addClass('hidden');

        let firstName = this.$('#account-info-first-name').val();
        if (!self.validateName(firstName)) {
            self.updateInfoError('First name is invalid.');
            return;
        }

        let lastName = this.$('#account-info-last-name').val();
        if (!self.validateName(lastName)) {
            self.updateInfoError('Last name is invalid.');
            return;
        }

        let email = this.$('#account-info-email').val();
        if (!self.validateEmail(email)) {
            self.updateInfoError('Email is invalid.');
            return;
        }

        new Promise(function (resolve) {
            if (email == self.model.get('email')) {
                resolve();
            } else if (ProjectManager.Demo) {
                if (self.collection.users.findWhere({ email: email })) {
                    self.updateInfoError('User already exists with that email.');
                    return;
                } else {
                    resolve();
                }
            } else {
                Backbone.ajax({
                    type: 'POST',
                    url: '/User/GetWithEmail',
                    data: {
                        email: email
                    },
                    success: function (user) {
                        if (user) {
                            self.updateInfoError('User already exists with that email.');
                            return;
                        } else {
                            resolve();
                        }
                    }
                });
            }
        }).then(function () {
            self.model.save({
                firstName: firstName,
                lastName: lastName,
                email: email
            });
            self.updateInfoError('Info updated.');
        });
    },

    updateInfoError: function (message) {
        this.$('#account-info-error-message').removeClass('hidden');
        this.$('#account-info-error-message').html(message);
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

    validateName: function (name) {
        let regex = /^[A-Za-z]{2,30}$/
        if (name.match(regex)) {
            return true;
        } else {
            return false;
        }
    }
});