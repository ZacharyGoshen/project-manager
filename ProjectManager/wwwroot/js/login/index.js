onLoginViewLoad();

function onLoginViewLoad() {
    $(document).ready(function () {
        centerLoginTitle();
        centerLoginContainer();
    });
}

function centerLoginTitle() {
    let container = $("#loginViewSoftwareTitle");
    let containerTop = (window.innerHeight / 8) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}

function centerLoginContainer() {
    let container = $("#userLoginContainer");
    let containerTop = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}