(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#main-heading').removeClass('d-none');
        $('#use-phone').addClass('d-none');
        $('#image-label').removeClass('d-none');
        $('#form').removeClass('d-none');
        $('#button').removeClass('d-none');
    } else {
        $('#main-heading').addClass('d-none');
        $('#use-phone').removeClass('d-none');
        $('#image-label').addClass('d-none');
        $('#form').addClass('d-none');
    }
})();