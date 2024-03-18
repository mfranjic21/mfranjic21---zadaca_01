let url = "http://spider.foi.hr:12354";
let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
    poruka = document.getElementById("poruka");
    const urlPodaci = new URLSearchParams(window.location.search);
    const ID = urlPodaci.get("id");

    prikaziFilm(ID);
});

function prikaziFilm(ID) {
    let filmovi = JSON.parse(sessionStorage.dohvaceniFilmovi);

    let f = filmovi.find((film) => film.id == ID);

    let glavna = document.getElementById("sadrzaj");
    let tablica = "<table border=1>";

    tablica += "<tr><th>Jezik</th><th>Naslov original</th><th>Naslov</th><th>Opis</th><th>Poster</th><th>Datum</th></tr>";
    tablica += "<tr>";

    tablica += "<td>" + f.original_language + "</td>";
    tablica += "<td>" + f.title + "</td>";
    tablica += "<td>" + f.original_title + "</td>";
    tablica += "<td>" + f.overview + "</td>";
    tablica += "<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + f.poster_path + "' width='100' alt='slika_" + f.title + "'/></td>";
    tablica += "<td>" + f.release_date + "</td>";

    tablica += "</tr>";
    tablica += "</table>";

    tablica += "<button onClick='dodajUbazu(" + f.id + ")'>Dodaj u bazu</button>";

    sessionStorage.detaljiSerije = JSON.stringify(f);

    glavna.innerHTML = tablica;
}

async function dodajUbazu(idFilma) {
    let filmovi = JSON.parse(sessionStorage.dohvaceniFilmovi);
    for (let film of filmovi) {
        if (idFilma == film.id) {
            let parametri = { method: "POST", body: JSON.stringify(film) };
            let odgovor = await fetch("/dodajFilm", parametri);
            if (odgovor.status == 200) {
                let podaci = await odgovor.text();
                console.log(podaci);
                poruka.innerHTML = "Film dodan u bazu!";
            } else if (odgovor.status == 401) {
                poruka.innerHTML = "Neautorizirani pristup! Prijavite se!";
            } else {
                poruka.innerHTML = "Greška u dodavanju filmva!";
            }
            break;
        }
    }
}
