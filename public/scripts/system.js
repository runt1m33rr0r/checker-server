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
let rooms = [];
let timeslotsStr = [];

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
            console.log(content);
        } else {
            content = $(contentParams[0]).val();
        }

        if (!isInArray(content, listJs)) {
            let el = '<span class="list-group-item list-group-item-action">' + content + '</span>';
            $(listDom).append(el);
            listJs.push(content);

            console.log(listJs);
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
        console.log(listJs);
    });
}

function parseTimeslot(fromDom, toDom) {
    let from = $(fromDom).val();
    let to = $(toDom).val();
    let areValid =
        moment(from, ['HH:mm', 'HH'], true).isValid() &&
        moment(to, ['HH:mm', 'HH'], true).isValid();

    if (areValid) {
        let parsedFrom = moment(from, ['HH:mm', 'HH'], true).toObject();
        let parsedTo = moment(to, ['HH:mm', 'HH'], true).toObject();

        return 'От ' + parsedFrom.hours + ':' + parsedFrom.minutes + ' ' +
               'До ' + parsedTo.hours + ':' + parsedTo.minutes;
    } else {
        throw new Error('invalid timeslots');
    }
}

initList('#subject-btn', ['#subject-name'], '#subjects', subjects);
initListEvents('#subjects', subjects);

initList('#room-btn', ['#room-name'], '#rooms', rooms);
initListEvents('#rooms', rooms);

initList('#timeslot-btn', ['#from', '#to'], '#timeslots', timeslotsStr);
initListEvents('#timeslots', timeslotsStr);