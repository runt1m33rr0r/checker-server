(function () {
    let timeslots = [];

    function getTimeslotObjects() {
        let timeslotObjs = [];
        let numberOfWorkdays = 5;

        for (let timeslot of timeslots) {
            for (let i = 1; i <= numberOfWorkdays; i++) {
                let obj = parseTimeslotFromString(timeslot);
                obj.day = i;
                timeslotObjs.push(obj);
            }
        }

        return timeslotObjs;
    }

    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }

    function removeElementFromArray(value, array) {
        let index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    function parseTimeslot(fromDom, toDom) {
        let from = $(fromDom).val();
        let to = $(toDom).val();
        let areValid =
            moment(from, ['HH:mm', 'HH'], false).isValid() &&
            moment(to, ['HH:mm', 'HH'], false).isValid();

        if (areValid) {
            let parsedFrom = moment(from, ['HH:mm', 'HH'], false).toObject();
            let parsedTo = moment(to, ['HH:mm', 'HH'], false).toObject();
            return `От ${parsedFrom.hours}:${parsedFrom.minutes} до ${parsedTo.hours}:${parsedTo.minutes}`
        } else {
            throw new Error('invalid timeslots');
        }
    }

    function parseTimeslotFromString(string) {
        let numbers = string.match(/\d+/g);
        let fromHour = parseInt(numbers[0]);
        let fromMinute = parseInt(numbers[1]);
        let toHour = parseInt(numbers[2]);
        let toMinute = parseInt(numbers[3]);

        return {
            fromHour: fromHour,
            fromMinute: fromMinute,
            toHour: toHour,
            toMinute: toMinute,
            day: 0
        }
    }

    function initList() {
        $('#timeslot-btn').click(function (e) {
            let timeslot = parseTimeslot('#from', '#to')

            if (!isInArray(timeslot, timeslots)) {
                let el = `<span class="list-group-item list-group-item-action">${timeslot}</span>`;

                $('#timeslots').append(el);
                timeslots.push(timeslot);
            }
        });
    }

    function initListEvents() {
        $('#timeslots').click(function (e) {
            let target = $(e.target);
            let timeslot = target.text();

            if (target.is('span')) {
                $(e.target).remove();
            }

            removeElementFromArray(timeslot, timeslots);
        });
    }

    initList();
    initListEvents();

    $('#save-btn').click(() => {
        let data = {
            timeslots: getTimeslotObjects()
        }

        $.ajax({
            type: 'POST',
            url: '/school/settings/timetable',
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
    })
})();