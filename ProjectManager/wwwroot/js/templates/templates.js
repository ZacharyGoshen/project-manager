var TemplateManager = {
    templates: {}
};

TemplateManager.templates.navigationBar = `
    <div id='navigation-bar-project' class='hover-cursor-pointer rfont-large'>Navigation Bar</div>
    <div id='navigation-bar-user' class='hover-cursor-pointer'></div>
`;

TemplateManager.templates.userDropdownMenu = `
    <div id='logout-button' class='font-light-gray hover-cursor-pointer hover-font-dark-gray'>Log Out</div>
`;

TemplateManager.templates.entry = `
    <div id='entry' class='background-color-white border-light-gray flex-row flex-space-between'>
        <div id='login-form' class='flex-column flex-align-start'>
            <form>
                <div class='entry-header font-large'>Log In</div>
                <div id='login-error-message' class='background-color-light-gray corners-round font-small hidden'></div>
                <div class='font-light-gray font-small'>Email</div>
                <input id='login-email' class='entry-input border-light-gray focus-border-dark-gray font-small' type='email' autocomplete='username'/>
                <div class='font-light-gray font-small'>Password</div>
                <input id='login-password' class='entry-input border-light-gray focus-border-dark-gray font-small' type='password' autocomplete='current-password'/>
                <div id='login-button' class='border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Log In</div>
            </form>
        </div>
        <div id='signup-form' class='flex-column flex-align-start'>
            <form>
                <div class='entry-header font-large'>Sign Up</div>
                <div id='signup-error-message' class='background-color-light-gray corners-round font-small hidden'></div>
                <div class='font-light-gray font-small'>First Name</div>
                <input id='signup-first-name' class='entry-input border-light-gray focus-border-dark-gray font-small' type='text'/>
                <div class='font-light-gray font-small'>Last Name</div>
                <input id='signup-last-name' class='entry-input border-light-gray focus-border-dark-gray font-small' type='text'/>
                <div class='font-light-gray font-small'>Email</div>
                <input id='signup-email' class='entry-input border-light-gray focus-border-dark-gray font-small' type='email' autocomplete='username'/>
                <div class='font-light-gray font-small'>Password</div>
                <input id='signup-password' class='entry-input border-light-gray focus-border-dark-gray font-small' type='password' autocomplete='new-password'/>
                <div class='font-light-gray font-small'>Confirm Password</div>
                <input id='signup-password-confirmation' class='entry-input border-light-gray focus-border-dark-gray font-small' type='password' autocomplete='new-password'/>
                <div id='signup-button' class='border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Sign Up</div>
            </form>
        </div>
    </div>
`;

TemplateManager.templates.userSelection = `
    <div>User</div>
    <input id='user-selection-input' class='border-light-gray focus-border-dark-gray font-small' type='text' />
    <div id='user-selection-results' class='background-color-white border-light-gray hidden scrollbar-always-visible'></div>
`;

TemplateManager.templates.userSelectionResult = `
    <div class='user-selection-result-picture'></div>
    <div class='user-selection-result-name'><%- firstName %> <%- lastName %></div>
`;

TemplateManager.templates.dateSelection = `
    <div id='date-selection-header' class='flex-row flex-space-between font-medium'>
        <div id='previous-month-button' class='font-light-gray hover-cursor-pointer hover-font-dark-gray'> < </div>
        <div id='date-selection-month'></div>
        <div id='next-month-button' class='font-light-gray hover-cursor-pointer hover-font-dark-gray'> > </div>
    </div>
    <div id='date-selection-day-labels' class='border-bottom-light-gray flex-row flex-space-between font-small'>
        <div class='date-selection-day-label text-center-horizontal'>Sun</div>
        <div class='date-selection-day-label text-center-horizontal'>Mon</div>
        <div class='date-selection-day-label text-center-horizontal'>Tue</div>
        <div class='date-selection-day-label text-center-horizontal'>Wed</div>
        <div class='date-selection-day-label text-center-horizontal'>Thu</div>
        <div class='date-selection-day-label text-center-horizontal'>Fri</div>
        <div class='date-selection-day-label text-center-horizontal'>Sat</div>
    </div>
    <div id='date-selection-weeks'>
    <div>
`;

