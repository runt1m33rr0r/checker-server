function init({
    data,
}) {
    const {
        RoomData,
    } = data;

    return {
        getSetupPage(req, res) {
            res.render('school/system');
        },
        getAllRooms(req, res) {
            RoomData.getAll()
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => res.render('base/error', {
                    error: err,
                }));
        },
        createRooms(req, res) {
            const name = req.roomName;
            const capacity = req.roomCapacity;
            console.log(req);

            // RoomData.createRoom(name, capacity)
            //     .then(() => {
            //         res.send('room created');
            //     })
            //     .catch((err) => res.render('base/error', {
            //         error: err,
            //     }));
        },
    };
}

module.exports = {
    init,
};