ProjectManager.Views.DeleteCategoryConfirmation = Backbone.View.extend({
    tagName: 'div',
    id: 'delete-category-confirmation',
    className: 'background-color-white border-light-gray',
    template: _.template(TemplateManager.templates.deleteCategoryConfirmation),

    events: {
        'click #confirmation-cancel': 'close',
        'click #confirmation-confirm': 'delete'
    },

    render: function () {
        let html = this.template();
        this.$el.html(html);
        return this;
    },

    delete: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Category/Delete",
                data: {
                    categoryId: self.model.get('categoryId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.collection.categories.remove(self.model);
            self.close();
        });
    },

    close: function () {
        $('#background-blur').remove();
    }
});