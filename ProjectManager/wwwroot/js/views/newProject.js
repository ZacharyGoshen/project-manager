ProjectManager.Views.NewProject = Backbone.View.extend({
    tagName: 'div',
    id: 'new-project',
    className: 'background-color-white border-light-gray flex-column',
    template: _.template(TemplateManager.templates.newProject),

    events: {
        'click #new-project-close-button': 'close',
        'click #new-project-create-button': 'createProject'
    },

    render: function () {
        let html = this.template();
        this.$el.html(html);
        return this;
    },

    close: function () {
        $('.popup').last().remove();
    },

    createProject: function () {
        let self = this;

        let name = this.$('#new-project-name').val();
        if (!name) return;

        let description = this.$('#new-project-description').val();

        new Promise(function (resolve) {
            self.collection.projects.create(
                {
                    description: description,
                    name: name,
                    ownerId: ProjectManager.LoggedInUserId,
                    teamMemberIds: [ProjectManager.LoggedInUserId]
                },
                {
                    success: function (newProject, newProjectId) {
                        if (newProject.get('id')) {
                            newProjectId = newProject.get('id');
                        }
                        resolve(newProjectId);
                    }
                }
            );
        }).then(function (newProjectId) {
            return new Promise(function () {
                let user = self.collection.users.findWhere({ id: ProjectManager.LoggedInUserId });
                let projectIdsClone = user.get('projectIds').slice();
                projectIdsClone.splice(projectIdsClone.push(newProjectId), 1);
                user.save(
                    {
                        currentProjectId: newProjectId,
                        projectIds: projectIdsClone
                    },
                    {
                        success: function () {
                            location.reload();
                        }
                    }
                );
            });
        });
    }
});