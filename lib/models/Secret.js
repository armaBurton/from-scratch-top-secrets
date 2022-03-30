const pool = require('../utils/pool');

module.exports = class Secret {
  title;
  description;

  constructor(row){
    this.title = row.title;
    this.description = row.description;
  }

  static async getSecrets(){
    const { rows } = await pool.query(
      `
        SELECT *
        FROM secrets
      `
    );
    return rows.map(row => new Secret(row));
  }

};
