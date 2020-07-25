ProjectManager.Views.ProjectDetailsTagsEditable = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-tags',
    template: _.template(TemplateManager.templates.projectDetailsTagsEditable),

    events: {
        'click #project-details-new-tag-button': 'showInput',
        'keypress #project-details-new-tag-input': 'createTagOnEnter'
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.model, 'change:tagIds', this.render);

        $('body').on('mousedown', function () {
            if (self.$('#project-details-new-tag-input:hover').length) return;
            else self.hideInput();
        });
    },

    renderOne: function (tag) {
        let self = this;

        let projectDetailsTagEditableView = new ProjectManager.Views.ProjectDetailsTagEditable({
            model: tag,
            collection: self.collection
        });
        return this.$('#project-details-new-tag-button').before(projectDetailsTagEditableView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.tags.where({ projectId: ProjectManager.CurrentProjectId }).forEach(function (tag) {
            self.renderOne(tag);
        });
        return this;
    },

    showInput: function () {
        this.$('#project-details-new-tag-button').addClass('hidden');
        this.$('#project-details-new-tag-input').removeClass('hidden');
        this.$('#project-details-new-tag-input').focus();
    },

    hideInput: function () {
        this.$('#project-details-new-tag-button').removeClass('hidden');
        this.$('#project-details-new-tag-input').addClass('hidden');
        this.$('#project-details-new-tag-input').val('');
    },

    createTagOnEnter: function (event) {
        let self = this;
        if (event.keyCode != 13) return;

        event.preventDefault();

        let input = this.$('#project-details-new-tag-input').val();
        if (!input) return;

        this.collection.tags.create(
            {
                name: input,
                projectId: self.model.get('id')
            },
            {
                wait: true,
                success: function (newTag, newTagId) {
                    if (newTag.get('id')) {
                        newTagId = newTag.get('id');
                    }
                    newTag.set('id', newTagId);

                    let tagIdsClone = self.model.get('tagIds').slice();
                    tagIdsClone.push(newTagId);
                    self.model.save({ tagIds: tagIdsClone });

                    self.hideInput();
                }
            }
        );
    }
});