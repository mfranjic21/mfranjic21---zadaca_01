-- Creator:       MySQL Workbench 8.0.34/ExportSQLite Plugin 0.1.0
-- Author:        Matej Franjić
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2023-11-06 14:53
-- Created:       2023-10-18 13:49

-- Schema: mydb
BEGIN;
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" VARCHAR(45)
);
CREATE TABLE "serija"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(50) NOT NULL,
  "opis" VARCHAR(150) NOT NULL,
  "broj_sezona" INTEGER NOT NULL,
  "broj_epizoda" INTEGER,
  "popularnost" FLOAT,
  "poveznica" VARCHAR(150),
  "slika" VARCHAR(150) NOT NULL,
  "tmdb_id" INTEGER NOT NULL
);
CREATE TABLE "sezona"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "slika" VARCHAR(150),
  "broj_epizoda" INTEGER NOT NULL,
  "opis_sezone" VARCHAR(45),
  "serija_id" INTEGER NOT NULL,
  "tmdb_id_sezone" INTEGER NOT NULL,
  CONSTRAINT "fk_sezona_serija1"
    FOREIGN KEY("serija_id")
    REFERENCES "serija"("id")
);
CREATE INDEX "sezona.fk_sezona_serija1_idx" ON "sezona" ("serija_id");
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "korime" VARCHAR(45) NOT NULL,
  "email" VARCHAR(45) NOT NULL,
  "lozinka" VARCHAR(45) NOT NULL,
  "ime" VARCHAR(45),
  "prezime" VARCHAR(45),
  "adresa" VARCHAR(60),
  "mobitel" VARCHAR(45),
  "datum_rođenja" DATE,
  "tip_korisnika_id" INTEGER NOT NULL,
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "fk_korisnik_tip_korisnika"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnika_idx" ON "korisnik" ("tip_korisnika_id");
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "datum" DATE NOT NULL,
  "vrijeme" TIME NOT NULL,
  "vrsta_zahtjeva" VARCHAR(10) NOT NULL,
  "traženi_resurs" VARCHAR(100) NOT NULL,
  "tijelo" VARCHAR(45) DEFAULT NULL,
  "korisnik_id" INTEGER NOT NULL,
  CONSTRAINT "fk_dnevnicki_zapis_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "dnevnik.fk_dnevnicki_zapis_korisnik1_idx" ON "dnevnik" ("korisnik_id");
CREATE TABLE "favorit"(
  "serija_id" INTEGER NOT NULL,
  "korisnik_id" INTEGER NOT NULL,
  PRIMARY KEY("serija_id","korisnik_id"),
  CONSTRAINT "fk_serija_has_korisnik_serija1"
    FOREIGN KEY("serija_id")
    REFERENCES "serija"("id"),
  CONSTRAINT "fk_serija_has_korisnik_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "favorit.fk_serija_has_korisnik_korisnik1_idx" ON "favorit" ("korisnik_id");
CREATE INDEX "favorit.fk_serija_has_korisnik_serija1_idx" ON "favorit" ("serija_id");
COMMIT;

INSERT INTO tip_korisnika(naziv, opis) VALUES('admin', 'administrator');
INSERT INTO tip_korisnika(naziv,opis) VALUES('moderator','moderator');
INSERT INTO korisnik(korime,lozinka,email,tip_korisnika_id) VALUES('mfranjic21','123456','mfranjic21@foi.hr',1);

INSERT INTO tip_korisnika(naziv,opis) VALUES('registrirani_korisnik','registrirani korisnik');

INSERT INTO korisnik(korime,lozinka,email,tip_korisnika_id) VALUES('obican','rwa','obican@foi.hr',3);
INSERT INTO korisnik(korime,lozinka,email,tip_korisnika_id) VALUES('admin','rwa','admin@foi.hr',1);

