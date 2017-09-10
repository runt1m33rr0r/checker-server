function init({ data }) {
    const { RoomData } = data;

    return {
        getAllRooms(req, res) {
            RoomData.getAll()
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => res.send(err.message));
        },
        createRoom(req, res) {
            const name = req.roomName;
            const capacity = req.roomCapacity;

            RoomData.createRoom(name, capacity)
                .then(() => {
                    res.send('room created');
                })
                .catch((err) => res.send(err.message));
        },
    };
}

module.exports = { init };