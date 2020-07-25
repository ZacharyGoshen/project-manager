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

        this.listenTo(this.model, 'change:categoryIds', this.render);
        this.listenTo(this.collection.categories, 'categoryMove', this.render)

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
        let self = this;

        let html = this.template();
        this.$el.html(html);

        if (ProjectManager.CurrentProjectId == 0) this.$('#board-new-category-button').remove();

        this.collection.categories.comparator = 'order';
        this.collection.categories.sort();
        this.collection.categories.where({ projectId: ProjectManager.CurrentProjectId }).forEach(function (category) {
            self.renderOne(category);
        });
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

        this.collection.categories.create(
            {
                name: input,
                order: self.collection.categories.length,
                projectId: ProjectManager.CurrentProjectId
            },
            {
                success: function (newCategory, newCategoryId) {
                    if (newCategory.get('id')) {
                        newCategoryId = newCategory.get('id');
                    }
                    newCategory.set('id', newCategoryId);

                    let categoryIdsClone = self.model.get('categoryIds').slice();
                    categoryIdsClone.push(newCategory.get('id'));
                    self.model.set('categoryIds', categoryIdsClone);
                }
            }
        );
    }
});