let url = "http://spider.foi.hr:12354";
let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
    poruka = document.getElementById("poruka");
    document.getElementById("filter").addEventListener("keyup", (event) => {
        var duljina = document.getElementById("filter").value.length;
        if (duljina >= 3) {
            dajFilmove(1);
        }
    });
});

async function dajFilmove(str) {
    let parametri = { method: "POST" };
    let odgovor = await fetch("/filmoviPretrazivanje?str=" + str + "&filter=" + dajFilter(), parametri);
    if (odgovor.status == 200) {
        let podaci = await odgovor.text();
        podaci = JSON.parse(podaci);
        prikaziFilmove(podaci.results);
        prikaziStranicenje(podaci.page, podaci.total_pages, "dajFilmove");
    } else if (odgovor.status == 401) {
        document.getElementById("sadrzaj").innerHTML = "";
        poruka.innerHTML = "Neautorizirani pristup! Prijavite se!";
    } else {
        poruka.innerHTML = "Greška u dohvatu filmova!";
    }
}

function prikaziStranicenje(str, ukupno, funkcijaZaDohvat) {
    let prikaz = document.getElementById("stranicenje");
    html = "";
    str = parseInt(str);
    if (str > 1) {
        html = '<button onClick="' + funkcijaZaDohvat + '(1)"><<</button>';
        html += '<button onClick="' + funkcijaZaDohvat + "(" + (str - 1) + ')"><</button>';
    }
    html += '<button onClick="' + funkcijaZaDohvat + "(" + str + ')">' + str + "/" + ukupno + "</button>";
    if (str < ukupno) {
        html += '<button onClick="' + funkcijaZaDohvat + "(" + (str + 1) + ')">></button>';
        html += '<button onClick="' + funkcijaZaDohvat + "(" + ukupno + ')">>></button>';
    }
    prikaz.innerHTML = html;
}

function prikaziFilmove(filmovi) {
    let glavna = document.getElementById("sadrzaj");
    let tablica = "<table border=1>";
    tablica += "<tr><th>Naslov</th><th>Opis</th><th>Poster</th></tr>";
    for (let f of filmovi) {
        tablica += "<tr>";
        tablica += "<td>" + f.title + "</td>";
        tablica += "<td>" + f.overview + "</td>";
        tablica += "<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + f.poster_path + "' width='100' alt='slika_" + f.title + "'/></td>";
        tablica += "<td><button onClick='detaljiSerije(" + f.id + ")'>Detalji serije</button></td>";
        tablica += "</tr>";
    }
    tablica += "</table>";

    sessionStorage.dohvaceniFilmovi = JSON.stringify(filmovi);

    glavna.innerHTML = tablica;
}

function dajFilter() {
    return document.getElementById("filter").value;
}

function detaljiSerije(id) {
    window.location.href = "/SerijaDetalji?id=" + id;
}
