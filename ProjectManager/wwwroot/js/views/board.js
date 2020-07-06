ProjectManager.Views.Board = Backbone.View.extend({
    tagName: 'div',
    id: 'board-container',
    className: 'flex-align-start flex-grow flex-row overflow-y-hidden',
    template: _.template(TemplateManager.templates.board),

    events: {
        'click #board-new-category-button': 'showNewCategoryInput',
        'keypress #board-new-category-input': 'createCategoryOnEnter'
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.collection.categories, "update", this.render);
        this.listenTo(this.collection.users, "update", this.render);

        $('body').on('mousedown', function (event) {
            if (self.$('#board-new-category-input:hover').length) return;
            else self.hideNewCategoryInput();
        });
    },

    renderOne: function (category) {
        let self = this;
        let categoryView = new ProjectManager.Views.BoardCategory({
            model: category,
            collection: self.collection
        });
        this.$('#board-new-category').before(categoryView.render().$el);
    },

    render: function () {
        let html = this.template();
        this.$el.html(html);

        if (ProjectManager.CurrentProjectId == 0) this.$('#board-new-category-button').remove();

        this.collection.categories.comparator = 'order';
        this.collection.categories.sort();
        this.collection.categories.each(this.renderOne, this);
        return this;
    },

    showNewCategoryInput: function () {
        this.$('#board-new-category-button').addClass('hidden');
        this.$('#board-new-category-input').removeClass('hidden');
        this.$('#board-new-category-input').focus();
    },

    hideNewCategoryInput: function () {
        this.$('#board-new-category-button').removeClass('hidden');
        this.$('#board-new-category-input').addClass('hidden');
        this.$('#board-new-category-input').val('');
    },

    createCategoryOnEnter: function (event) {
        let self = this;
        if (event.keyCode != 13) return;

        event.preventDefault();

        let input = this.$('#board-new-category-input').val();
        if (!input) return;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Category/Create",
                data: {
                    projectId: ProjectManager.CurrentProjectId,
                    categoryName: input
                },
                success: function (newCategoryId) {
                    resolve(newCategoryId);
                }
            });
        }).then(function (newCategoryId) {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Category/Get",
                    data: {
                        categoryId: newCategoryId
                    },
                    success: function (newCategory) {
                        resolve(newCategory);
                    }
                });
            });
        }).then(function (newCategory) {
            self.collection.categories.add(newCategory);
        });
    }
});