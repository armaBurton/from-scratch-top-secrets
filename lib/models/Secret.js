const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  createdAt;

  constructor(row){
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.createdAt = row.created_at;
  }

  static async getSecrets(){
    const { rows } = await pool.query(
      `
        SELECT title, description, created_at
        FROM secrets
      `
    );
    return rows.map(row => new Secret(row));
  }

  static async addSecret({ title, description }){
    const { rows } = await pool.query(
      `
        INSERT INTO secrets (title, description)
        VALUES ($1, $2)
        RETURNING *
      `,
      [title, description]
    );

    console.log('|| rows >', rows);

    return new Secret(rows[0]);
  }

};
