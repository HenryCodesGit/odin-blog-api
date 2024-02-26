const Pool = require('pg').Pool;

// Move these into ENV later?

// TODO: make 'db-config' have a static var that is accessible by all files that import it. 
// Initialize db=config buy doing something like.. db-config.config(), but only once when the app is started.

const makePool = (user, password, database) => {
    return new Pool({
        user,
        password,
        database,
        host: "localhost",
        port: 5432,
    }); 
}

module.exports = {
    makePool
};