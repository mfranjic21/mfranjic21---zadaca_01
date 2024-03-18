const session = require("express-session");
const Baza = require("./baza.js");

class KorisnikDAO {
    constructor() {
        this.baza = new Baza("./dokumentacija/RWA2023mfranjic21.sqlite");
    }

    dajSve = async function () {
        this.baza.spojiSeNaBazu();
        let sql = "SELECT * FROM korisnik;";
        var podaci = await this.baza.izvrsiUpit(sql, []);
        this.baza.zatvoriVezu();
        return podaci;
    };

    daj = async function (korime) {
        this.baza.spojiSeNaBazu();
        let sql = "SELECT * FROM korisnik WHERE korime=?;";
        var podaci = await this.baza.izvrsiUpit(sql, [korime]);
        this.baza.zatvoriVezu();
        if (podaci.length == 1) return podaci[0];
        else return null;
    };

    postojeciKorisnik = async function (korime) {
        const postojeciKorisnik = await this.daj(korime);

        if (postojeciKorisnik) {
            return true;
        }
    };

    provjeriKorisnika = async function (korisnik) {
        if (!korisnik.korime || !korisnik.email || !korisnik.lozinka || !korisnik.tip_korisnika_id) {
            console.log("Podatci su nepotpuni");
            return true;
        }

        if (await this.postojeciKorisnik(korisnik.korime)) {
            console.log("Korisnik već postoji");
            return true;
        }

        const korimeRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const lozinkaRegex = /^[a-zA-Z0-9]{6,}$/;
        const tipKorisnikaIdRegex = /^\d+$/;

        if (!korimeRegex.test(korisnik.korime)) {
            console.error("Korisničko ime nije ispravno unešeno");
            return true;
        }

        if (!emailRegex.test(korisnik.email)) {
            console.error("Email nije ispravno unešen");
            return true;
        }

        if (!lozinkaRegex.test(korisnik.lozinka)) {
            console.error("Loznika nije ispravno unešena");
            return true;
        }

        if (!tipKorisnikaIdRegex.test(korisnik.tip_korisnika_id)) {
            console.error("Tip korisnika nije ispravno unešen");
            return true;
        }

        return false;
    };

    dodaj = async function (korisnik) {
        console.log(korisnik);

        if (await this.provjeriKorisnika(korisnik)) {
            return false;
        }

        let sql = `INSERT INTO korisnik (korime,email,lozinka,ime,prezime,adresa,mobitel,datum_rođenja,tip_korisnika_id) VALUES (?,?,?,?,?,?,?,?,?)`;

        const imeValue = korisnik.ime || null;
        const prezimeValue = korisnik.prezime || null;
        const adresaValue = korisnik.adresa || null;
        const mobitelValue = korisnik.mobitel || null;
        const datum_rođenjaValue = korisnik.datum_rođenja || null;

        let podaci = [
            korisnik.korime,
            korisnik.email,
            korisnik.lozinka,
            imeValue,
            prezimeValue,
            adresaValue,
            mobitelValue,
            datum_rođenjaValue,
            korisnik.tip_korisnika_id,
        ];

        this.baza.spojiSeNaBazu();
        await this.baza.izvrsiUpit(sql, podaci);
        this.baza.zatvoriVezu();
        return true;
    };

    obrisi = async function (korime) {
        let sql = "DELETE FROM korisnik WHERE korime=?";
        if (await this.postojeciKorisnik(korime)) {
            this.baza.spojiSeNaBazu();
            await this.baza.izvrsiUpit(sql, [korime]);
            this.baza.zatvoriVezu();
            return true;
        } else {
            console.log("Korisnik ne postoji");
            return false;
        }
    };

    azuriraj = async function (korime, korisnik) {
        if (await this.postojeciKorisnik(korime)) {
            let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, adresa=?, mobitel=?, datum_rođenja=?, tip_korisnika_id=? WHERE korime=?`;

            const stariPodaci = await this.daj(korime);
            console.log(stariPodaci);

            const imeValue = korisnik.ime || stariPodaci.ime;
            const prezimeValue = korisnik.prezime || stariPodaci.prezime;
            const lozinkaValue = korisnik.lozinka || stariPodaci.lozinka;
            const adresaValue = korisnik.adresa || stariPodaci.adresa;
            const mobitelValue = korisnik.mobitel || stariPodaci.mobitel;
            const datum_rođenjaValue = korisnik.datum_rođenja || stariPodaci.datum_rođenja;
            const tip_korisnika_idValue = korisnik.tip_korisnika_id || stariPodaci.tip_korisnika_id;

            let podaci = [imeValue, prezimeValue, lozinkaValue, adresaValue, mobitelValue, datum_rođenjaValue, tip_korisnika_idValue, korime];
            this.baza.spojiSeNaBazu();
            await this.baza.izvrsiUpit(sql, podaci);
            this.baza.zatvoriVezu();
            session.korisnik = await this.daj(korime);
            return true;
        } else {
            console.log("Korisnik ne postoji");
            return false;
        }
    };
}

module.exports = KorisnikDAO;
