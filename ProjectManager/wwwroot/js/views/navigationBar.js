ProjectManager.Views.NavigationBar = Backbone.View.extend({
    tagName: 'div',
    id: 'navigation-bar',
    className: 'border-bottom-light-gray flex-align-center flex-fit-content flex-row flex-space-between',
    template: _.template(TemplateManager.templates.navigationBar),

    events: {
        'click #navigation-bar-project': 'openProjectDetails',
        'click #navigation-bar-project-dropdown-button': 'toggleProjectDropdownMenu',
        'click #navigation-bar-new-project-button': 'openNewProject',
        'click #navigation-bar-invites': 'toggleInviteDropdownMenu',
        'click #navigation-bar-user': 'toggleUserDropdownMenu'
    },

    render: function () {
        let self = this;

        let html = this.template();
        this.$el.html(html);

        if (ProjectManager.CurrentProjectId) {
            let project = this.collection.projects.findWhere({ id: ProjectManager.CurrentProjectId });
            this.$('#navigation-bar-project').html(project.get('name'));
        } else {
            this.$('#navigation-bar-project').addClass('hidden');
            this.$('#navigation-bar-project-dropdown-button').addClass('hidden');
            this.$('#navigation-bar-new-project-button').removeClass('hidden');
            this.$('#navigation-bar-new-project-button').html('+ Create new project');
        }

        let inviteIconView = new ProjectManager.Views.InviteIcon({
            collection: self.collection
        })
        this.$('#navigation-bar-invite-icon').replaceWith(inviteIconView.render().$el);

        let userPictureView = new ProjectManager.Views.UserPicture({
            collection: self.collection,
            userId: ProjectManager.LoggedInUserId,
            hover: true
        });
        this.$('#navigation-bar-user').html(userPictureView.render().$el);

        return this;
    },

    openProjectDetails: function () {
        let self = this;

        let projectDetailsView = new ProjectManager.Views.ProjectDetails({
            model: self.collection.projects.findWhere({ id: ProjectManager.CurrentProjectId }),
            collection: self.collection
        });

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);
        $(".popup").last().append(projectDetailsView.render().$el);
    },

    toggleProjectDropdownMenu: function () {
        let self = this;

        if ($("#project-drop-down-menu").length) {
            $('body').off('mousedown');
            $("#project-drop-down-menu").remove();
        } else {
            let projectDropdownMenuView = new ProjectManager.Views.ProjectDropdownMenu({
                collection: self.collection
            });

            $("#main-container").append(projectDropdownMenuView.render().$el);
            projectDropdownMenuView.position(self.$("#navigation-bar-project"));
        }
    },

    toggleUserDropdownMenu: function () {
        let self = this;
        if ($("#user-drop-down-menu").length) {
            $('body').off('mousedown');
            $("#user-drop-down-menu").remove();
        } else {
            let userDropdownMenuView = new ProjectManager.Views.UserDropdownMenu({
                collection: self.collection
            });

            $("#main-container").append(userDropdownMenuView.render().$el);
            userDropdownMenuView.position(self.$("#navigation-bar-user"));
        }
    },

    openNewProject: function () {
        let self = this;

        let newProjectView = new ProjectManager.Views.NewProject({
            collection: self.collection
        });

        let popupView = new ProjectManager.Views.Popup();
        $("#main-container").append(popupView.render().$el);
        $(".popup").last().append(newProjectView.render().$el);
    }
});