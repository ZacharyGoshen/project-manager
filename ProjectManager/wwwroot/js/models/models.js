ProjectManager.Models.Category = Backbone.Model.extend({
    defaults: function () {
        return {
            name: null
        }
    }
});

ProjectManager.Models.Comment = Backbone.Model.extend({
    defaults: function () {
        return {
            text: null
        }
    }
});

ProjectManager.Models.Invite = Backbone.Model.extend({
});

ProjectManager.Models.Project = Backbone.Model.extend({
    defaults: function () {
        return {
            name: null,
            description: null
        }
    }
});

ProjectManager.Models.Tag = Backbone.Model.extend({
});

ProjectManager.Models.Task = Backbone.Model.extend({
    defaults: function () {
        return {
            name: null,
            description: null,
            isCompleted: false,
            priority: 0,
            categoryId: 0,
            assignedUserId: 0,
            order: 0
        }
    }
});

ProjectManager.Models.User = Backbone.Model.extend({
    defaults: function () {
        return {
            firstName: null,
            lastName: null,
            backgroundColor: 0
        }
    }
});