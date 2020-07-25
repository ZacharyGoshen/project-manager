window.ProjectManager = {
    LoggedInUserId: 0,
    CurrentProjectId: 0,
    Demo: 0,
    Models: {},
    Collections: {},
    Views: {},

    start: function (view) {
        let self = this;

        if (view == 'login') {
            let loginView = new ProjectManager.Views.Login();
            $("#main-container").append(loginView.render().$el);

            return;
        }

        new Promise(function (resolve) {
            Backbone.ajax({
                type: "GET",
                url: "/Home/GetDemo",
                success: function (demo) {
                    ProjectManager.Demo = demo;
                    resolve();
                }
            });
        }).then(function () {
            if (ProjectManager.Demo) {
                self.loadViewWithDemoData();
            } else {
                self.loadViewWithDatabaseData();
            }
        })
    },

    loadViewWithDemoData: function () {
        let collection = {
            categories: new ProjectManager.Collections.CategoriesLocal(),
            comments: new ProjectManager.Collections.CommentsLocal(),
            invites: new ProjectManager.Collections.InvitesLocal(),
            projects: new ProjectManager.Collections.ProjectsLocal(),
            tags: new ProjectManager.Collections.TagsLocal(),
            tasks: new ProjectManager.Collections.TasksLocal(),
            users: new ProjectManager.Collections.UsersLocal()
        };

        if (localStorage.length) {
            collection.categories.fetch()
            collection.comments.fetch();
            collection.invites.fetch();
            collection.projects.fetch();
            collection.tags.fetch();
            collection.tasks.fetch();
            collection.users.fetch();
        } else {
            collection.categories.add({
                id: 1,
                name: 'Design the Rocket',
                order: 0,
                projectId: 1,
                taskIds: [1, 2, 3, 4, 5, 6]
            }).save();

            collection.categories.add({
                id: 2,
                name: 'Build the Rocket',
                order: 1,
                projectId: 1,
                taskIds: [7, 8, 9, 10]
            }).save();

            collection.categories.add({
                id: 3,
                name: 'Launch into Space',
                order: 2,
                projectId: 1,
                taskIds: [11, 12, 13, 14, 15, 16, 17]
            }).save();

            collection.categories.add({
                id: 4,
                name: 'Travel to the Moon',
                order: 3,
                projectId: 1,
                taskIds: [18, 19, 20, 21]
            }).save();

            collection.categories.add({
                id: 5,
                name: 'Land on the Moon',
                order: 4,
                projectId: 1,
                taskIds: [22, 23, 24, 25]
            }).save();

            collection.projects.add({
                categoryIds: [1, 2, 3, 4, 5],
                descripton: 'We want to go to the moon',
                id: 1,
                name: 'Mission to the Moon',
                ownerId: 1,
                tagIds: [1, 2, 3, 4, 5],
                taskIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                teamMemberIds: [1, 2, 3, 4, 5, 6, 7, 8,]
            }).save();

            collection.tags.add({
                backgroundColor: 1,
                id: 1,
                name: 'Stage 1',
                projectId: 1,
                taskIds: [11, 12, 13, 14]
            }).save();

            collection.tags.add({
                backgroundColor: 5,
                id: 2,
                name: 'Stage 2',
                projectId: 1,
                taskIds: [15, 16, 17, 18]
            }).save();

            collection.tags.add({
                backgroundColor: 3,
                id: 3,
                name: 'Stage 3',
                projectId: 1,
                taskIds: [19, 20, 21, 22]
            }).save();

            collection.tags.add({
                backgroundColor: 10,
                id: 4,
                name: 'Engineering',
                projectId: 1,
                taskIds: [1, 4, 5, 6, 7, 8, 9, 10]
            }).save();

            collection.tags.add({
                backgroundColor: 14,
                id: 5,
                name: 'Construction',
                projectId: 1,
                taskIds: [7, 8, 9, 10]
            }).save();

            collection.tasks.add({
                assignedUserId: 3,
                categoryId: 1,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() - 12),
                id: 1,
                isCompleted: true,
                name: 'Figure out what the rocket needs to do',
                order: 0,
                priority: 5,
                projectId: 1,
                submittingUserId: 6,
                tagIds: [4]
            }).save();

            collection.tasks.add({
                assignedUserId: 4,
                categoryId: 1,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() - 10),
                id: 2,
                isCompleted: true,
                name: 'Establish mission parameters',
                order: 1,
                priority: 3,
                projectId: 1,
                submittingUserId: 4,
                tagIds: []
            }).save();

            collection.tasks.add({
                assignedUserId: 5,
                categoryId: 1,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() - 9),
                id: 3,
                isCompleted: true,
                name: 'Call in the experts',
                order: 2,
                priority: 1,
                projectId: 1,
                submittingUserId: 3,
                tagIds: []
            }).save();

            collection.tasks.add({
                assignedUserId: 2,
                categoryId: 1,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() - 8),
                id: 4,
                isCompleted: true,
                name: 'Start drawing',
                order: 3,
                priority: 3,
                projectId: 1,
                submittingUserId: 1,
                tagIds: [4]
            }).save();

            collection.tasks.add({
                assignedUserId: 3,
                categoryId: 1,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() - 5),
                id: 5,
                isCompleted: true,
                name: 'Whittle down the possibilities',
                order: 4,
                priority: 2,
                projectId: 1,
                submittingUserId: 5,
                tagIds: [4]
            }).save();

            collection.tasks.add({
                assignedUserId: 8,
                categoryId: 1,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() - 4),
                id: 6,
                isCompleted: true,
                name: 'Pick the best design',
                order: 5,
                priority: 5,
                projectId: 1,
                submittingUserId: 6,
                tagIds: [4]
            }).save();

            collection.tasks.add({
                assignedUserId: 7,
                categoryId: 2,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() + 2),
                id: 7,
                isCompleted: true,
                name: 'Construct the body',
                order: 0,
                priority: 2,
                projectId: 1,
                submittingUserId: 3,
                tagIds: [4, 5]
            }).save();

            collection.tasks.add({
                assignedUserId: 2,
                categoryId: 2,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() + 5),
                id: 8,
                isCompleted: false,
                name: 'Attach the propulsion',
                order: 1,
                priority: 5,
                projectId: 1,
                submittingUserId: 8,
                tagIds: [4, 5]
            }).save();

            collection.tasks.add({
                assignedUserId: 1,
                categoryId: 2,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() + 5),
                id: 9,
                isCompleted: true,
                name: 'Install the navigation system',
                order: 2,
                priority: 2,
                projectId: 1,
                submittingUserId: 5,
                tagIds: [4, 5]
            }).save();

            collection.tasks.add({
                assignedUserId: 4,
                categoryId: 2,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() + 5),
                id: 10,
                isCompleted: false,
                name: 'Secure the payload',
                order: 3,
                priority: 5,
                projectId: 1,
                submittingUserId: 7,
                tagIds: [4, 5]
            }).save();

            collection.tasks.add({
                assignedUserId: 3,
                categoryId: 3,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: new Date().setDate(new Date().getDate() + 10),
                id: 11,
                isCompleted: false,
                name: 'Begin the launch',
                order: 0,
                priority: 0,
                projectId: 1,
                submittingUserId: 4,
                tagIds: [1]
            }).save();

            collection.tasks.add({
                assignedUserId: 3,
                categoryId: 3,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 12,
                isCompleted: false,
                name: 'Continue with powered ascent',
                order: 1,
                priority: 3,
                projectId: 1,
                submittingUserId: 4,
                tagIds: [1]
            }).save();

            collection.tasks.add({
                assignedUserId: 3,
                categoryId: 3,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 13,
                isCompleted: false,
                name: 'Discard the first stage',
                order: 2,
                priority: 4,
                projectId: 1,
                submittingUserId: 4,
                tagIds: [1]
            }).save();

            collection.tasks.add({
                assignedUserId: 0,
                categoryId: 3,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 14,
                isCompleted: false,
                name: 'Retrieve the discarded first stage',
                order: 3,
                priority: 1,
                projectId: 1,
                submittingUserId: 1,
                tagIds: [1]
            }).save();

            collection.tasks.add({
                assignedUserId: 4,
                categoryId: 3,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 15,
                isCompleted: false,
                name: 'Ignite the second engine',
                order: 4,
                priority: 1,
                projectId: 1,
                submittingUserId: 5,
                tagIds: [2]
            }).save();

            collection.tasks.add({
                assignedUserId: 2,
                categoryId: 3,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 16,
                isCompleted: false,
                name: 'Reach orbit altitude and velocity',
                order: 5,
                priority: 0,
                projectId: 1,
                submittingUserId: 3,
                tagIds: [2]
            }).save();

            collection.tasks.add({
                assignedUserId: 7,
                categoryId: 3,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 17,
                isCompleted: false,
                name: 'Cut off engines',
                order: 6,
                priority: 3,
                projectId: 1,
                submittingUserId: 1,
                tagIds: [2]
            }).save();

            collection.tasks.add({
                assignedUserId: 3,
                categoryId: 4,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 18,
                isCompleted: false,
                name: 'Orbit the earth 1.5 times',
                order: 0,
                priority: 5,
                projectId: 1,
                submittingUserId: 6,
                tagIds: [2]
            }).save();

            collection.tasks.add({
                assignedUserId: 7,
                categoryId: 4,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 19,
                isCompleted: false,
                name: 'Ignite the third engine',
                order: 1,
                priority: 3,
                projectId: 1,
                submittingUserId: 8,
                tagIds: [3]
            }).save();

            collection.tasks.add({
                assignedUserId: 1,
                categoryId: 4,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 20,
                isCompleted: false,
                name: "Exit earth's orbit",
                order: 2,
                priority: 4,
                projectId: 1,
                submittingUserId: 7,
                tagIds: [3]
            }).save();

            collection.tasks.add({
                assignedUserId: 0,
                categoryId: 4,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 21,
                isCompleted: false,
                name: 'Travel 238,900 miles',
                order: 3,
                priority: 3,
                projectId: 1,
                submittingUserId: 1,
                tagIds: [3]
            }).save();

            collection.tasks.add({
                assignedUserId: 5,
                categoryId: 5,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 22,
                isCompleted: false,
                name: "Enter the moon's orbit",
                order: 0,
                priority: 5,
                projectId: 1,
                submittingUserId: 1,
                tagIds: [3]
            }).save();

            collection.tasks.add({
                assignedUserId: 3,
                categoryId: 5,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 23,
                isCompleted: false,
                name: "Launch lunar module",
                order: 1,
                priority: 2,
                projectId: 1,
                submittingUserId: 2,
                tagIds: []
            }).save();

            collection.tasks.add({
                assignedUserId: 6,
                categoryId: 5,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 24,
                isCompleted: false,
                name: "Land lunar module",
                order: 2,
                priority: 1,
                projectId: 1,
                submittingUserId: 8,
                tagIds: []
            }).save();

            collection.tasks.add({
                assignedUserId: 0,
                categoryId: 5,
                creationTime: '',
                commentIds: [],
                description: '',
                dueDate: '',
                id: 25,
                isCompleted: false,
                name: "Celebrate mission success!",
                order: 3,
                priority: 0,
                projectId: 1,
                submittingUserId: 8,
                tagIds: []
            }).save();

            collection.users.add({
                assignedTaskIds: [9, 20],
                backgroundColor: 1,
                commentIds: [],
                currentProjectId: 1,
                email: 'johnapollo@gmail.com',
                firstName: 'John',
                id: 1,
                inviteIds: [],
                lastName: 'Apollo',
                projectIds: [1],
                submittedTaskIds: [4, 14, 17,21, 22]
            }).save();

            collection.users.add({
                assignedTaskIds: [4, 8, 16],
                backgroundColor: 3,
                commentIds: [],
                currentProjectId: 1,
                email: 'moonmcdare@gmail.com',
                firstName: 'Moon',
                id: 2,
                inviteIds: [],
                lastName: 'McDare',
                projectIds: [1],
                submittedTaskIds: [23]
            }).save();

            collection.users.add({
                assignedTaskIds: [1, 5, 11, 12, 13, 18, 23],
                backgroundColor: 5,
                commentIds: [],
                currentProjectId: 1,
                email: 'vanceastro@gmail.com',
                firstName: 'Vance',
                id: 3,
                inviteIds: [],
                lastName: 'Astro',
                projectIds: [1],
                submittedTaskIds: [3, 7, 16]
            }).save();

            collection.users.add({
                assignedTaskIds: [2,10, 15],
                backgroundColor: 7,
                commentIds: [],
                currentProjectId: 1,
                email: 'captainkremmen@gmail.com',
                firstName: 'Captain',
                id: 4,
                inviteIds: [],
                lastName: 'Kremmen',
                projectIds: [1],
                submittedTaskIds: [2, 11, 12, 13]
            }).save();

            collection.users.add({
                assignedTaskIds: [3, 22],
                backgroundColor: 9,
                commentIds: [],
                currentProjectId: 1,
                email: 'rogerhealey@gmail.com',
                firstName: 'Roger',
                id: 5,
                inviteIds: [],
                lastName: 'Healey',
                projectIds: [1],
                submittedTaskIds: [5, 9, 15]
            }).save();

            collection.users.add({
                assignedTaskIds: [24],
                backgroundColor: 11,
                commentIds: [],
                currentProjectId: 1,
                email: 'buzzlightyear@gmail.com',
                firstName: 'Buzz',
                id: 6,
                inviteIds: [],
                lastName: 'Lightyear',
                projectIds: [1],
                submittedTaskIds: [1, 6, 18]
            }).save();

            collection.users.add({
                assignedTaskIds: [7, 17, 19],
                backgroundColor: 13,
                commentIds: [],
                currentProjectId: 1,
                email: 'peterquill@gmail.com',
                firstName: 'Peter',
                id: 7,
                inviteIds: [],
                lastName: 'Quill',
                projectIds: [1],
                submittedTaskIds: [10, 20]
            }).save();

            collection.users.add({
                assignedTaskIds: [6],
                backgroundColor: 15,
                commentIds: [],
                currentProjectId: 1,
                email: 'homersimpson@gmail.com',
                firstName: 'Homer',
                id: 8,
                inviteIds: [],
                lastName: 'Simpson',
                projectIds: [1],
                submittedTaskIds: [8, 19, 24, 25]
            }).save();
        }

        ProjectManager.LoggedInUserId = collection.users.at(0).get('id');
        ProjectManager.CurrentProjectId = collection.users.get(ProjectManager.LoggedInUserId).get('currentProjectId');
        if (ProjectManager.CurrentProjectId == 0) {
            let user = collection.users.findWhere({ id: ProjectManager.LoggedInUserId });
            if (user.get('projectIds').length) {
                ProjectManager.CurrentProjectId = user.get('projectIds')[0];
            }
        }

        let navigationBarView = new ProjectManager.Views.NavigationBar({
            collection: collection
        });
        $("#main-container").html(navigationBarView.render().$el);

        let optionsBarView = new ProjectManager.Views.OptionsBar({
            collection: collection
        });
        $("#main-container").append(optionsBarView.render().$el);

        let boardView = new ProjectManager.Views.Board({
            model: collection.projects.get(ProjectManager.CurrentProjectId),
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
            tags: new ProjectManager.Collections.Tags(),
            tasks: new ProjectManager.Collections.Tasks(),
            users: new ProjectManager.Collections.Users()
        };

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
                Backbone.ajax({
                    type: "GET",
                    url: "/Project/GetAllWithUser",
                    data: {
                        userId: ProjectManager.LoggedInUserId
                    },
                    success: function (projects) {
                        collection.projects = new ProjectManager.Collections.Projects(projects);
                        if (!ProjectManager.CurrentProjectId && collection.projects.length) {
                            ProjectManager.CurrentProjectId = collection.projects.at(0).get('id');
                        }
                        resolve();
                    }
                });
            })
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Category/GetAllInProject",
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function (categories) {
                        collection.categories = new ProjectManager.Collections.Categories(categories);
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Comment/GetAllInProject",
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function (comments) {
                        collection.comments = new ProjectManager.Collections.Comments(comments);
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Invite/GetAllWithUser",
                    data: {
                        userId: ProjectManager.LoggedInUserId
                    },
                    success: function (invites) {
                        collection.invites = new ProjectManager.Collections.Invites(invites);
                        resolve();
                    }
                });
            })
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Tag/GetAllInProject",
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function (tags) {
                        collection.tags = new ProjectManager.Collections.Tags(tags);
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/Task/GetAllInProject",
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function (tasks) {
                        collection.tasks = new ProjectManager.Collections.Tasks(tasks);
                        resolve();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                Backbone.ajax({
                    type: "GET",
                    url: "/User/GetAllInProject",
                    data: {
                        projectId: ProjectManager.CurrentProjectId
                    },
                    success: function (users) {
                        collection.users = new ProjectManager.Collections.Users(users);
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
                model: collection.projects.get(ProjectManager.CurrentProjectId),
                collection: collection
            });
            $("#main-container").append(boardView.render().$el);
        });
    }
}