import express from "express";
import sesija from "express-session";
import kolacici from "cookie-parser";
import Konfiguracija from "./konfiguracija.js";
import portovi from "/var/www/RWA/2023/portovi.js";
import restKorisnik from "./servis/restKorisnik.js";
import RestTMDB from "./servis/restTMDB.js";
import HtmlUpravitelj from "./aplikacija/htmlUpravitelj.js";
import FetchUpravitelj from "./aplikacija/fetchUpravitelj.js";

const port = portovi.mfranjic21;
const server = express();

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju()
    .then(pokreniServer)
    .catch((greska) => {
        console.log(greska);
        if (process.argv.length == 2) {
            console.error("Niste naveli naziv konfiguracijske datoteke!");
        } else {
            console.error("Datoteka ne postoji: " + greska.path);
        }
    });

function pokreniServer() {
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());

    server.use(kolacici());
    server.use(
        sesija({
            secret: konf.dajKonf().tajniKljucSesija,
            saveUninitialized: true,
            cookie: { maxAge: 1000 * 60 * 60 * 3 },
            resave: false,
        })
    );

    server.use("/js", express.static("./aplikacija/js"));
    pripremiPutanjeKorisnik();
    pripremiPutanjeTMDB();
    pripremiPutanjePocetna();
    pripremiPutanjeAutentifikacija();
    pripremiPutanjeDokumentacija();
    pripremiPutanjeKorisnici();
    pripremiPutanjeProfil();
    pripremiPutanjeDetaljiSerije();

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        odgovor.json({ opis: "nema resursa" });
    });
    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function pripremiPutanjeKorisnik() {
    server.get("/baza/korisnici", restKorisnik.getKorisnici);
    server.post("/baza/korisnici", restKorisnik.postKorisnici);
    server.delete("/baza/korisnici", restKorisnik.deleteKorisnici);
    server.put("/baza/korisnici", restKorisnik.putKorisnici);

    server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik);
    server.post("/baza/korisnici/:korime", restKorisnik.postKorisnik);
    server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik);
    server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik);

    server.get("/baza/korisnici/:korime/prijava", restKorisnik.getKorisnikPrijava);
    server.post("/baza/korisnici/:korime/prijava", restKorisnik.postKorisnikPrijava);
}

function pripremiPutanjeTMDB() {
    let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
    server.get("/api/tmdb/zanr", restTMDB.getZanr.bind(restTMDB));
    server.get("/api/tmdb/filmovi", restTMDB.getFilmovi.bind(restTMDB));
}

function pripremiPutanjePocetna() {
    let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
    let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
    server.get("/filmoviPretrazivanje", htmlUpravitelj.filmoviPretrazivanje.bind(htmlUpravitelj));
    server.post("/filmoviPretrazivanje", fetchUpravitelj.filmoviPretrazivanje.bind(fetchUpravitelj));
    server.post("/dodajFilm", fetchUpravitelj.dodajFilm.bind(fetchUpravitelj));
    server.get("/", htmlUpravitelj.pocetna.bind(htmlUpravitelj));
    server.use(express.static("dokumentacija"));
}

function pripremiPutanjeDetaljiSerije() {
    let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
    server.get("/SerijaDetalji", htmlUpravitelj.detaljiSerije.bind(htmlUpravitelj));
}

function pripremiPutanjeDokumentacija() {
    let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
    server.get("/dokumentacija", htmlUpravitelj.dokumentacija.bind(htmlUpravitelj));
}

function pripremiPutanjeKorisnici() {
    let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
    server.get("/korisnici", htmlUpravitelj.korisnici.bind(htmlUpravitelj));
}

function pripremiPutanjeProfil() {
    let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
    server.get("/profil", htmlUpravitelj.profil.bind(htmlUpravitelj));
    server.get("/profilSesija", htmlUpravitelj.dohvatiSesiju.bind(htmlUpravitelj));
    server.get("/azurirajKorisnika", htmlUpravitelj.azurirajKorisnika.bind(htmlUpravitelj));
    server.post("/azurirajKorisnika", htmlUpravitelj.azurirajKorisnika.bind(htmlUpravitelj));
}

function pripremiPutanjeAutentifikacija() {
    let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
    let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
    server.get("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
    server.post("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
    server.get("/odjava", htmlUpravitelj.odjava.bind(htmlUpravitelj));
    server.get("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
    server.post("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));

    server.get("/getJWT", fetchUpravitelj.getJWT.bind(fetchUpravitelj));
}
