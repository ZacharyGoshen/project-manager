ProjectManager.Views.OptionsBar = Backbone.View.extend({
    tagName: 'div',
    id: 'options-bar',
    className: 'border-bottom-light-gray flex-align-center flex-fit-content flex-row',
    template: _.template(TemplateManager.templates.optionsBar),

    events: {
        'click #options-bar-sort': 'toggleSortDropdownMenu'
    },

    render: function () {
        let html = this.template();
        this.$el.html(html);

        let sortIconView = new ProjectManager.Views.SortIcon();
        this.$('#options-bar-sort-icon').html(sortIconView.render().$el);
        return this;
    },

    toggleSortDropdownMenu: function () {
        let self = this;
        if ($("#sort-drop-down-menu").length) {
            $('body').off('mousedown');
            $("#sort-drop-down-menu").remove();
        } else {
            let sortDropdownMenuView = new ProjectManager.Views.SortDropdownMenu({
                collection: self.collection
            });

            $("#main-container").append(sortDropdownMenuView.render().$el);
            sortDropdownMenuView.position(self.$("#options-bar-sort"));
        }
    },
});