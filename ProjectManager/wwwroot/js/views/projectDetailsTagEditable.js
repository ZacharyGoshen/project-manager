ProjectManager.Views.ProjectDetailsTagEditable = Backbone.View.extend({
    tagName: 'div',
    className: 'project-details-tag flex-align-center flex-row hover-child-visible',
    template: _.template(TemplateManager.templates.projectDetailsTagEditable),

    events: {
        'click .project-details-tag-name': 'toggleSelectColor',
        'click .remove-button-small': 'delete'
    },

    initialize: function () {
        this.listenTo(this.model, "change:backgroundColor", this.render);
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

        self.model.save(
            { backgroundColor: color },
            { success: function () { self.toggleSelectColor(); }}
        );
    },

    delete: function () {
        let self = this;

        this.model.destroy({
            wait: true,
            success: function () {
                self.collection.tasks.forEach(function (task) {
                    if (!task.get('tagIds').includes(self.model.get('id'))) return;

                    let tagIdsClone = task.get('tagIds').slice();
                    tagIdsClone.splice(tagIdsClone.indexOf(self.model.get('id')), 1);
                    task.save({ tagIds: tagIdsClone });
                });

                let project = self.collection.projects.findWhere({ id: self.model.get('projectId') });
                let tagIdsClone = project.get('tagIds').slice();
                console.log(tagIdsClone);
                tagIdsClone.splice(tagIdsClone.indexOf(self.model.get('id')), 1);
                project.save({ tagIds: tagIdsClone });
            }
        });
    }
});