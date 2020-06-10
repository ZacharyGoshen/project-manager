onSignupViewLoad();

function onSignupViewLoad() {
    $(document).ready(function () {
        centerSignupTitle();
        centerSignupContainer();
    });
}

function centerSignupTitle() {
    let container = $("#signupViewSoftwareTitle");
    let containerTop = (window.innerHeight / 8) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}

function centerSignupContainer() {
    let container = $("#userSignupContainer");
    let containerTop = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}