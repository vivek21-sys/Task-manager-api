const mysql = require("mysql2/promise");

async function get_connection() {
    const con = await mysql.createConnection({
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST
    });
    return con;
}

async function executeProcedure(procName, params) {
    let con;
    try {
        con = await get_connection();
        // Generate a string of question marks equal to the number of params
        const placeholders = params.map(() => '?').join(', ');
        const [results] = await con.execute(`CALL ${procName}(${placeholders})`, params);
        return results[0];
    } catch (error) {
        throw new Error("Database error: " + error.message);
    } finally {
        if (con) await con.end(); // Ensure the connection is closed
    }
}

// Export both functions
module.exports = {
    get_connection,
    executeProcedure
};
