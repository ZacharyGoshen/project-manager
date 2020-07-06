var TemplateManager = {
    templates: {}
};

TemplateManager.templates.accountInfo = `
    <div id='account-info-user-picture'></div>
    <div id='account-info-error-message' class='background-color-light-gray corners-round font-small hidden'></div>
    <div class='font-light-gray font-small'>First Name</div>
    <input id='account-info-first-name' class='border-light-gray font-small'/>
    <div class='font-light-gray font-small'>Last Name</div>
    <input id='account-info-last-name' class='border-light-gray font-small'/>
    <div class='font-light-gray font-small'>Email</div>
    <input id='account-info-email' class='border-light-gray font-small'/>
    <div id='account-info-update-button' class='border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Update Info</div>  
`;

TemplateManager.templates.accountPassword = `
    <div id='account-password-error-message' class='background-color-light-gray corners-round font-small hidden'></div>
    <div class='font-light-gray font-small'>Current Password</div>
    <input id='account-password-current' class='border-light-gray font-small' type='password' autocomplete='current-password'/>
    <div class='font-light-gray font-small'>New Password</div>
    <input id='account-password-new' class='border-light-gray font-small' type='password' autocomplete='new-password'/>
    <div class='font-light-gray font-small'>Confirm Password</div>
    <input id='account-password-confirmation' class='border-light-gray font-small' type='password' autocomplete='new-password'/>
    <div id='account-password-update-button' class='border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Change Password</div> 
`;

TemplateManager.templates.accountSettings = `
    <div id='account-settings-header' class='border-bottom-light-gray flex-fit-content flex-row flex-space-between'>
        <div class='flex-row'>
            <div id='account-settings-info-link' class='account-settings-header-label hover-cursor-pointer hover-font-dark-gray font-medium font-light-gray'>Info</div>
            <div id='account-settings-password-link' class='account-settings-header-label hover-cursor-pointer hover-font-dark-gray font-medium font-light-gray'>Password</div>
        </div>
        <div id='account-settings-close-button' class='font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>X</div>
    </div>
    <div id='account-settings-content'></div>
`;

TemplateManager.templates.board = `
    <div id='board-new-category'>
        <div id='board-new-category-button' class='font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>+ Add category</div>
        <input id='board-new-category-input' class='border-dark-gray font-medium hidden'/>
    </div>
    <div id='board-extra-width' class='flex-fit-content'></div>
`;

TemplateManager.templates.boardCategory = `
    <div class='board-category-top flex-fit-content'>
        <div class='board-category-header flex-align-center flex-row flex-space-between hover-cursor-pointer'>
            <div class='board-category-name flex-grow font-medium'><%- name %></div>
            <input class='board-category-name-input border-dark-gray flex-grow font-medium hidden'/>
            <div class='board-category-delete-button flex-fit-content font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>X</div>
        </div>
        <div class='board-new-task-button border-light-gray font-light-gray font-large hover-border-dark-gray hover-cursor-pointer hover-font-dark-gray text-center-horizontal'>+</div>
        <textarea class='board-new-task-input border-light-gray hidden focus-border-dark-gray font-small'></textarea>
    </div>
    <div class='board-category-tasks flex-grow overflow-y-scroll'>
        <div class='board-category-extra-height'></div>
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

TemplateManager.templates.colorSelection = `
    <div id='color-selection-row-1' class='flex-row'></div>
    <div id='color-selection-row-2' class='flex-row-reverse'></div>
`;

TemplateManager.templates.confirmation = `
    <div id='confirmation-message' class='font-small'></div>
    <div class='flex-row'>
        <div id='confirmation-submit' class='border-light-gray font-light-gray font-small hover-border-dark-gray hover-cursor-pointer hover-font-dark-gray'>Delete Category</div>
        <div id='confirmation-cancel' class='border-light-gray font-light-gray font-small hover-border-dark-gray hover-cursor-pointer hover-font-dark-gray'>Cancel</div>
    </div>
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

TemplateManager.templates.dueDateIcon = `
    <div class='icon-clock-small'>
        <div></div>
    </div>
`;

TemplateManager.templates.entry = `
    <div class='flex-align-center flex-column'>
        <div id='entry-title' class='font-very-large font-white'>Project Manager</div>
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
    </div>
`;

