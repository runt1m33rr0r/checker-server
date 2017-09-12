$('#btn-login').on('click', function(event) {
    var username = $('#inputUsername').val();
    var pass = $('#inputPassword').val();
    var data = {
        username: username,
        password: pass
    }

    $.ajax({
        url: '/users/login',
        data: data,
        method: 'POST',
        success(response) {
            window.location.href = "/";
        },
        error(error) {
            console.log(error);
        }
    });
})