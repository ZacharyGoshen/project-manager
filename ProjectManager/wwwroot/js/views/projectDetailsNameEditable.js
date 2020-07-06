ProjectManager.Views.ProjectDetailsNameEditable = Backbone.View.extend({
    tagName: 'input',
    id: 'project-details-name-editable',
    className: 'border-white focus-border-dark-gray font-large hover-border-light-gray',

    events: {
        'focusout': 'update',
        'keypress': 'focusOutOnEnter'
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let self = this;

        this.$el.val(self.model.get('name'));
        return this;
    },

    focusOutOnEnter: function () {
        if (event.keyCode != 13) return;
        else this.$el.blur();
    },

    update: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Project/UpdateName",
                data: {
                    projectId: self.model.get('projectId'),
                    name: self.$el.val()
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('name', self.$el.val());
        });
    },
});