window.ProjectManager = {
    LoggedInUserId: 0,
    CurrentProjectId: 0,
    Models: {},
    Collections: {},
    Views: {},

    start: function (view) {
        if (view == 'login') {
            let loginView = new ProjectManager.Views.Login();
            $("#main-container").append(loginView.render().$el);

            return;
        }

        let collection = {
            categories: new ProjectManager.Collections.Categories(),
            comments: new ProjectManager.Collections.Comments(),
            projects: new ProjectManager.Collections.Projects(),
            tags: new ProjectManager.Collections.Tasks(),
            tasks: new ProjectManager.Collections.Tasks(),
            users: new ProjectManager.Collections.Users()
        };

        collection.projects.url = '../project/getAllWithUser';
        collection.users.url = '../user/getAllInProject';
        collection.categories.url = '../category/getAllInProject';
        collection.tasks.url = '../task/getAllInProject';
        collection.tags.url = '../tag/getAllInProject';

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "GET",
                url: "/User/GetIdOfLoggedIn",
                success: function (userId) {
                    ProjectManager.LoggedInUserId = userId;
                    resolve();
                }
            });
        }).then(function () {
            return new Promise(function (resolve) {
                collection.projects.fetch({
                    data: {
                        userId: ProjectManager.LoggedInUserId
                    },
                    success: function () {
                        if (collection.projects.length) {
                            ProjectManager.CurrentProjectId = collection.projects.at(0).get('projectId');
                        }
                        resolve();
                    }
                });
            })
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
            return new Promise(function () {
                let navigationBarView = new ProjectManager.Views.NavigationBar({
                    collection: collection
                });
                $("#main-container").append(navigationBarView.render().$el);

                let boardView = new ProjectManager.Views.Board({
                    collection: collection
                });
                $("#main-container").append(boardView.render().$el);
            });
        });

        Backbone.history.start();
    }
}