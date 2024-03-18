const session = require("express-session");
const KorisnikDAO = require("./korisnikDAO.js");
const { kreirajToken } = require("../aplikacija/moduli/jwt.js");
const Konfiguracija = require("../konfiguracija.js");

exports.getKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let kdao = new KorisnikDAO();
    kdao.dajSve().then((korisnici) => {
        console.log(korisnici);
        odgovor.send(JSON.stringify(korisnici));
    });
};

exports.postKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.dodaj(podaci).then((poruka) => {
        if (poruka == true) {
            odgovor.status(200);
            odgovor.send(JSON.stringify(poruka));
        } else {
            odgovor.status(400);
            let poruka = { greska: "Podaci su krivo uneseni" };
            odgovor.send(JSON.stringify(poruka));
        }
    });
};

exports.deleteKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" };
    odgovor.send(JSON.stringify(poruka));
};

exports.putKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" };
    odgovor.send(JSON.stringify(poruka));
};

exports.getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.daj(korime).then((korisnik) => {
        if (korisnik == null) {
            odgovor.status(404);
            let poruka = { greska: "Korisnik ne postoji" };
            odgovor.send(JSON.stringify(poruka));
        } else {
            odgovor.status(200);
            console.log(korisnik);
            odgovor.send(JSON.stringify(korisnik));
        }
    });
};

exports.getKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.daj(korime).then((korisnik) => {
        if (korisnik != null && session.korisnik != null && korisnik.id == session.korisnik.id) {
            odgovor.status(201);
            odgovor.send(JSON.stringify(session.jwt));
        } else {
            odgovor.status(401);
            odgovor.send(JSON.stringify({ greska: "Zabranjen pristup!" }));
        }
    });
};

exports.postKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.daj(korime).then((korisnik) => {
        console.log(korisnik);
        console.log(zahtjev.body);
        if (korisnik != null && korisnik.lozinka == zahtjev.body.lozinka) {
            const konf = new Konfiguracija();
            konf.ucitajKonfiguraciju().then(() => {
                const jwtTajniKljuc = konf.dajKonf().jwtTajniKljuc;
                session.jwt = kreirajToken(korisnik, jwtTajniKljuc);
            });
            session.korisnik = korisnik;
            odgovor.status(200);
            odgovor.send(JSON.stringify(korisnik));
        } else {
            odgovor.status(400);
            odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }));
        }
    });
};

exports.postKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" };
    odgovor.send(JSON.stringify(poruka));
};

exports.deleteKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let korime = zahtjev.params.korime;
    let kdao = new KorisnikDAO();
    kdao.obrisi(korime).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
};

exports.putKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let korime = zahtjev.params.korime;
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.azuriraj(korime, podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
};
