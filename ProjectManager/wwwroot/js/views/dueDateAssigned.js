ProjectManager.Views.DueDateAssigned = Backbone.View.extend({
    tagName: 'div',
    className: 'font-light-gray font-small hover-font-dark-gray',

    render: function () {
        let dueDate = new Date(this.model.get('dueDate'));
        let dueDateStringShort = dueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        this.$el.html(dueDateStringShort);

        return this;
    }
});