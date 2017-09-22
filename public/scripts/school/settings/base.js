(function () {
    let schoolType = $('#school-type').val().toString();
    let groupsPerGrade = parseInt($('#groups-per-grade').val().toString());

    $('#school-type').change(e => {
        schoolType = $(e.target).val().toString();
    })

    $('#groups-per-grade').change(e => {
        groupsPerGrade = parseInt($(e.target).val().toString());
    })

    $('button').click(e => {
        saveGroups(getGroups());
    })

    function getGroups() {
        let grades = [];
        let groups = [];
        let groupLetters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И'];

        if (groupLetters.length < groupsPerGrade) {
            throw new Error('Impossible number of groups per grade!');
        }

        if (schoolType === 'гимназия') {
            grades = [8, 9, 10, 11, 12];
        } else {
            grades = [1, 2, 3, 4, 5, 6, 7];
        }

        for (let i = 0; i < grades.length; i++) {
            for (let j = 0; j < groupsPerGrade; j++) {
                let currentGrade = grades[i];
                let currentGroupLetter = groupLetters[j];
                let groupName = currentGrade + currentGroupLetter;
                groups.push({
                    name: groupName,
                    subjects: [],
                })
            }
        }

        return groups;
    }

    function saveGroups(groups) {
        let data = {
            groups: groups,
        }

        $.ajax({
            type: 'POST',
            url: '/school/settings/base',
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
})();