ProjectManager.Collections.Categories = Backbone.Collection.extend({
    url: '/category',
    model: ProjectManager.Models.Category
});

ProjectManager.Collections.CategoriesLocal = Backbone.Collection.extend({
    model: ProjectManager.Models.Category,
    localStorage: new Backbone.LocalStorage('categories')
});

ProjectManager.Collections.Comments = Backbone.Collection.extend({
    url: '/comment',
    model: ProjectManager.Models.Comment
});

ProjectManager.Collections.CommentsLocal = Backbone.Collection.extend({
    model: ProjectManager.Models.Comment,
    localStorage: new Backbone.LocalStorage('comments')
});

ProjectManager.Collections.Invites = Backbone.Collection.extend({
    url: '/invite',
    model: ProjectManager.Models.Invite
});
ProjectManager.Collections.InvitesLocal = Backbone.Collection.extend({
    model: ProjectManager.Models.Invite,
    localStorage: new Backbone.LocalStorage('invites')
});

ProjectManager.Collections.Projects = Backbone.Collection.extend({
    url: '/project',
    model: ProjectManager.Models.Project
});

ProjectManager.Collections.ProjectsLocal = Backbone.Collection.extend({
    model: ProjectManager.Models.Project,
    localStorage: new Backbone.LocalStorage('projects')
});

ProjectManager.Collections.Tags = Backbone.Collection.extend({
    url: '/tag',
    model: ProjectManager.Models.Tag
});

ProjectManager.Collections.TagsLocal = Backbone.Collection.extend({
    model: ProjectManager.Models.Tag,
    localStorage: new Backbone.LocalStorage('tags')
});

ProjectManager.Collections.Tasks = Backbone.Collection.extend({
    url: '/task',
    model: ProjectManager.Models.Task
});

ProjectManager.Collections.TasksLocal = Backbone.Collection.extend({
    model: ProjectManager.Models.Task,
    localStorage: new Backbone.LocalStorage('tasks')
});

ProjectManager.Collections.Users = Backbone.Collection.extend({
    url: '/user',
    model: ProjectManager.Models.User
});

ProjectManager.Collections.UsersLocal = Backbone.Collection.extend({
    model: ProjectManager.Models.User,
    localStorage: new Backbone.LocalStorage('users')
});