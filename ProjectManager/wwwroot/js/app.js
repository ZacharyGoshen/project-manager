window.ProjectManager = {
    Models: {},
    Collections: {},
    Views: {},

    start: function () {
        let collection = {
            categories: new ProjectManager.Collections.Categories(),
            comments: new ProjectManager.Collections.Comments(),
            projects: new ProjectManager.Collections.Projects(),
            tasks: new ProjectManager.Collections.Tasks(),
            users: new ProjectManager.Collections.Users()
        };

        collection.projects.url = '../project/getAllWithUser';
        collection.users.url = '../user/getAllInProject';
        collection.categories.url = '../category/getAllInProject';
        collection.tasks.url = '../task/getAllInProject';

        new Promise(function (resolve) {
            collection.projects.fetch({
                data: {
                    userId: 1
                },
                success: function () {
                    resolve();
                }
            });
        }).then(function () {
            new Promise(function (resolve) {
                collection.users.fetch({
                    data: {
                        projectId: 1
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
                        projectId: 1
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
                        projectId: 1
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