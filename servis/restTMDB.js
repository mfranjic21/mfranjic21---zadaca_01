const TMDBklijent = require("./klijentTMDB.js");

class RestTMDB {
    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
        console.log(api_kljuc);

        this.tmdbKlijent.dohvatiFilm(500).then(console.log).catch(console.log);
    }

    getZanr(zahtjev, odgovor) {
        console.log(this);
        this.tmdbKlijent
            .dohvatiZanrove()
            .then((zanrovi) => {
                //console.log(zanrovi);
                odgovor.type("application/json");
                odgovor.send(zanrovi);
            })
            .catch((greska) => {
                odgovor.json(greska);
            });
    }

    getFilmovi(zahtjev, odgovor) {
        console.log(this);
        odgovor.type("application/json");
        let stranica = zahtjev.query.stranica;
        let trazi = zahtjev.query.trazi;

        if (stranica == null || trazi == null) {
            odgovor.status("417");
            odgovor.send({ greska: "neocekivani podaci" });
            return;
        }

        this.tmdbKlijent
            .pretraziFilmovePoNazivu(trazi, stranica)
            .then((filmovi) => {
                //console.log(filmovi);
                odgovor.send(filmovi);
            })
            .catch((greska) => {
                odgovor.json(greska);
            });
    }
}

module.exports = RestTMDB;
