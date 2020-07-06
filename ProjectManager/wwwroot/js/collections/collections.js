ProjectManager.Collections.Categories = Backbone.Collection.extend({
    model: ProjectManager.Models.Category
});

ProjectManager.Collections.Comments = Backbone.Collection.extend({
    model: ProjectManager.Models.Comment
});

ProjectManager.Collections.Invites = Backbone.Collection.extend({
    model: ProjectManager.Models.Tag
});

ProjectManager.Collections.Projects = Backbone.Collection.extend({
    model: ProjectManager.Models.Project
});

ProjectManager.Collections.Tags = Backbone.Collection.extend({
    model: ProjectManager.Models.Tag
});

ProjectManager.Collections.Tasks = Backbone.Collection.extend({
    model: ProjectManager.Models.Task
});

ProjectManager.Collections.Users = Backbone.Collection.extend({
    model: ProjectManager.Models.User
});