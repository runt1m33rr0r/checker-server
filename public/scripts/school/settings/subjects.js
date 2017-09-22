(function () {
    let subjects = [];

    function isInArray(value, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].code === value.code) {
                return true;
            }
        }
        return false;
    }

    function removeElementFromArray(value, array) {
        let index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    function getSubjectByCode(code) {
        return subjects.find((subject) => subject.code === code);
    }

    function initList() {
        $('#subject-btn').click(function (e) {
            let subjectName = $('#subject-name').val();
            let subjectLevel = parseInt($('#subject-level').val().toString());
            let subjectCode = `${subjectName}-${subjectLevel}`;
            let subjectObj = {
                name: subjectName,
                code: subjectCode,
                teachers: [],
            }

            if (!isInArray(subjectObj, subjects)) {
                let el = `<span class="list-group-item list-group-item-action">${subjectCode}</span>`;
                $('#subjects').append(el);
                subjects.push(subjectObj);
            }
        });
    }

    function initListEvents() {
        $('#subjects').click(function (e) {
            let target = $(e.target);
            let code = target.text();

            if (target.is('span')) {
                $(e.target).remove();
            }

            removeElementFromArray(getSubjectByCode(code), subjects);
        });
    }

    function saveSubjects() {
        let data = {
            subjects: subjects,
        }

        $.ajax({
            type: 'POST',
            url: '/school/settings/subjects',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            success(response) {
                alert(response.message);
            },
            error(error) {
                alert(error.responseJSON.message);
            }
        });
    }

    initList();
    initListEvents();

    $('#save-btn').click(e => {
        saveSubjects();
    })
})();