TemplateManager.templates.invite = `
    <div class='invite-message font-black'><%- inviterFirstName %> <%- inviterLastName %> invites you to join "<%- projectName %>".</div>
    <div class='flex-align-center flex-row '>
        <div class='invite-accept-button border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Accept</div>
        <div class='invite-decline-button border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Decline</div>
    </div>
`;

TemplateManager.templates.inviteIcon = `
    <div class='icon-invite-triangle-left'></div>
    <div class='icon-invite-triangle-right'></div>
    <div class='icon-invite-triangle-up'></div>
    <div class='icon-invite-triangle-down-back child'></div>
    <div class='icon-invite-triangle-down-front'></div>
    <div class='icon-invite-number background-color-light-gray circle child-center font-dark-gray font-very-small'></div>
`;

TemplateManager.templates.inviteDropdownMenu = `
    <div id='invite-empty' class='hidden font-light-gray font-small'>You have no new invites.</div>
`;

TemplateManager.templates.navigationBar = `
    <div class='flex-align-center flex-row'>
        <div id='navigation-bar-project' class='hover-cursor-pointer font-large'></div>
        <div id='navigation-bar-project-dropdown-button' class='font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>&#9660</div>
        <div id='navigation-bar-new-project-button' class='hidden hover-cursor-pointer hover-font-dark-gray font-large font-light-gray'></div> 
    </div>
    <div class='flex-align-center flex-row'>
        <div id='navigation-bar-invite-icon'></div>
        <div id='navigation-bar-user' class='hover-cursor-pointer'></div>
    </div>
`;

TemplateManager.templates.newProject = `
    <div id='new-project-header' class='border-bottom-light-gray flex-fit-content flex-row-reverse flex-space-between'>
        <div id='new-project-close-button' class='font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>X</div>
    </div>
    <input id='new-project-name' class='border-light-gray font-large focus-border-dark-gray' placeholder='Add a name...'/>
    <textarea id='new-project-description' class='border-light-gray font-small focus-border-dark-gray' placeholder='Add a description...'></textarea>
    <div id='new-project-create-button' class='border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Create Project</div>
`;

TemplateManager.templates.optionsBar = `
    <div id='options-bar-sort' class='flex-row flex-align-center font-light-gray font-medium hover-child-background-color-very-dark-gray hover-child-border-top-color-very-dark-gray hover-cursor-pointer hover-font-dark-gray'>
        <div id='options-bar-sort-icon'></div>
        <div>Sort</div>
    </div>
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
            <div id='project-details-team-members'></div>
        </div>
        <div class='flex-align-baseline flex-row font-light-gray font-small'>
            <div class='project-details-label'>Tags:</div>
            <div id='project-details-tags'></div>
        </div>
    </div>
    <div id='project-details-footer' class='border-top-light-gray flex-align-center flex-fit-content flex-row'>
        <div id='project-details-leave-button' class='border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Leave Project</div>
        <div id='project-details-delete-button' class='border-light-gray hover-background-color-dark-gray hover-border-dark-gray hover-cursor-pointer hover-font-white font-light-gray font-small text-center-horizontal'>Delete Project</div>
    </div>
`;

TemplateManager.templates.projectDetailsOwner = `
    <div id='project-details-owner-picture'></div>
    <div id='project-details-owner-name'></div>
`;

TemplateManager.templates.projectDetailsTagEditable = `
    <div class='project-details-tag-name background-color-option-<%- backgroundColor %> font-white hover-cursor-pointer hover-translucent sides-round text-center-horizontal'><%- name %></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray hover-cursor-pointer invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.projectDetailsTagNotEditable = `
    <div class='project-details-tag-name background-color-option-<%- backgroundColor %> font-white sides-round text-center-horizontal'><%- name %></div>
`;

TemplateManager.templates.projectDetailsTagsEditable = `
    <div id='project-details-new-tag-button' class='font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>+ Create a tag</div>
    <input id='project-details-new-tag-input' class='border-dark-gray font-small hidden' placeholder='Tag Name'/>
`;

TemplateManager.templates.projectDetailsTagsNotEditable = `
`;

TemplateManager.templates.projectDetailsTeamMemberEditable = `
    <div class='project-details-team-member-picture'></div>
    <div class='project-details-team-member-name'></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray hover-cursor-pointer invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.projectDetailsTeamMemberNotEditable = `
    <div class='project-details-team-member-picture'></div>
    <div class='project-details-team-member-name'></div>
`;

