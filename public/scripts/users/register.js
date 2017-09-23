(function () {
    let userType = $('#user-type').val();
    let subjectsLoaded = false;
    let groupsLoaded = false;

    updateForm();

    $('#user-type').change(() => {
        userType = $('#user-type').children('option:selected').val();
        updateForm();
    });

    $('#lead-teacher input').change(() => {
        updateForm();
    });

    function updateForm() {
        if (groupsLoaded === false) {
            getAllGroups();
            groupsLoaded = true;
        }

        if (userType === 'Teacher') {
            $('#lead-teacher').removeClass('d-none');
            $('#subjects').removeClass('d-none');

            if (subjectsLoaded === false) {
                getAllSubjects();
                subjectsLoaded = true;
            }

            if ($('#lead-teacher input').is(':checked')) {
                $('#group').removeClass('d-none');
            } else {
                $('#group').addClass('d-none');
            }
        } else {
            $('#lead-teacher').addClass('d-none');
            $('#subjects').addClass('d-none');

            $('#group').removeClass('d-none');
        }
    }

    function getAllGroups() {
        $.ajax({
            type: 'GET',
            url: '/api/groups',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        })
        .done((response) => {
            fillGroups(response.groups);
        })
        .fail((error) => {
            alert(error.responseJSON.message);
        });
    }

    function getAllSubjects() {
        $.ajax({
                type: 'GET',
                url: '/api/subjects',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
            .done((response) => {
                fillSubjects(response.subjects);
            })
            .fail((error) => {
                alert(error.responseJSON.message);
            });
    }

    function fillSubjects(subjects) {
        for (let subject of subjects) {
            const el = `
            <div>
                <label class="custom-control custom-checkbox">
                    <input name="subjects" value=${subject.code} id="${subject.code}" type="checkbox" class="custom-control-input"/>
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">${subject.code}</span>
                </label>
            </div>`

            $('#subjects #collapse-one .card-body').append(el);
        }
    }

    function fillGroups(groups) {
        for (let group of groups) {
            const el = `<option value="${group.name}">${group.name}</option>`;
            $('#group').append(el);
        }
    }

    $('#register form').submit((e) => {
        e.preventDefault();
        const el = document.querySelector('#register > form');
        const data = new FormData(el);
        const userType = data.get('userType');
        const firstName = data.get('firstName');
        const lastName = data.get('lastName');
        const username = data.get('username');
        const password = data.get('password');
        const group = data.get('group');
        const subjects = data.getAll('subjects');
        let leadTeacher = data.get('leadTeacher');

        if (leadTeacher === 'on') {
            leadTeacher = true;
        } else {
            leadTeacher = false;
        }

        const postData = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password,
            userType: userType,
            leadTeacher: leadTeacher,
            group: group,
            subjects: subjects,
        }

        $.ajax({
            type: 'POST',
            url: '/users/register',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(postData),
            success(response) {
                window.location.href = '/users/login';
            },
            error(error) {
                alert(error.responseJSON.message);
            }
        });
    })
})();