ProjectManager.Models.Category = Backbone.RelationalModel.extend({
    relations: [{
        type: 'HasMany',
        key: 'tasks',
        relatedModel: 'Task',
        reverseRelation: {
            key: 'category',
            includeInJSON: Backbone.Model.prototype.idAttribute
        }
    }],

    defaults: function () {
        return {
            name: null
        }
    }
});

ProjectManager.Models.Comment = Backbone.RelationalModel.extend({
    defaults: function () {
        return {
            text: null
        }
    }
});

ProjectManager.Models.Project = Backbone.RelationalModel.extend({
    relations: [{
        type: 'HasMany',
        key: 'categories',
        relatedModel: 'Category',
        reverseRelation: {
            key: 'project',
            includeInJSON: Backbone.Model.prototype.idAttribute
        }
    },
    {
        type: 'HasMany',
        key: 'tasks',
        relatedModel: 'Task',
        reverseRelation: {
            key: 'project',
            includeInJSON: Backbone.Model.prototype.idAttribute
        }
    }],

    defaults: function () {
        return {
            name: null,
            description: null
        }
    }
});

ProjectManager.Models.Task = Backbone.RelationalModel.extend({
    relations: [{
        type: 'HasMany',
        key: 'comments',
        relatedModel: 'Comment',
        reverseRelation: {
            key: 'task',
            includeInJSON: Backbone.Model.prototype.idAttribute
        }
    }],

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

ProjectManager.Models.User = Backbone.RelationalModel.extend({
    relations: [
        {
            type: 'HasMany',
            key: 'assignedTasks',
            relatedModel: 'Task',
            reverseRelation: {
                key: 'assignedUser',
                includeInJSON: Backbone.Model.prototype.idAttribute
            }
        },
        {
            type: 'HasMany',
            key: 'comments',
            relatedModel: 'Comment',
            reverseRelation: {
                key: 'user',
                includeInJSON: Backbone.Model.prototype.idAttribute
            }
        }
    ],

    defaults: function () {
        return {
            firstName: null,
            lastName: null,
            backgroundColor: 0
        }
    }
});