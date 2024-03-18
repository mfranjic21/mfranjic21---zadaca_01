const mail = require("./moduli/mail.js");
const kodovi = require("./moduli/kodovi.js");
const portRest = 12354;
class Autentifikacija {
    async dodajKorisnika(korisnik) {
        let tijelo = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
            email: korisnik.email,
            korime: korisnik.korime,
            adresa: korisnik.adresa,
            mobitel: korisnik.mobitel,
            datum_rođenja: korisnik.datum_rođenja,
            tip_korisnika_id: korisnik.tip_korisnika_id,
        };

        let aktivacijskiKod = kodovi.dajNasumceBroj(10000, 99999);
        tijelo["aktivacijskiKod"] = aktivacijskiKod;

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: "POST",
            body: JSON.stringify(tijelo),
            headers: zaglavlje,
        };
        let odgovor = await fetch("http://spider.foi.hr:" + portRest + "/baza/korisnici", parametri);

        if (odgovor.status == 200) {
            console.log("Korisnik ubačen na servisu");
            let mailPoruka = "Korisničko ime:" + korisnik.korime + "lozinka" + korisnik.lozinka;

            let poruka = await mail.posaljiMail("mfranjic21@student.foi.hr", korisnik.email, "Aktivacijski kod", mailPoruka);
            return true;
        } else {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            return false;
        }
    }

    async promijeniPodatke(korisnik, noviPodaci) {
        const novoIme = noviPodaci.ime || korisnik.ime;
        const novoPrezime = noviPodaci.prezime || korisnik.prezime;
        let novaLozinka = "";
        if (noviPodaci.lozinka != "") {
            novaLozinka = kodovi.kreirajSHA256(noviPodaci.lozinka, "moja sol");
        } else {
            novaLozinka = korisnik.lozinka;
        }
        const novaAdresa = noviPodaci.adresa || korisnik.adresa;
        const noviMobitel = noviPodaci.mobitel || korisnik.mobitel;
        const noviDatum_rodenja = noviPodaci.datum_rođenja || korisnik.datum_rođenja;
        const noviTip_koristenja_id = noviPodaci.tip_korisnika_id || korisnik.tip_korisnika_id;

        let tijelo = {
            ime: novoIme,
            prezime: novoPrezime,
            lozinka: novaLozinka,
            adresa: novaAdresa,
            mobitel: noviMobitel,
            datum_rođenja: noviDatum_rodenja,
            tip_korisnika_id: noviTip_koristenja_id,
        };

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: "PUT",
            body: JSON.stringify(tijelo),
            headers: zaglavlje,
        };
        let odgovor = await fetch("http://spider.foi.hr:" + portRest + `/baza/korisnici/${korisnik.korime}`, parametri);

        if (odgovor.status == 200) {
            console.log("Korisnički podaci promjenjeni");
            return true;
        } else {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            return false;
        }
    }

    async prijaviKorisnika(korime, lozinka) {
        lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
        let tijelo = {
            lozinka: lozinka,
        };
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: "POST",
            body: JSON.stringify(tijelo),
            headers: zaglavlje,
        };
        let odgovor = await fetch("http://spider.foi.hr:" + portRest + "/baza/korisnici/" + korime + "/prijava", parametri);

        if (odgovor.status == 200) {
            return await odgovor.text();
        } else {
            return false;
        }
    }
}

module.exports = Autentifikacija;
