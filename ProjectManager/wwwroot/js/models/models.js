ProjectManager.Models.Category = Backbone.Model.extend({
    urlRoot: '/category',
    defaults: {
        name: '',
        order: 0,
        projectId: 0,
        taskIds: []
    }
});

ProjectManager.Models.Comment = Backbone.Model.extend({
    urlRoot: '/comment',
    default: {
        creationTime: '',
        taskId: 0,
        text: '',
        userId: 0
    }
});

ProjectManager.Models.Invite = Backbone.Model.extend({
    urlRoot: '/invite',
    defaults: {
        inviteeEmail: '',
        inviteeId: 0,
        inviterId: 0,
        projectId: 0
    }
});

ProjectManager.Models.Project = Backbone.Model.extend({
    urlRoot: '/project',
    defaults: {
        categoryIds: [],
        description: '',
        dueDate: '',
        name: '',
        ownerId: 0,
        tagIds: [],
        taskIds: [],
        teamMemberIds: []
    }
});

ProjectManager.Models.Tag = Backbone.Model.extend({
    urlRoot: '/tag',
    defaults: {
        backgroundColor: 0,
        name: '',
        projectId: 0,
        taskIds: []
    }
});

ProjectManager.Models.Task = Backbone.Model.extend({
    urlRoot: '/task',
    defaults: {
        assignedUserId: 0,
        categoryId: 0,
        creationTime: '',
        commentIds: [],
        description: '',
        dueDate: '',
        isCompleted: false,
        name: '',
        order: 0,
        priority: 0,
        projectId: 0,
        submittingUserId: 0,
        tagIds: []
    }
});

ProjectManager.Models.User = Backbone.Model.extend({
    urlRoot: '/user',
    defaults: {
        assignedTaskIds: [],
        backgroundColor: 0,
        commentIds: [],
        currentProjectId: 0,
        email: '',
        firstName: '',
        inviteIds: [],
        lastName: '',
        projectIds: [],
        submittedTaskIds: []
    }
});