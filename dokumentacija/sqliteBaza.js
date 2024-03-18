const SQLite = require("sqlite3").Database;

class Baza {
    constructor(putanjaSQLliteDatoteka) {
        this.vezaDB = new SQLite(putanjaSQLliteDatoteka);
        this.vezaDB.exec("PRAGMA foreign_keys = ON;");
    }

    izvrsiUpit(sql, povratnaFunkcija) {
        this.vezaDB.all(sql, povratnaFunkcija);
    }

    zatvoriVezu() {
        this.vezaDB.close();
    }
}

module.exports = Baza;
