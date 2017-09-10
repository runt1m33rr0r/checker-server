const BaseData = require('../../base/base.data');

class RoomData extends BaseData {
    constructor(db, models) {
        super(db);

        const { Room } = models;
        this.Room = Room;
    }

    createRoom(name, capacity) {
        return this.getRoomByName(name)
            .then((room) => {
                if (room) {
                    return Promise.reject({
                        message: 'Същата стая е вече въведена!',
                    });
                }

                const roomModel = new this.Room(name, capacity);
                return this.createEntry(roomModel);
            });
    }

    getRoomByName(name) {
        if (!name) {
            return Promise.reject({ message: 'Room name not specified!' });
        }

        return this.collection.findOne({
            name: name,
        });
    }
}

module.exports = RoomData;