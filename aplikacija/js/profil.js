window.addEventListener("load", function () {
    fetch("/profilSesija")
        .then((response) => response.json())
        .then((korisnik) => {
            const podaci = document.getElementById("profil_podaci");

            const elementiProfila = document.createElement("div");
            let tip_korisnika = "";

            if (korisnik.tip_korisnika_id == 1) {
                tip_korisnika = "Admin";
            } else {
                tip_korisnika = "Korisnik";
            }
            elementiProfila.innerHTML = `
                ID: ${korisnik.id}<br>
                Korisničko ime: ${korisnik.korime}<br>
                E-mail: ${korisnik.email}<br>
                Ime: ${korisnik.ime}<br>
                Prezime: ${korisnik.prezime}<br>
                Adresa: ${korisnik.adresa}<br>
                Mobitel: ${korisnik.mobitel}<br>
                Datum rođenja: ${korisnik.datum_rođenja}<br>
                Tip korisnika: ${tip_korisnika}<br>
                `;
            podaci.appendChild(elementiProfila);
        })
        .catch((error) => {
            console.error("Pogreška pri dohvatu podataka:", error);
        });
});
