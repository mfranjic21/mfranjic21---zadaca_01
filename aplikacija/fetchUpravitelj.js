const FilmoviPretrazivanje = require("./filmoviPretrazivanje.js");
const jwt = require("./moduli/jwt.js");
const Autentifikacija = require("./autentifikacija.js");

class FetchUpravitelj {
    constructor(tajniKljucJWT) {
        this.auth = new Autentifikacija();
        this.fp = new FilmoviPretrazivanje();
        this.tajniKljucJWT = tajniKljucJWT;
    }

    dajSveZanrove = async function (zahtjev, odgovor) {
        odgovor.json(await this.fp.dohvatiSveZanrove());
    };
    dajDvaFilma = async function (zahtjev, odgovor) {
        odgovor.json(await this.fp.dohvatiNasumceFilm(zahtjev.query.zanr));
    };

    getJWT = async function (zahtjev, odgovor) {
        odgovor.type("json");
        if (zahtjev.session.jwt != null) {
            let k = { korime: jwt.dajTijelo(zahtjev.session.jwt).korime };
            let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
            odgovor.send({ ok: noviToken });
            return;
        }
        odgovor.status(401);
        odgovor.send({ greska: "nemam token!" });
    };

    filmoviPretrazivanje = async function (zahtjev, odgovor) {
        let str = zahtjev.query.str;
        let filter = zahtjev.query.filter;
        console.log(zahtjev.query);
        odgovor.json(await this.fp.dohvatiFilmove(str, filter));
    };

    dodajFilm = async function (zahtjev, odgovor) {
        console.log(zahtjev.body);
        if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
            odgovor.status(401);
            odgovor.json({ greska: "neaoutorizirani pristup" });
        } else {
            //TODO obradi zahtjev
            odgovor.json({ ok: "OK" });
        }
    };

    dajSveFilmove = async function (zahtjev, odgovor) {
        odgovor.type("application/json");

        try {
            const filmoviPretrazivanje = new FilmoviPretrazivanje();
            const filmovi = await filmoviPretrazivanje.dohvatiFilmove();

            odgovor.status(200).json(filmovi);
        } catch (error) {
            console.error("Error fetching movies:", error);
            odgovor.status(500).json({ greska: "Internal Server Error" });
        }
    };
}
module.exports = FetchUpravitelj;
