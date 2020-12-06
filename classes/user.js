const db = require('../db');

class User {
  constructor(id, username, password, money) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.money = money;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO users (id, username, password, money) VALUES (DEFAULT, $1, $2, $3) ON CONFLICT DO NOTHING RETURNING id,username, money;`,
      [this.username, this.password, this.money],
    );
  }

  static findOneByUsername(username) {
    return db.oneOrNone(
      `SELECT id, username, password, money FROM users AS U WHERE U.username = $1`,
      [username],
    );
  }

  static findOneById(id) {
    return db.oneOrNone(
      `SELECT id, username, money FROM users AS U WHERE U.id = $1`,
      [id],
    );
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

  static updateMoneyById(id, money) {
    return db.none(`UPDATE users SET money=$1 WHERE id=$2;`, [money, id]);
  }

  static getMoneyById(id) {
    return db.one(`SELECT money FROM users WHERE id=$1;`, [id]);
  }
}

module.exports = User;
