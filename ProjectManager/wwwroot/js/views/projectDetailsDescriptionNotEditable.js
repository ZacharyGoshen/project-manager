ProjectManager.Views.ProjectDetailsDescriptionNotEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-description-not-editable',
    className: 'border-light-gray font-small',

    render: function () {
        let self = this;

        this.$el.html(self.model.get('description'));
        this.$el.attr('placeholder', 'Add a description...');
        return this;
    }
});