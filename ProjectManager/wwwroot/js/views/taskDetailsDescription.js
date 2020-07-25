ProjectManager.Views.TaskDetailsDescription = Backbone.View.extend({
    tagName: 'textarea',
    id: 'task-details-description',
    className: 'border-light-gray focus-border-dark-gray font-small',

    events: {
        'focusout': 'update',
        'keypress': 'focusOutOnEnter'
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

        this.model.save({ description: self.$el.val() });
    },
});