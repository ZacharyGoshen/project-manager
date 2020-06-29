﻿ProjectManager.Views.ProjectDetailsTags = Backbone.View.extend({
    tagName: 'div',
    id: 'project-details-tags',
    className: '',
    template: _.template(TemplateManager.templates.projectDetailsTags),

    events: {
        'click #project-details-new-tag-button': 'showNewTagInput',
        'keypress #project-details-new-tag-input': 'createTagOnEnter'
    },

    initialize: function () {
        let self = this;

        this.listenTo(this.collection.tags, "update", this.render);

        $('body').on('mousedown', function (event) {
            if (self.$('#project-details-new-tag-input:hover').length) return;
            else self.hideNewTagInput();
        });
    },

    renderOne: function (tag) {
        let self = this;

        let projectDetailsTagView = new ProjectManager.Views.ProjectDetailsTag({
            model: tag,
            collection: self.collection
        });
        return this.$('#project-details-new-tag-button').before(projectDetailsTagView.render().$el);
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        this.collection.tags.forEach(function (tag) {
            self.renderOne(tag);
        });
        return this;
    },

    showNewTagInput: function () {
        this.$('#project-details-new-tag-button').addClass('hidden');
        this.$('#project-details-new-tag-input').removeClass('hidden');
        this.$('#project-details-new-tag-input').focus();
    },

    hideNewTagInput: function () {
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

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Tag/Create",
                data: {
                    projectId: 1,
                    tagName: input
                },
                success: function (newTagId) {
                    resolve(newTagId);
                }
            });
        }).then(function (newTagId) {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Tag/Get",
                    data: {
                        tagId: newTagId
                    },
                    success: function (newTag) {
                        resolve(newTag);
                    }
                });
            });
        }).then(function (newTag) {
            self.collection.tags.add(newTag);
        });
    }
});