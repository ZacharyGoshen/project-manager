ProjectManager.Views.TaskDetailsName = Backbone.View.extend({
    tagName: 'input',
    id: 'task-details-name',
    className: 'border-white focus-border-dark-gray font-large hover-border-light-gray',

    events: {
        'focusout': 'update',
        'keypress': 'focusOutOnEnter'
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
        this.model.save({ name: self.$el.val() });
    }
});
