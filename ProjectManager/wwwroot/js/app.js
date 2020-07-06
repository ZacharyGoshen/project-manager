window.ProjectManager = {
    LoggedInUserId: 0,
    CurrentProjectId: 0,
    Demo: false,
    Models: {},
    Collections: {},
    Views: {},

    start: function (view) {
        if (view == 'login') {
            let loginView = new ProjectManager.Views.Login();
            $("#main-container").append(loginView.render().$el);

            return;
        }

        if (ProjectManager.Demo) {
            this.loadViewWithDemoData();
        } else {
            this.loadViewWithDatabaseData();
        }

        Backbone.history.start();
    },

    loadViewWithDemoData: function () {
        let collection = {
            categories: new ProjectManager.Collections.CategoriesLocal({}),
            comments: new ProjectManager.Collections.CommentsLocal({}),
            invites: new ProjectManager.Collections.InvitesLocal({}),
            projects: new ProjectManager.Collections.ProjectsLocal({}),
            tags: new ProjectManager.Collections.TasksLocal({}),
            tasks: new ProjectManager.Collections.TasksLocal({}),
            users: new ProjectManager.Collections.UsersLocal({})
        };

        let navigationBarView = new ProjectManager.Views.NavigationBar({
            collection: collection
        });
        $("#main-container").html(navigationBarView.render().$el);

        let optionsBarView = new ProjectManager.Views.OptionsBar({
            collection: collection
        });
        $("#main-container").append(optionsBarView.render().$el);

        let boardView = new ProjectManager.Views.Board({
            collection: collection
        });
        $("#main-container").append(boardView.render().$el);
    },

    loadViewWithDatabaseData: function () {
        let collection = {
            categories: new ProjectManager.Collections.Categories(),
            comments: new ProjectManager.Collections.Comments(),
            invites: new ProjectManager.Collections.Invites(),
            projects: new ProjectManager.Collections.Projects(),
            tags: new ProjectManager.Collections.Tasks(),
            tasks: new ProjectManager.Collections.Tasks(),
            users: new ProjectManager.Collections.Users()
        };

        collection.categories.url = '../category/getAllInProject';
        collection.invites.url = '../invite/getAllToUser';
        collection.projects.url = '../project/getAllWithUser';
        collection.tasks.url = '../task/getAllInProject';
        collection.tags.url = '../tag/getAllInProject';
        collection.users.url = '../user/getAllInProject';

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "GET",
                url: "/User/GetLoggedInId",
                success: function (userId) {
                    ProjectManager.LoggedInUserId = userId;
                    resolve();
                }
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/User/GetCurrentProjectId",
                    data: {
                        userId: ProjectManager.LoggedInUserId
                    },
                    success: function (currentProjectId) {
                        ProjectManager.CurrentProjectId = currentProjectId;
                        resolve();
                    }
                });
            })
        }).then(function () {
            return new Promise(function (resolve) {
                collection.projects.fetch({
                    data: {
                        userId: ProjectManager.LoggedInUserId
                    },
                    success: function () {
                        if (ProjectManager.CurrentProjectId == 0 &&
                            collection.projects.length) {
                            ProjectManager.CurrentProjectId = collection.projects.at(0).get('projectId');
                        }
                        resolve();
                    }
                });
            })
        }).then(function () {
            return new Promise(function (resolve) {
                collection.categories.fetch({
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                collection.invites.fetch({
                    data: {
                        userId: ProjectManager.LoggedInUserId
                    },
                    success: function () {
                        resolve();
                    }
                });
            })
        }).then(function () {
            return new Promise(function (resolve) {
                collection.tags.fetch({
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                collection.tasks.fetch({
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                collection.users.fetch({
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function () {
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                if (collection.users.length) {
                    resolve();
                } else {
                    Backbone.ajax({
                        type: "GET",
                        url: "/User/Get",
                        data: {
                            userId: ProjectManager.LoggedInUserId
                        },
                        success: function (user) {
                            collection.users.add(user);
                            resolve();
                        }
                    });
                }
            });
        }).then(function () {
            let navigationBarView = new ProjectManager.Views.NavigationBar({
                collection: collection
            });
            $("#main-container").html(navigationBarView.render().$el);

            let optionsBarView = new ProjectManager.Views.OptionsBar({
                collection: collection
            });
            $("#main-container").append(optionsBarView.render().$el);

            let boardView = new ProjectManager.Views.Board({
                collection: collection
            });
            $("#main-container").append(boardView.render().$el);
        });
    }
}