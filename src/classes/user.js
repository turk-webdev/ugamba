const db = require('../db');

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO users (id, username, password) VALUES (DEFAULT, $1, $2) ON CONFLICT DO NOTHING RETURNING id,username;`,
      [this.username, this.password],
    );
  }

  static findOneByUsername(username) {
    return db.oneOrNone(
      `SELECT id, username, password FROM users AS U WHERE U.username = $1`,
      [username],
    );
  }

  static findOneById(id) {
    return db.oneOrNone(`SELECT id, username FROM users AS U WHERE U.id = $1`, [
      id,
    ]);
  }

  static updateUsernameById(id, newUsername) {
    return db.none(`UPDATE users SET username= '$1' WHERE id= $2;`, [
      newUsername,
      id,
    ]);
  }

  static deleteById(id) {
    return db.none(`DELETE FROM users WHERE id=$1`, [id]);
  }
}

module.exports = User;