TemplateManager.templates.projectDetailsTeamMembersEditable = `
    <div class='flex-align-baseline flex-row'>
        <div id='project-details-invite-team-member-button' class='font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>+ Invite a team member</div>
        <input id='project-details-invite-team-member-input' class='border-dark-gray font-small hidden' placeholder='Email'/>
        <div id='project-details-invite-team-member-message' class='background-color-light-gray corners-round font-black hidden'></div>
    </div>
`;

TemplateManager.templates.projectDetailsTeamMembersNotEditable = `
`;

TemplateManager.templates.projectDropdownMenu = `
    <div id='new-project-button' class='font-light-gray font-medium hover-cursor-pointer hover-font-dark-gray'>+ Create new project</div>
`;

TemplateManager.templates.sortDropdownMenu = `
    <div class='flex-row'>
        <div id='sort-name-ascending' class='sort-option-text font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>Alphabetical</div>
        <div class='font-light-gray font-small'>&#8593</div>
    </div>
    <div class='flex-row'>
        <div id='sort-name-descending' class='sort-option-text font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>Alphabetical</div>
        <div class='font-light-gray font-small'>&#8595</div>
    </div>
    <div class='flex-row'>
        <div id='sort-due-date-ascending' class='sort-option-text font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>Due Date</div>
        <div class='font-light-gray font-small'>&#8593</div>
    </div>
    <div class='flex-row'>
        <div id='sort-due-date-descending' class='sort-option-text font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>Due Date</div>
        <div class='font-light-gray font-small'>&#8595</div>
    </div>
    <div class='flex-row'>
        <div id='sort-priority-ascending' class='sort-option-text font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>Priority</div>
        <div class='font-light-gray font-small'>&#8593</div>
    </div>
    <div class='flex-row'>
        <div id='sort-priority-descending' class='sort-option-text font-light-gray font-small hover-cursor-pointer hover-font-dark-gray'>Priority</div>
        <div class='font-light-gray font-small'>&#8595</div>
    </div>
    
`;

TemplateManager.templates.tagSelection = `
    <div>Tag</div>
    <input id='tag-selection-input' class='border-light-gray focus-border-dark-gray font-small' type='text' />
    <div id='tag-selection-results' class='background-color-white border-light-gray hidden overflow-y-scroll scrollbar-always-visible'></div>
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

TemplateManager.templates.taskDetailsCompleted = `
    <div>&#10003</div>
    <div id='task-details-completed-text'></div>
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

TemplateManager.templates.taskDetailsTag = `
    <div class='task-details-tag-name background-color-option-<%- backgroundColor %> font-white sides-round text-center-horizontal'><%- name %></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray hover-cursor-pointer invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.taskDetailsTags = `
    <div id='task-details-add-tag-button' class='hover-cursor-pointer hover-font-dark-gray'>+ Add a tag</div>
`;

TemplateManager.templates.taskDetailsUser = `
    <div id='task-details-user-picture'></div>
    <div id='task-details-user-name'></div>
    <div class='remove-button-small background-color-light-gray child-center circle hover-background-color-dark-gray invisible'>
        <div class='font-very-small font-white'>X</div>
    </div>
`;

TemplateManager.templates.sortIcon = `
    <div>
        <div class='icon-sort-bar-1 background-color-dark-gray child-background-color-very-dark-gray'></div>
        <div class='icon-sort-bar-2 background-color-dark-gray child-background-color-very-dark-gray'></div>
        <div class='icon-sort-bar-3 background-color-dark-gray child-background-color-very-dark-gray'></div>
    </div>
    <div class='icon-sort-arrow flex-align-center flex-column'>
        <div class='icon-sort-arrow-shaft background-color-dark-gray child-background-color-very-dark-gray'></div>
        <div class='icon-sort-arrow-head child-border-top-color-very-dark-gray'></div>
    </div>
`;

TemplateManager.templates.userDropdownMenu = `
    <div id='account-settings-button' class='font-light-gray hover-cursor-pointer hover-font-dark-gray'>Account Settings</div>
    <div id='logout-button' class='font-light-gray hover-cursor-pointer hover-font-dark-gray'>Log Out</div>
`;

TemplateManager.templates.userPictureDefault = `
    <div class='font-white'><%- firstName[0] %><%- lastName[0] %></div>
`;

TemplateManager.templates.userPictureUnassigned = `
    <div class='icon-user-small'>
        <div></div>
        <div></div>
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
