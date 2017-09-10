class Room {
    constructor(name, capacity) {
        if (!name || typeof name !== 'string' ||
            name.length < 2 || name.length > 10) {
            throw new Error('Invalid room name!');
        }

        if (!capacity || typeof capacity !== 'number' ||
            capacity < 1 || capacity > 1000) {
            throw new Error('Invalid room capacity!');
        }

        this.name = name;
        this.capacity = capacity;
    }
}

module.exports = Room;