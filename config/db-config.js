const Pool = require('pg').Pool;

// Move these into ENV later?
const makePool = (user, password, database) => {
    return new Pool({
        user,
        password,
        database,
        host: "localhost",
        port: 5432,
    })
}

module.exports = {
    makePool
};