ProjectManager.Views.ProjectDetailsTagEditable = Backbone.View.extend({
    tagName: 'div',
    className: 'project-details-tag flex-align-center flex-row hover-child-visible',
    template: _.template(TemplateManager.templates.projectDetailsTagEditable),

    events: {
        'click .project-details-tag-name': 'toggleSelectColor',
        'click .remove-button-small': 'delete'
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    },

    toggleSelectColor: function () {
        let self = this;

        if ($("#color-selection").length) {
            $('body').off('mousedown');
            $("#color-selection").remove();
        } else {
            let colorSelectionView = new ProjectManager.Views.ColorSelection({
                collection: self.collection,
                onColorClick: self.updateBackgroundColor.bind(self)
            });

            $("#main-container").append(colorSelectionView.render().$el);
            colorSelectionView.position(self.$el);
        }
    },

    updateBackgroundColor: function (color) {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Tag/UpdateBackgroundColor",
                data: {
                    tagId: self.model.get('tagId'),
                    backgroundColor: color
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.model.set('backgroundColor', color);
            self.toggleSelectColor();
        });
    },

    delete: function () {
        let self = this;

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "POST",
                url: "/Tag/Delete",
                data: {
                    tagId: self.model.get('tagId')
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            self.collection.tags.remove(self.model);
        });
    }
});