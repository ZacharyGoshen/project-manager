ProjectManager.Collections.Categories = Backbone.Collection.extend({
    model: ProjectManager.Models.Category
});

ProjectManager.Collections.Comments = Backbone.Collection.extend({
    model: ProjectManager.Models.Comment
});

ProjectManager.Collections.Projects = Backbone.Collection.extend({
    model: ProjectManager.Models.Project
});

ProjectManager.Collections.Tasks = Backbone.Collection.extend({
    model: ProjectManager.Models.Task
});

ProjectManager.Collections.Users = Backbone.Collection.extend({
    model: ProjectManager.Models.User
});