class Room {
    constructor(roomId, roomNumber, capacity) {
        this._roomId = roomId;
        this._roomNumber = roomNumber;
        this._capacity = capacity;
    }

    getRoomId() {
        return this._roomId;
    }

    getRoomNumber() {
        return this._roomNumber;
    }

    getRoomCapacity() {
        return this._capacity;
    }
}

module.exports = Room;