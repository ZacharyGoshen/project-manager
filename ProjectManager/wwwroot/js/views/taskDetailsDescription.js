ProjectManager.Views.TaskDetailsDescription = Backbone.View.extend({
    tagName: 'textarea',
    id: 'task-details-description',
    className: 'border-light-gray focus-border-dark-gray font-small',

    events: {
        'focusout': 'update',
        'keypress': 'focusOutOnEnter'
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let self = this;

        this.$el.val(self.model.get('description'));
        this.$el.attr('placeholder', 'Add a description...');
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
                url: "/Task/UpdateDescription",
                data: {
                    taskId: self.model.get('taskId'),
                    description: self.$el.val()
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('description', self.$el.val());
        });
    },
});