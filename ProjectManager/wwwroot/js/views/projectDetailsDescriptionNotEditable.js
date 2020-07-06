ProjectManager.Views.ProjectDetailsDescriptionNotEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-description-not-editable',
    className: 'border-light-gray font-small',

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let self = this;

        this.$el.html(self.model.get('description'));
        this.$el.attr('placeholder', 'Add a description...');
        return this;
    }
});