TemplateManager.templates.tagSelection = `
    <div>Tag</div>
    <input id='tag-selection-input' class='border-light-gray focus-border-dark-gray font-small' type='text' />
    <div id='tag-selection-results' class='background-color-white border-light-gray hidden overflow-y-scroll scrollbar-always-visible'></div>
`;

TemplateManager.templates.colorSelection = `
    <div id='color-selection-row-1' class='flex-row'></div>
    <div id='color-selection-row-2' class='flex-row-reverse'></div>
`;

TemplateManager.templates.board = `
    <div id='board-new-category-button' class='font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>+ Add category</div>
    <input id='board-new-category-input' class='border-dark-gray font-medium hidden'/>
`;

TemplateManager.templates.boardCategory = `
    <div class='board-category-top flex-fit-content'>
        <div class='board-category-header flex-align-center flex-row flex-space-between'>
            <div class='board-category-name font-medium'><%- name %></div>
            <div class='board-category-delete-button font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>X</div>
        </div>
        <div class='board-new-task-button border-light-gray font-light-gray font-large hover-border-dark-gray hover-cursor-pointer hover-font-dark-gray text-center-horizontal'>+</div>
        <textarea class='board-new-task-input border-light-gray hidden focus-border-dark-gray font-small'></textarea>
    </div>
    <div class='board-category-tasks flex-grow overflow-y-scroll'></div>
`;

TemplateManager.templates.deleteCategoryConfirmation = `
    <div id='confirmation-message' class='font-small'>Deleting this category will also delete all of its tasks. Are you sure?</div>
    <div class='flex-row'>
        <div id='confirmation-confirm' class='border-light-gray font-light-gray font-small hover-border-dark-gray hover-cursor-pointer hover-font-dark-gray'>Delete Category</div>
        <div id='confirmation-cancel' class='border-light-gray font-light-gray font-small hover-border-dark-gray hover-cursor-pointer hover-font-dark-gray'>Cancel</div>
    </div>
`;

TemplateManager.templates.boardTask = `
    <div>
        <div class='board-task-priority background-color-priority-<%- priority %> font-white font-very-small font-white sides-round text-center-horizontal'></div>
        <div class='board-task-name-row flex-align-center flex-row'>
            <div class='board-task-check font-small'>&#10003</div>
            <div class='font-small'><%- name %></div>
        </div>
        <div class='board-task-icons flex-align-center flex-row'>
            <div class='board-task-user-picture'></div>
            <div class='board-task-due-date'></div>
        </div>
        <div class='board-task-tags flex-row flex-wrap'></div>
    </div>
    <div>
        <div class='board-task-delete-button font-light-gray font-medium hover-font-dark-gray'>X</div>
    </div>
`;

TemplateManager.templates.userPictureUnassigned = `
    <div class='icon-user-small'>
        <div></div>
        <div></div>
    </div>
`;

TemplateManager.templates.userPictureDefault = `
    <div class='font-white'><%- firstName[0] %><%- lastName[0] %></div>
`;

TemplateManager.templates.dueDateIcon = `
    <div class='icon-clock-small'>
        <div></div>
    </div>
`;

TemplateManager.templates.popup = `
    <div id='popup' class='background-color-white border-light-gray'></div>
`;

TemplateManager.templates.projectDetails = `
    <div id='project-details-header' class='border-bottom-light-gray flex-fit-content flex-row-reverse flex-space-between'>
        <div id='project-details-close-button' class='font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>X</div>
    </div>
    <div id='project-details-scroll-container' class='flex-grow overflow-y-scroll'>
        <input id='project-details-name' />
        <textarea id='project-details-description'></textarea>
        <div class='flex-align-baseline flex-row font-light-gray font-small'>
            <div class='project-details-label'>Owned By:</div>
            <div id='project-details-owner'></div>
        </div>
        <div class='flex-align-baseline flex-row font-light-gray font-small'>
            <div class='project-details-label'>Team Members:</div>
            <div id='project-details-team-members'>

            </div>
        </div>
        <div class='flex-align-baseline flex-row font-light-gray font-small'>
            <div class='project-details-label'>Tags:</div>
            <div id='project-details-tags'></div>
        </div>
    </div>
`;

