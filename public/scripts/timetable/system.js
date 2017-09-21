// $('#btn-login').on('click', function(event) {
//     var username = $('#inputUsername').val();
//     var pass = $('#inputPassword').val();
//     var data = {
//         username: username,
//         password: pass
//     }

//     $.ajax({
//         url: '/users/login',
//         data: data,
//         method: 'POST',
//         success(response) {
//             window.location.href = "/";
//         },
//         error(error) {
//             console.log(error);
//         }
//     });
// })
let subjects = [];
let timeslotsStr = [];
let timeslotsJs = [];
let groups = [];
let numberOfGroupsPerGrade = 0;
let schoolType = '';

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function removeElementFromArray(value, array) {
    let index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function initList(button, contentParams, listDom, listJs) {
    $(button).click(function (e) {
        let content = '';
        if (contentParams.length > 1) {
            content = parseTimeslot(contentParams[0], contentParams[1]);
        } else {
            content = $(contentParams[0]).val();
        }

        if (!isInArray(content, listJs)) {
            let el = '<span class="list-group-item list-group-item-action">' + content + '</span>';
            $(listDom).append(el);
            listJs.push(content);
        }
    });
}

function initListEvents(listDom, listJs) {
    $(listDom).click(function (e) {
        let target = $(e.target);
        let content = target.text();

        if (target.is('span')) {
            $(e.target).remove();
        }

        removeElementFromArray(content, listJs);
    });
}

function parseTimeslot(fromDom, toDom, dayDom) {
    let from = $(fromDom).val();
    let to = $(toDom).val();
    let day = $(dayDom).val();

    let areValid =
        moment(from, ['HH:mm', 'HH'], true).isValid() &&
        moment(to, ['HH:mm', 'HH'], true).isValid() &&
        moment(day, ['DD'], true).isValid();

    if (areValid) {
        let parsedFrom = moment(from, ['HH:mm', 'HH'], true).toObject();
        let parsedTo = moment(to, ['HH:mm', 'HH'], true).toObject();
        let parsedDay = moment(to, ['HH:mm', 'HH'], true).toObject();

        return 'От ' + parsedFrom.hours + ':' + parsedFrom.minutes + ' ' +
            'До ' + parsedTo.hours + ':' + parsedTo.minutes;
    } else {
        throw new Error('invalid timeslots');
    }
}

function generateGroups() {
    let grades = [];
    let groupLetters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З'];

    if (groupLetters.length < numberOfGroupsPerGrade) {
        throw new Error('Impossible number of groups per grade!');
    }

    if (schoolType === 'гимназия') {
        grades = [8, 9, 10, 11, 12];
    } else {
        grades = [1, 2, 3, 4, 5, 6, 7];
    }

    for (let i = 0; i < grades.length; i++) {
        for (let j = 0; j < numberOfGroupsPerGrade; j++) {
            groups.push({
                subjects: subjects,
                name: i + 1 + groupLetters[j]
            })
        }
    }
}

$('#groups-tab').click(function (e) {
    schoolType = $('#school-type').val().toString();
    numberOfGroupsPerGrade = parseInt($('#groups-per-grade').val().toString());
    generateGroups();

    for (let i = 0; i < groups.length; i++) {
        let currentGroup = groups[i];
        let id = i + 1 + 'group';

        let el = `<a class="list-group-item" id=${id}>${currentGroup.name}</a>`;
        $('#groups').append(el);
    }
})

$('#finish button').click(function (e) {
    console.log(subjects);
    console.log(timeslotsStr);
    console.log(groups);
})

initList('#subject-btn', ['#subject-name'], '#subjects', subjects);
initListEvents('#subjects', subjects);

initList('#timeslot-btn', ['#from', '#to'], '#timeslots', timeslotsStr);
initListEvents('#timeslots', timeslotsStr);