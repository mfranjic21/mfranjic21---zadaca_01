const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js");
const Autentifikacija = require("./autentifikacija.js");
const session = require("express-session");

class HtmlUpravitelj {
    constructor(tajniKljucJWT) {
        this.tajniKljucJWT = tajniKljucJWT;
        console.log(this.tajniKljucJWT);
        this.auth = new Autentifikacija();
    }

    pocetna = async function (zahtjev, odgovor) {
        let pocetna = await ucitajStranicu("pocetna");
        odgovor.send(pocetna);
    };

    korisnici = async function (zahtjev, odgovor) {
        if (session.korisnik == null || (session.korisnik != null && session.korisnik.tip_korisnika_id != 1)) {
            let greska = "Neautorizirani pristup";
            odgovor.send(greska);
            return false;
        }
        let korisnici = await ucitajStranicu("korisnici");
        odgovor.send(korisnici);
    };

    detaljiSerije = async function (zahtjev, odgovor) {
        let detaljiSerije = await ucitajStranicu("detalji_serije");
        odgovor.send(detaljiSerije);
    };

    profil = async function (zahtjev, odgovor) {
        if (session.korisnik == null) {
            let greska = "Neautorizirani pristup";
            odgovor.send(greska);
            return false;
        }
        let profil = await ucitajStranicu("profil");
        odgovor.send(profil);
    };

    dokumentacija = async function (zahtjev, odgovor) {
        let dokumentacija = __dirname + "/../dokumentacija";
        let stranice = [ds.readFile(dokumentacija + "/dokumentacija.html", "UTF-8"), ucitajHTML("navigacija")];
        let [stranica, nav] = await Promise.all(stranice);
        stranica = promjeniNavigaciju(stranica, nav);

        odgovor.send(stranica);
    };

    azurirajKorisnika = async function (zahtjev, odgovor) {
        console.log(zahtjev.body);
        let greska = "";
        if (zahtjev.method == "POST") {
            let korisnik = session.korisnik;
            let uspjeh = await this.auth.promijeniPodatke(korisnik, zahtjev.body);
            if (uspjeh) {
                odgovor.redirect("/profil");
                return;
            } else {
                greska = "Promjena podataka nije uspješna!";
            }
        }

        let stranica = await ucitajStranicu("profil", greska);
        odgovor.send(stranica);
    };

    registracija = async function (zahtjev, odgovor) {
        if (session.korisnik == null || (session.korisnik != null && session.korisnik.tip_korisnika_id != 1)) {
            let greska = "Neautorizirani pristup";
            odgovor.send(greska);
            return false;
        }
        console.log(zahtjev.body);
        let greska = "";
        if (zahtjev.method == "POST") {
            let uspjeh = await this.auth.dodajKorisnika(zahtjev.body);
            if (uspjeh) {
                odgovor.redirect("/");
                return;
            } else {
                greska = "Dodavanje nije uspjelo provjerite podatke!";
            }
        }

        let stranica = await ucitajStranicu("registracija", greska);
        odgovor.send(stranica);
    };

    dohvatiSesiju = async function (zahtjev, odgovor) {
        if (session.korisnik == null) {
            return false;
        }
        let profil = session.korisnik;
        odgovor.send(profil);
    };

    odjava = async function (zahtjev, odgovor) {
        session.korisnik = null;
        odgovor.redirect("/");
    };

    prijava = async function (zahtjev, odgovor) {
        let greska = "";
        if (zahtjev.method == "POST") {
            var korime = zahtjev.body.korime;
            var lozinka = zahtjev.body.lozinka;
            var korisnik = await this.auth.prijaviKorisnika(korime, lozinka);
            if (korisnik) {
                odgovor.redirect("/");
                return;
            } else {
                greska = "Prijava nije uspjela!";
            }
        }

        let stranica = await ucitajStranicu("prijava", greska);
        odgovor.send(stranica);
    };

    filmoviPretrazivanje = async function (zahtjev, odgovor) {
        let stranica = await ucitajStranicu("filmovi_pretrazivanje");
        odgovor.send(stranica);
    };
}

module.exports = HtmlUpravitelj;

function promjeniNavigaciju(stranica, nav) {
    if (session.korisnik == null) {
        stranica = stranica.replace("#navigacija#", nav);
        stranica = stranica.replace("#prijava/odjava#", '<a href="/prijava">Prijava</a>');
        return stranica;
    } else {
        stranica = stranica.replace("#navigacija#", nav);
        stranica = stranica.replace("#prijava/odjava#", '<a href="/odjava">Odjava</a>');
        return stranica;
    }
}

async function ucitajStranicu(nazivStranice, poruka = "") {
    let stranice = [ucitajHTML(nazivStranice), ucitajHTML("navigacija")];
    let [stranica, nav] = await Promise.all(stranice);
    stranica = stranica.replace("#poruka#", poruka);
    stranica = promjeniNavigaciju(stranica, nav);
    return stranica;
}

function ucitajHTML(htmlStranica) {
    return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}