TemplateManager.templates.projectDetailsOwner = `
    <div id='project-details-owner-picture'></div>
    <div id='project-details-owner-name'></div>
`;

TemplateManager.templates.projectDetailsTeamMembers = `
    <div id='project-details-invite-team-member-button' class='font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>+ Invite a team member</div>
`;

TemplateManager.templates.projectDetailsTeamMember = `
    <div class='project-details-team-member-picture'></div>
    <div class='project-details-team-member-name'></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray hover-cursor-pointer invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.projectDetailsTags = `
    <div id='project-details-new-tag-button' class='font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>+ Create a tag</div>
    <input id='project-details-new-tag-input' class='border-dark-gray font-small hidden' placeholder='Tag Name'/>
`;

TemplateManager.templates.projectDetailsTag= `
    <div class='project-details-tag-name background-color-option-<%- backgroundColor %> font-white hover-cursor-pointer hover-translucent sides-round text-center-horizontal'><%- name %></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray hover-cursor-pointer invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.taskDetails = `
    <div id='task-details-header' class='border-bottom-light-gray flex-fit-content flex-row-reverse flex-space-between'>
        <div id='task-details-close-button' class='font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>X</div>
        <div id='task-details-completed'></div>
    </div>
    <div id='task-details-scroll-container' class='flex-grow background-color-light-gray overflow-y-scroll'>
        <div id='task-details-properties' class='background-color-white'>
            <input id='task-details-name' />
            <textarea id='task-details-description'></textarea>
            <div class='flex-align-center flex-row font-light-gray font-small'>
                <div class='task-details-label'>Assigned To:</div>
                <div id='task-details-user'></div>
            </div>
            <div class='flex-align-center flex-row font-light-gray font-small'>
                <div class='task-details-label'>Due Date:</div>
                <div id='task-details-due-date'></div>
            </div>
            <div class='flex-align-baseline flex-row font-light-gray font-small'>
                <div class='task-details-label'>Priority:</div>
                <div id='task-details-priority'></div>
            </div>
            <div class='flex-align-baseline flex-row font-light-gray font-small'>
                <div class='task-details-label'>Tags:</div>
                <div id='task-details-tags'></div>
            </div>
        </div>
        <div id='task-details-comments'></div>
    </div>
    <div id='task-details-new-comment' class='border-top-light-gray flex-fit-content'>
        <textarea id='task-details-new-comment-input' class='border-light-gray font-small' placeholder='Add a comment to this task'></textarea>
    </div>
`;

TemplateManager.templates.taskDetailsCompleted = `
    <div>&#10003</div>
    <div id='task-details-completed-text'></div>
`;

TemplateManager.templates.taskDetailsUser = `
    <div id='task-details-user-picture'></div>
    <div id='task-details-user-name'></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.taskDetailsDueDate = `
    <div id='task-details-due-date-icon'></div>
    <div id='task-details-due-date-text'></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.taskDetailsPriority = `
    <div id='task-details-priority-text' class='background-color-priority-<%- priority %> font-white font-small font-white sides-round text-center-horizontal'></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.taskDetailsTags = `
    <div id='task-details-add-tag-button' class='hover-cursor-pointer hover-font-dark-gray'>+ Add a tag</div>
`;

TemplateManager.templates.taskDetailsTag = `
    <div class='task-details-tag-name background-color-option-<%- backgroundColor %> font-white sides-round text-center-horizontal'><%- name %></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray hover-cursor-pointer invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.taskDetailsComment = `
    <div class='flex-row flex-align-baseline'>
        <div class='task-details-comment-user'></div>
        <div class='task-details-comment-text font-dark-gray font-small'>
            <%- text %>
            <span class='task-details-comment-creation-time font-light-gray font-very-small'></span>
        </div>
    </div>
    <div class='task-details-comment-delete-button font-light-gray font-very-small hover-cursor-pointer hover-font-dark-gray invisible'>X</div>
`;
