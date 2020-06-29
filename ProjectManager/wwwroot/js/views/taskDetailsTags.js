ProjectManager.Views.TaskDetailsTags = Backbone.View.extend({
    tagName: 'div',
    id: 'task-details-tags',
    template: _.template(TemplateManager.templates.taskDetailsTags),

    events: {
        'click #task-details-add-tag-button': 'toggleSelectTag',
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.model, "change", this.render);
    },

    renderOne: function (tag) {
        let self = this;

        let taskDetailsTagView = new ProjectManager.Views.TaskDetailsTag({
            model: tag,
            collection: self.collection,
            taskId: self.model.get('taskId')
        });
        return this.$('#task-details-add-tag-button').before(taskDetailsTagView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template(this.model.toJSON());
        this.$el.html(html);

        this.model.get('tagIds').forEach(function (tagId) {
            let tag = self.collection.tags.findWhere({ tagId: tagId });
            self.renderOne(tag);
        });

        return this;
    },

    toggleSelectTag: function () {
        let self = this;

        if ($("#tag-selection").length) {
            $('body').off('mousedown');
            $("#tag-selection").remove();
        } else {
            let tagSelectionView = new ProjectManager.Views.TagSelection({
                collection: self.collection,
                onResultClick: self.add.bind(self)
            });

            $("#main-container").append(tagSelectionView.render().$el);
            tagSelectionView.position(self.$el);
        }
    },

    add: function (tag) {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Task/AddTag",
                data: {
                    taskId: self.model.get('taskId'),
                    tagId: tag.get('tagId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            let tagIds = self.model.get('tagIds');
            tagIds.push(tag.get('tagId'));
            self.model.trigger('change');

            let taskIds = tag.get('taskIds');
            taskIds.push(self.model.get('taskId'));
            tag.trigger('change');

            self.toggleSelectTag();
        });
    }
});