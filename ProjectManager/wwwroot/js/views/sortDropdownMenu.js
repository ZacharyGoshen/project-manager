ProjectManager.Views.SortDropdownMenu = Backbone.View.extend({
    tagName: 'div',
    id: 'sort-dropdown-menu',
    className: 'background-color-white border-light-gray font-small',
    template: _.template(TemplateManager.templates.sortDropdownMenu),

    events: {
        'click #sort-name-ascending': 'sortNameAscending',
        'click #sort-name-descending': 'sortNameDescending',
        'click #sort-due-date-ascending': 'sortDueDateAscending',
        'click #sort-due-date-descending': 'sortDueDateDescending',
        'click #sort-priority-ascending': 'sortPriorityAscending',
        'click #sort-priority-descending': 'sortPriorityDescending'
    },

    initialize: function () {
        let self = this;

        $('body').on('mousedown', function (event) {
            if (getElementHovered(event, self.$el)) return;
            else self.remove();
        });
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);
        return this;
    },

    position: function (button) {
        this.$el.offset({
            top: button.offset().top + button.outerHeight(),
            left: button.offset().left
        });
    },

    remove: function () {
        $('body').off('mousedown');
        this.$el.remove();
    },

    sort: function (property, descending) {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/Sort",
                data: {
                    projectId: ProjectManager.CurrentProjectId,
                    property: property,
                    descending: descending
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            return new Promise(function (resolve) {
                self.collection.tasks.fetch({
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function () {
            self.remove();
        });
    },

    sortNameAscending: function () {
        this.sort('name', false);
    },

    sortNameDescending: function () {
        this.sort('name', true);
    },

    sortDueDateAscending: function () {
        this.sort('dueDate', false);
    },

    sortDueDateDescending: function () {
        this.sort('dueDate', true);
    },

    sortPriorityAscending: function () {
        this.sort('priority', false);
    },

    sortPriorityDescending: function () {
        this.sort('priority', true);
    },
});