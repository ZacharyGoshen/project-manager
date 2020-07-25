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

    sort: function (comparator, reverse) {
        let self = this;

        this.collection.tasks.comparator = comparator;
        this.collection.tasks.sort();

        this.collection.categories.where({ projectId: ProjectManager.CurrentProjectId }).forEach(function (category) {
            let tasks = self.collection.tasks.where({ categoryId: category.get('id') });

            let promises = [];

            if (reverse) {
                let order = 0;
                tasks.forEach(function (task) {
                    promises.push(
                        new Promise(function (resolve) {
                            task.save(
                                { order: order },
                                { success: function () { resolve(); }}
                            );
                        })
                    );
                    order += 1;
                })
            } else {
                let order = tasks.length - 1;
                tasks.forEach(function (task) {
                    promises.push(
                        new Promise(function (resolve) {
                            task.save(
                                { order: order },
                                { success: function () { resolve(); } }
                            );
                        })
                    );
                    order -= 1;
                })
            }

            Promise.all(promises).then(function () {
                category.trigger('sort');
            });
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