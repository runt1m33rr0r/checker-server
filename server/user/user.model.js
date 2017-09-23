const roleTypes = require('../utils/roletypes');

class User {
    constructor(username, roles, salt, hashedPass) {
        if (typeof username !== 'string' ||
            username.length < 6 ||
            username.length > 15 ||
            username !== username.toLowerCase()) {
            throw new Error('Invalid credentials!');
        }

        if (!Array.isArray(roles) || roles.length === 0) {
            throw new Error('User must have a role!');
        } else {
            roles.forEach((role) => {
                const types = Object.values(roleTypes);
                if (!types.includes(role)) {
                    throw new Error('User has one or more invalid roles!');
                }
            });
        }

        if (typeof salt !== 'string') {
            throw new Error('Invalid credentials!');
        }

        if (typeof hashedPass !== 'string') {
            throw new Error('Invalid credentials!');
        }

        this.username = username;
        this.hashedPass = hashedPass;
        this.salt = salt;
        this.roles = roles;
    }
}

module.exports = User;