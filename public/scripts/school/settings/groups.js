(function () {
    $('#btn-save').click((e) => {
        e.preventDefault();

        let groups = [];
        let uncheckedGroups = [];
        let data = $('#groups-form').serializeArray();
        $('input:checkbox:not(:checked)').map((index, el) => {
            uncheckedGroups.push($(el).attr('name'))
        })

        for (let group of data) {
            if (Array.isArray(group.value)) {
                groups.push({
                    name: group.name,
                    subjects: group.value,
                });
            } else {
                groups.push({
                    name: group.name,
                    subjects: [group.value, 'shit'],
                });
            }
        }

        for (let group of uncheckedGroups) {
            groups.push({
                name: group,
                subjects: [],
            });
        }

        let postData = {
            groups: groups,
        }

        $.ajax({
            type: 'POST',
            url: '/school/settings/groups',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(postData),
            success(response) {
                alert(response.message);
            },
            error(error) {
                alert(error.responseJSON.message);
            }
        });
    })
})();