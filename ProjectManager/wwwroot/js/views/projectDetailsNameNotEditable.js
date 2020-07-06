ProjectManager.Views.ProjectDetailsNameNotEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-name-not-editable',
    className: 'border-white font-large',

    events: {
        'focusout': 'update',
        'keypress': 'focusOutOnEnter'
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let self = this;

        this.$el.html(self.model.get('name'));
        return this;
    }
});