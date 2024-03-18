window.addEventListener("load", function () {
    fetch("/baza/korisnici")
        .then((response) => response.json())
        .then((korisnici) => {
            const lista = document.getElementById("korisnici_lista");

            korisnici.forEach((korisnik) => {
                const elementKorisnik = document.createElement("div");
                elementKorisnik.dataset.korime = korisnik.korime;
                const ime = korisnik.ime || "";
                const prezime = korisnik.prezime || "";
                if (korisnik.tip_korisnika_id != 1) {
                    elementKorisnik.innerHTML = `
          ${korisnik.email} - ${korisnik.korime} - ${ime} ${prezime}
           <button class="gumb_brisanje">Izbriši</button>`;
                } else {
                    elementKorisnik.innerHTML = `${korisnik.email} - ${korisnik.korime} - ${ime} ${prezime}`;
                }
                lista.appendChild(elementKorisnik);
            });

            const gumb_brisanje = document.querySelectorAll(".gumb_brisanje");
            gumb_brisanje.forEach((button) => {
                button.addEventListener("click", function () {
                    const korime = this.parentNode.dataset.korime;
                    izbrisiKorisnika(korime);
                });
            });
        })
        .catch((error) => {
            console.error("Pogreška pri dohvaćanju podataka: ", error);
        });

    async function izbrisiKorisnika(korime) {
        try {
            const odgovor = await fetch(`/baza/korisnici/${korime}`, {
                method: "DELETE",
            });

            if (odgovor.ok) {
                const izbrisaniKorisnik = document.querySelector(`[data-korime="${korime}"]`);
                izbrisaniKorisnik.parentNode.removeChild(izbrisaniKorisnik);

                console.log(`Korisnik ${korime} uspješno izbrisan.`);
            } else {
                console.error(`Korisnik ${korime} nije izbrisan.`);
            }
        } catch (error) {
            console.error("Poruka tokom brisanja podataka:", error);
        }
    }
});
