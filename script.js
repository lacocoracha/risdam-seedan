/* ==========================================
   RISDAM SEEDAN
   GEDEELDE DATA VOOR ALLE PAGINA'S
========================================== */


const competitieNaam = "1e klasse";


const teams = [
    "Risdam Seedan",
    "HVB",
    "VN United",
    "Team 11.20",
    "FC Goodfellas",
    "Fruitjuwelier De Hoef",
    "Smile security",
    "The Goal Diggers",
    "Per seconde grijzer",
    "Family First",
    "Underdogs",
    "Team 1337",
    "Old stars",
    "Griffel United"
];


/* ==========================================
   SPELERS
========================================== */

const spelers = [

    {
        naam: "KiRi",
        doelpunten: null,
        assists: null,
        foto: null
    },

    {
        naam: "C-B",
        doelpunten: null,
        assists: null,
        foto: null
    },

    {
        naam: "Dan San",
        doelpunten: null,
        assists: null,
        foto: null
    },

    {
        naam: "Allie",
        doelpunten: null,
        assists: null,
        foto: null
    },

    {
        naam: "Chocoboy",
        doelpunten: null,
        assists: null,
        foto: null
    },

    {
        naam: "Lukoki",
        doelpunten: null,
        assists: null,
        foto: null
    },

    {
        naam: "Nanvey",
        doelpunten: null,
        assists: null,
        foto: null
    }

];


/* ==========================================
   SPONSORS
========================================== */

const sponsors = [

    {
        naam: "VK Koeriers",
        logo: "sponsoren/vk-koeriers.png",
        website: "https://vkkoeriers.nl/"
    },

    {
        naam: "Hoornse Hoveniers",
        logo: "sponsoren/hoornse-hoveniers.png",
        website: "https://hoornsehoveniers.nl/"
    }

];


/* ==========================================
   NIEUWS

   NIEUWE BERICHTEN HIER TOEVOEGEN
========================================== */

/*
   ZONDER FOTO:

   {
       datum: "01-10-2026",
       categorie: "Clubnieuws",
       titel: "Titel van het nieuwsbericht",
       tekst: "Tekst van het nieuwsbericht.",
       afbeelding: null,
       afbeeldingAlt: null
   }


   MET FOTO:

   Zet de foto bijvoorbeeld in:

   risdam-seedan
   └── nieuws
       └── teamfoto.jpg

   En gebruik:

   {
       datum: "01-10-2026",
       categorie: "Teamnieuws",
       titel: "Titel van het nieuwsbericht",
       tekst: "Tekst van het nieuwsbericht.",
       afbeelding: "nieuws/teamfoto.jpg",
       afbeeldingAlt: "Risdam Seedan teamfoto"
   }
*/


const nieuws = [

    {
        datum: "30-09-2026",
        categorie: "Clubnieuws",

        titel:
            "Nieuwe website Risdam Seedan online",

        tekst:
            "De nieuwe website van Risdam Seedan is in ontwikkeling. Uitslagen, programma, stand, spelers en statistieken zijn inmiddels allemaal op één plek te vinden.",

        afbeelding: null,
        afbeeldingAlt: null
    },

    {
        datum: "28-09-2026",
        categorie: "Wedstrijdverslag",

        titel:
            "Risdam Seedan wint van The Goal Diggers",

        tekst:
            "Risdam Seedan heeft de thuiswedstrijd tegen The Goal Diggers met 7-5 gewonnen en pakt daarmee drie punten.",

        afbeelding: null,
        afbeeldingAlt: null
    }

];


/* ==========================================
   WEDSTRIJDEN

   HIER WEDSTRIJDEN BIJWERKEN
========================================== */


const wedstrijden = [

    /* 31 AUGUSTUS */

    {
        datum: "31-08-2026",
        thuis: "Family First",
        uit: "Risdam Seedan",
        thuisGoals: 3,
        uitGoals: 10,
        gespeeld: true
    },

    {
        datum: "31-08-2026",
        thuis: "Fruitjuwelier De Hoef",
        uit: "Underdogs",
        thuisGoals: 1,
        uitGoals: 2,
        gespeeld: true
    },

    {
        datum: "31-08-2026",
        thuis: "Team 1337",
        uit: "FC Goodfellas",
        thuisGoals: 6,
        uitGoals: 6,
        gespeeld: true
    },

    {
        datum: "31-08-2026",
        thuis: "VN United",
        uit: "Per seconde grijzer",
        thuisGoals: 6,
        uitGoals: 2,
        gespeeld: true
    },

    {
        datum: "31-08-2026",
        thuis: "Smile security",
        uit: "Old stars",
        thuisGoals: 10,
        uitGoals: 3,
        gespeeld: true
    },


    /* 7 SEPTEMBER */

    {
        datum: "07-09-2026",
        thuis: "Griffel United",
        uit: "Underdogs",
        thuisGoals: 2,
        uitGoals: 8,
        gespeeld: true
    },

    {
        datum: "07-09-2026",
        thuis: "Fruitjuwelier De Hoef",
        uit: "Per seconde grijzer",
        thuisGoals: 3,
        uitGoals: 2,
        gespeeld: true
    },

    {
        datum: "07-09-2026",
        thuis: "Family First",
        uit: "The Goal Diggers",
        thuisGoals: 1,
        uitGoals: 5,
        gespeeld: true
    },

    {
        datum: "07-09-2026",
        thuis: "VN United",
        uit: "FC Goodfellas",
        thuisGoals: 14,
        uitGoals: 3,
        gespeeld: true
    },

    {
        datum: "07-09-2026",
        thuis: "Smile security",
        uit: "Risdam Seedan",
        thuisGoals: 9,
        uitGoals: 4,
        gespeeld: true
    },

    {
        datum: "07-09-2026",
        thuis: "Team 11.20",
        uit: "Team 1337",
        thuisGoals: 5,
        uitGoals: 4,
        gespeeld: true
    },

    {
        datum: "07-09-2026",
        thuis: "HVB",
        uit: "Old stars",
        thuisGoals: 4,
        uitGoals: 0,
        gespeeld: true
    },


    /* 14 SEPTEMBER */

    {
        datum: "14-09-2026",
        thuis: "Old stars",
        uit: "Risdam Seedan",
        thuisGoals: 1,
        uitGoals: 9,
        gespeeld: true
    },

    {
        datum: "14-09-2026",
        thuis: "Family First",
        uit: "Team 1337",
        thuisGoals: 4,
        uitGoals: 3,
        gespeeld: true
    },

    {
        datum: "14-09-2026",
        thuis: "HVB",
        uit: "Underdogs",
        thuisGoals: 5,
        uitGoals: 2,
        gespeeld: true
    },

    {
        datum: "14-09-2026",
        thuis: "Smile security",
        uit: "The Goal Diggers",
        thuisGoals: 4,
        uitGoals: 4,
        gespeeld: true
    },

    {
        datum: "14-09-2026",
        thuis: "Griffel United",
        uit: "Per seconde grijzer",
        thuisGoals: 0,
        uitGoals: 3,
        gespeeld: true
    },

    {
        datum: "14-09-2026",
        thuis: "VN United",
        uit: "Team 11.20",
        thuisGoals: 6,
        uitGoals: 9,
        gespeeld: true
    },

    {
        datum: "14-09-2026",
        thuis: "Fruitjuwelier De Hoef",
        uit: "FC Goodfellas",
        thuisGoals: 5,
        uitGoals: 4,
        gespeeld: true
    },


    /* 21 SEPTEMBER */

    {
        datum: "21-09-2026",
        thuis: "Griffel United",
        uit: "FC Goodfellas",
        thuisGoals: 3,
        uitGoals: 9,
        gespeeld: true
    },

    {
        datum: "21-09-2026",
        thuis: "Fruitjuwelier De Hoef",
        uit: "Team 11.20",
        thuisGoals: 6,
        uitGoals: 6,
        gespeeld: true
    },

    {
        datum: "21-09-2026",
        thuis: "Underdogs",
        uit: "Per seconde grijzer",
        thuisGoals: 0,
        uitGoals: 1,
        gespeeld: true
    },

    {
        datum: "21-09-2026",
        thuis: "Family First",
        uit: "VN United",
        thuisGoals: 3,
        uitGoals: 5,
        gespeeld: true
    },

    {
        datum: "21-09-2026",
        thuis: "Old stars",
        uit: "The Goal Diggers",
        thuisGoals: 2,
        uitGoals: 5,
        gespeeld: true
    },

    {
        datum: "21-09-2026",
        tijd: "21:00",
        thuis: "Smile security",
        uit: "Team 1337",
        thuisGoals: null,
        uitGoals: null,
        gespeeld: false
    },

    {
        datum: "21-09-2026",
        thuis: "HVB",
        uit: "Risdam Seedan",
        thuisGoals: 3,
        uitGoals: 2,
        gespeeld: true
    },


    /* 28 SEPTEMBER */

    {
        datum: "28-09-2026",
        thuis: "HVB",
        uit: "Per seconde grijzer",
        thuisGoals: 6,
        uitGoals: 3,
        gespeeld: true
    },

    {
        datum: "28-09-2026",
        thuis: "Fruitjuwelier De Hoef",
        uit: "Family First",
        thuisGoals: 0,
        uitGoals: 9,
        gespeeld: true
    },

    {
        datum: "28-09-2026",
        thuis: "Risdam Seedan",
        uit: "The Goal Diggers",
        thuisGoals: 7,
        uitGoals: 5,
        gespeeld: true
    },

    {
        datum: "28-09-2026",
        thuis: "Old stars",
        uit: "Team 1337",
        thuisGoals: 5,
        uitGoals: 5,
        gespeeld: true
    },

    {
        datum: "28-09-2026",
        thuis: "Smile security",
        uit: "VN United",
        thuisGoals: 5,
        uitGoals: 7,
        gespeeld: true
    },

    {
        datum: "28-09-2026",
        thuis: "Griffel United",
        uit: "Team 11.20",
        thuisGoals: 5,
        uitGoals: 9,
        gespeeld: true
    },

    {
        datum: "28-09-2026",
        thuis: "Underdogs",
        uit: "FC Goodfellas",
        thuisGoals: 3,
        uitGoals: 4,
        gespeeld: true
    },


    /* ======================================
       KOMENDE WEDSTRIJDEN RISDAM SEEDAN
    ====================================== */

    {
        datum: "05-10-2026",
        tijd: "20:30",
        locatie: "De Opgang",

        locatieLink:
            "https://www.google.com/maps/search/?api=1&query=Akkerwinde+43%2C+1689+NT+Zwaag",

        thuis: "Risdam Seedan",
        uit: "Team 1337",

        thuisGoals: null,
        uitGoals: null,

        gespeeld: false
    },

    {
        datum: "19-10-2026",
        tijd: "20:30",
        locatie: "De Opgang",

        locatieLink:
            "https://www.google.com/maps/search/?api=1&query=Akkerwinde+43%2C+1689+NT+Zwaag",

        thuis: "Risdam Seedan",
        uit: "VN United",

        thuisGoals: null,
        uitGoals: null,

        gespeeld: false
    }

];


/* ==========================================
   HULPFUNCTIES
========================================== */

function datumNaarDate(datum) {

    const [dag, maand, jaar] =
        datum.split("-").map(Number);

    return new Date(
        jaar,
        maand - 1,
        dag
    );

}


function mooieDatum(datum) {

    return datumNaarDate(datum)
        .toLocaleDateString(
            "nl-NL",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


function matchdayDatum(datum) {

    return datumNaarDate(datum)
        .toLocaleDateString(
            "nl-NL",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        )
        .toUpperCase();

}


function isRisdamWedstrijd(wedstrijd) {

    return (
        wedstrijd.thuis === "Risdam Seedan" ||
        wedstrijd.uit === "Risdam Seedan"
    );

}


function isVandaagOfLater(wedstrijd) {

    const wedstrijdDatum =
        datumNaarDate(wedstrijd.datum);

    wedstrijdDatum.setHours(
        23,
        59,
        59,
        999
    );

    const nu = new Date();

    return wedstrijdDatum >= nu;

}


function risdamClass(team) {

    return team === "Risdam Seedan"
        ? "risdam-naam"
        : "";

}


/* ==========================================
   COMPETITIENAAM
========================================== */

function toonCompetitieNaam() {

    const programmaCompetitie =
        document.getElementById(
            "programma-competitie"
        );

    const standCompetitie =
        document.getElementById(
            "stand-competitie"
        );


    if (programmaCompetitie) {

        programmaCompetitie.textContent =
            competitieNaam;

    }


    if (standCompetitie) {

        standCompetitie.textContent =
            competitieNaam;

    }

}


/* ==========================================
   MATCHDAY
========================================== */

function toonVolgendeWedstrijd() {

    const container =
        document.getElementById(
            "volgende-wedstrijd"
        );


    if (!container) {
        return;
    }


    const komende =
        wedstrijden

            .filter(
                wedstrijd =>
                    isRisdamWedstrijd(wedstrijd) &&
                    wedstrijd.gespeeld === false &&
                    isVandaagOfLater(wedstrijd)
            )

            .sort(
                (a, b) =>
                    datumNaarDate(a.datum) -
                    datumNaarDate(b.datum)
            );


    if (komende.length === 0) {

        container.innerHTML = `

            <div class="geen-wedstrijd">

                <h3>
                    Nieuw programma volgt
                </h3>

                <p>
                    Er staat momenteel nog geen nieuwe
                    wedstrijd van Risdam Seedan gepland.
                </p>

                <a
                    href="programma.html"
                    class="matchday-knop"
                >
                    Bekijk programma
                    <span>→</span>
                </a>

            </div>

        `;

        return;

    }


    const wedstrijd =
        komende[0];


    const thuisRisdam =
        wedstrijd.thuis ===
        "Risdam Seedan";


    const uitRisdam =
        wedstrijd.uit ===
        "Risdam Seedan";


    container.innerHTML = `

        <div class="matchday-inhoud">

            <img
                src="logo.png"
                alt=""
                class="matchday-achtergrond-logo"
                aria-hidden="true"
            >


            <div class="matchday-meta">

                <span class="matchday-datum">

                    ${matchdayDatum(
                        wedstrijd.datum
                    )}

                </span>


                <span class="matchday-tijd">

                    ${
                        wedstrijd.tijd
                            ? wedstrijd.tijd
                            : "Tijd volgt"
                    }

                </span>

            </div>


            <div class="matchday-teams">


                <div class="matchday-team">

                    <span class="matchday-rol">
                        Thuis
                    </span>

                    <strong
                        class="${
                            thuisRisdam
                                ? "risdam-team"
                                : ""
                        }"
                    >

                        ${wedstrijd.thuis}

                    </strong>

                </div>


                <div class="matchday-vs">

                    <span>
                        VS
                    </span>

                </div>


                <div class="matchday-team">

                    <span class="matchday-rol">
                        Uit
                    </span>

                    <strong
                        class="${
                            uitRisdam
                                ? "risdam-team"
                                : ""
                        }"
                    >

                        ${wedstrijd.uit}

                    </strong>

                </div>

            </div>


            <div class="matchday-footer">

                <div class="matchday-footer-info">


                    <div class="matchday-info-item">

                        <span>
                            COMPETITIE
                        </span>

                        <strong>
                            ${competitieNaam}
                        </strong>

                    </div>


                    <div class="matchday-info-item">

                        <span>
                            LOCATIE
                        </span>

                        ${
                            wedstrijd.locatieLink

                                ? `

                                    <a
                                        href="${wedstrijd.locatieLink}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="matchday-locatie-link"
                                        title="Open ${wedstrijd.locatie} in Google Maps"
                                    >
                                        ${wedstrijd.locatie} ↗
                                    </a>

                                `

                                : `

                                    <strong>

                                        ${
                                            wedstrijd.locatie
                                                ? wedstrijd.locatie
                                                : "Locatie volgt"
                                        }

                                    </strong>

                                `
                        }

                    </div>

                </div>


                <a
                    href="programma.html"
                    class="matchday-knop"
                >

                    Bekijk programma

                    <span>
                        →
                    </span>

                </a>

            </div>

        </div>

    `;

}


/* ==========================================
   NIEUWS
========================================== */

function maakNieuwsHtml(berichten) {

    return berichten

        .map(
            bericht => {


                const afbeeldingHtml =
                    bericht.afbeelding

                        ? `

                            <div class="nieuws-afbeelding">

                                <img
                                    src="${bericht.afbeelding}"
                                    alt="${
                                        bericht.afbeeldingAlt
                                            ? bericht.afbeeldingAlt
                                            : bericht.titel
                                    }"
                                    loading="lazy"
                                >

                            </div>

                        `

                        : "";


                return `

                    <article class="nieuws-kaart">


                        <div class="nieuws-header">

                            <div class="nieuws-logo-vak">

                                <img
                                    src="logo.png"
                                    alt=""
                                    class="nieuws-logo"
                                    aria-hidden="true"
                                >

                            </div>


                            <div class="nieuws-header-inhoud">

                                <div class="nieuws-meta">

                                    <span class="nieuws-categorie">

                                        ${
                                            bericht.categorie
                                                ? bericht.categorie
                                                : "Nieuws"
                                        }

                                    </span>


                                    <span class="nieuws-datum">

                                        ${mooieDatum(
                                            bericht.datum
                                        )}

                                    </span>

                                </div>


                                <h3 class="nieuws-titel">

                                    ${bericht.titel}

                                </h3>

                            </div>

                        </div>


                        ${afbeeldingHtml}


                        <div class="nieuws-inhoud">

                            <p>
                                ${bericht.tekst}
                            </p>

                        </div>


                    </article>

                `;

            }
        )

        .join("");

}


/* ==========================================
   NIEUWS TONEN
========================================== */

function toonNieuws() {

    const gesorteerd =
        [...nieuws]

            .sort(
                (a, b) =>
                    datumNaarDate(b.datum) -
                    datumNaarDate(a.datum)
            );


    const nieuwsContainer =
        document.getElementById(
            "nieuws-lijst"
        );


    if (nieuwsContainer) {

        nieuwsContainer.innerHTML =
            maakNieuwsHtml(
                gesorteerd
            );

    }


    const homeContainer =
        document.getElementById(
            "home-nieuws"
        );


    if (homeContainer) {

        const laatsteTwee =
            gesorteerd.slice(0, 2);


        homeContainer.innerHTML =
            maakNieuwsHtml(
                laatsteTwee
            );

    }

}


/* ==========================================
   HOME SPONSORS
========================================== */

function toonHomeSponsors() {

    const container =
        document.getElementById(
            "home-sponsors"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        sponsors

            .map(
                sponsor => `

                    <a
                        href="${sponsor.website}"
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        class="home-sponsor-link"
                        aria-label="Bezoek de website van ${sponsor.naam}"
                    >

                        <img
                            src="${sponsor.logo}"
                            alt="${sponsor.naam}"
                            class="home-sponsor-logo"
                            loading="lazy"
                        >

                    </a>

                `
            )

            .join("");

}


/* ==========================================
   UITSLAGEN RISDAM
========================================== */

function toonUitslagen() {

    const container =
        document.getElementById(
            "uitslagen-lijst"
        );


    if (!container) {
        return;
    }


    const gespeeld =
        wedstrijden

            .filter(
                wedstrijd =>
                    isRisdamWedstrijd(wedstrijd) &&
                    wedstrijd.gespeeld
            )

            .sort(
                (a, b) =>
                    datumNaarDate(b.datum) -
                    datumNaarDate(a.datum)
            );


    container.innerHTML =
        gespeeld

            .map(
                wedstrijd => `

                    <div class="wedstrijd">

                        <div class="wedstrijd-datum">

                            ${mooieDatum(
                                wedstrijd.datum
                            )}

                        </div>


                        <div class="wedstrijd-teams">

                            <span
                                class="${risdamClass(
                                    wedstrijd.thuis
                                )}"
                            >

                                ${wedstrijd.thuis}

                            </span>


                            <strong>

                                ${wedstrijd.thuisGoals}
                                -
                                ${wedstrijd.uitGoals}

                            </strong>


                            <span
                                class="${risdamClass(
                                    wedstrijd.uit
                                )}"
                            >

                                ${wedstrijd.uit}

                            </span>

                        </div>

                    </div>

                `
            )

            .join("");

}


/* ==========================================
   PROGRAMMA RISDAM
========================================== */

function toonProgramma() {

    const container =
        document.getElementById(
            "programma-lijst"
        );


    if (!container) {
        return;
    }


    const komend =
        wedstrijden

            .filter(
                wedstrijd =>
                    isRisdamWedstrijd(wedstrijd) &&
                    wedstrijd.gespeeld === false &&
                    isVandaagOfLater(wedstrijd)
            )

            .sort(
                (a, b) =>
                    datumNaarDate(a.datum) -
                    datumNaarDate(b.datum)
            );


    if (komend.length === 0) {

        container.innerHTML =
            "<p>Er staan momenteel geen wedstrijden gepland.</p>";

        return;

    }


    container.innerHTML =
        komend

            .map(
                wedstrijd => `

                    <div class="wedstrijd">

                        <div class="wedstrijd-datum">

                            ${mooieDatum(
                                wedstrijd.datum
                            )}

                            ${
                                wedstrijd.tijd
                                    ? " • " +
                                      wedstrijd.tijd
                                    : ""
                            }

                        </div>


                        <div class="wedstrijd-teams">

                            <span
                                class="${risdamClass(
                                    wedstrijd.thuis
                                )}"
                            >

                                ${wedstrijd.thuis}

                            </span>


                            <strong>
                                VS
                            </strong>


                            <span
                                class="${risdamClass(
                                    wedstrijd.uit
                                )}"
                            >

                                ${wedstrijd.uit}

                            </span>

                        </div>


                        ${
                            wedstrijd.locatie

                                ? `

                                    <div class="wedstrijd-locatie">

                                        ${wedstrijd.locatie}

                                    </div>

                                `

                                : ""
                        }

                    </div>

                `
            )

            .join("");

}


/* ==========================================
   ALLE COMPETITIE-UITSLAGEN
========================================== */

function toonAlleUitslagen() {

    const container =
        document.getElementById(
            "alle-uitslagen-lijst"
        );


    if (!container) {
        return;
    }


    const gespeeld =
        wedstrijden

            .filter(
                wedstrijd =>
                    wedstrijd.gespeeld
            )

            .sort(
                (a, b) =>
                    datumNaarDate(b.datum) -
                    datumNaarDate(a.datum)
            );


    const perDatum = {};


    gespeeld.forEach(
        wedstrijd => {

            if (
                !perDatum[
                    wedstrijd.datum
                ]
            ) {

                perDatum[
                    wedstrijd.datum
                ] = [];

            }


            perDatum[
                wedstrijd.datum
            ].push(
                wedstrijd
            );

        }
    );


    let html = "";


    Object.entries(
        perDatum
    ).forEach(

        ([datum, wedstrijdenVanDag]) => {


            html += `

                <div class="speelronde">

                    <div class="speelronde-titel">

                        ${mooieDatum(datum)}

                    </div>

            `;


            wedstrijdenVanDag
                .forEach(
                    wedstrijd => {


                        const risdam =
                            isRisdamWedstrijd(
                                wedstrijd
                            );


                        html += `

                            <div class="
                                competitie-wedstrijd
                                ${
                                    risdam
                                        ? "risdam-wedstrijd"
                                        : ""
                                }
                            ">

                                <span class="thuisteam">

                                    ${wedstrijd.thuis}

                                </span>


                                <span class="competitie-score">

                                    ${wedstrijd.thuisGoals}-${wedstrijd.uitGoals}

                                </span>


                                <span class="uitteam">

                                    ${wedstrijd.uit}

                                </span>

                            </div>

                        `;

                    }
                );


            html += `
                </div>
            `;

        }

    );


    container.innerHTML = html;

}


/* ==========================================
   SEIZOENSTATISTIEKEN RISDAM
========================================== */

function toonSeizoenStatistieken() {

    const container =
        document.getElementById(
            "statistieken"
        );


    if (!container) {
        return;
    }


    let gespeeld = 0;
    let gewonnen = 0;
    let gelijk = 0;
    let verloren = 0;
    let goalsVoor = 0;
    let goalsTegen = 0;


    wedstrijden.forEach(
        wedstrijd => {


            if (
                !wedstrijd.gespeeld ||
                !isRisdamWedstrijd(
                    wedstrijd
                )
            ) {

                return;

            }


            gespeeld++;


            let risdamGoals;
            let tegenGoals;


            if (
                wedstrijd.thuis ===
                "Risdam Seedan"
            ) {

                risdamGoals =
                    wedstrijd.thuisGoals;

                tegenGoals =
                    wedstrijd.uitGoals;

            } else {

                risdamGoals =
                    wedstrijd.uitGoals;

                tegenGoals =
                    wedstrijd.thuisGoals;

            }


            goalsVoor += risdamGoals;
            goalsTegen += tegenGoals;


            if (
                risdamGoals >
                tegenGoals
            ) {

                gewonnen++;

            } else if (
                risdamGoals ===
                tegenGoals
            ) {

                gelijk++;

            } else {

                verloren++;

            }

        }
    );


    const punten =
        gewonnen * 3 +
        gelijk;


    const doelsaldo =
        goalsVoor -
        goalsTegen;


    container.innerHTML = `

        <div class="stat-box">
            <strong>${gespeeld}</strong>
            <span>Gespeeld</span>
        </div>

        <div class="stat-box">
            <strong>${gewonnen}</strong>
            <span>Gewonnen</span>
        </div>

        <div class="stat-box">
            <strong>${gelijk}</strong>
            <span>Gelijk</span>
        </div>

        <div class="stat-box">
            <strong>${verloren}</strong>
            <span>Verloren</span>
        </div>

        <div class="stat-box">
            <strong>${punten}</strong>
            <span>Punten</span>
        </div>

        <div class="stat-box">
            <strong>${goalsVoor}-${goalsTegen}</strong>
            <span>Goals</span>
        </div>

        <div class="stat-box">

            <strong>

                ${
                    doelsaldo > 0
                        ? "+"
                        : ""
                }

                ${doelsaldo}

            </strong>

            <span>
                Doelsaldo
            </span>

        </div>

    `;

}


/* ==========================================
   COMPETITIESTAND
========================================== */

function berekenStand() {

    const container =
        document.getElementById(
            "competitie-stand"
        );


    if (!container) {
        return;
    }


    const stand = {};


    teams.forEach(
        team => {

            stand[team] = {

                team: team,
                gespeeld: 0,
                gewonnen: 0,
                gelijk: 0,
                verloren: 0,
                voor: 0,
                tegen: 0,
                doelsaldo: 0,
                punten: 0

            };

        }
    );


    wedstrijden.forEach(
        wedstrijd => {


            if (
                !wedstrijd.gespeeld
            ) {

                return;

            }


            const thuis =
                stand[
                    wedstrijd.thuis
                ];


            const uit =
                stand[
                    wedstrijd.uit
                ];


            if (
                !thuis ||
                !uit
            ) {

                return;

            }


            thuis.gespeeld++;
            uit.gespeeld++;


            thuis.voor +=
                wedstrijd.thuisGoals;

            thuis.tegen +=
                wedstrijd.uitGoals;


            uit.voor +=
                wedstrijd.uitGoals;

            uit.tegen +=
                wedstrijd.thuisGoals;


            if (
                wedstrijd.thuisGoals >
                wedstrijd.uitGoals
            ) {

                thuis.gewonnen++;

                thuis.punten += 3;

                uit.verloren++;

            } else if (
                wedstrijd.thuisGoals <
                wedstrijd.uitGoals
            ) {

                uit.gewonnen++;

                uit.punten += 3;

                thuis.verloren++;

            } else {

                thuis.gelijk++;

                uit.gelijk++;

                thuis.punten++;

                uit.punten++;

            }

        }
    );


    const standArray =
        Object.values(
            stand
        );


    standArray.forEach(
        team => {

            team.doelsaldo =
                team.voor -
                team.tegen;

        }
    );


    standArray.sort(
        (a, b) => {

            if (
                b.punten !==
                a.punten
            ) {

                return (
                    b.punten -
                    a.punten
                );

            }


            if (
                b.doelsaldo !==
                a.doelsaldo
            ) {

                return (
                    b.doelsaldo -
                    a.doelsaldo
                );

            }


            if (
                b.voor !==
                a.voor
            ) {

                return (
                    b.voor -
                    a.voor
                );

            }


            return (
                a.team.localeCompare(
                    b.team
                )
            );

        }
    );


    toonStand(
        standArray,
        container
    );

}


function toonStand(
    stand,
    container
) {

    let html = `

        <div class="stand-wrapper">

            <table class="stand-tabel">

                <thead>

                    <tr>

                        <th>#</th>
                        <th>Team</th>
                        <th>G</th>
                        <th>W</th>
                        <th>GL</th>
                        <th>V</th>
                        <th>DV</th>
                        <th>DT</th>
                        <th>DS</th>
                        <th>P</th>

                    </tr>

                </thead>


                <tbody>

    `;


    stand.forEach(
        (team, index) => {


            html += `

                <tr
                    class="${
                        team.team ===
                        "Risdam Seedan"
                            ? "risdam-rij"
                            : ""
                    }"
                >

                    <td>
                        ${index + 1}
                    </td>


                    <td class="teamnaam">
                        ${team.team}
                    </td>


                    <td>
                        ${team.gespeeld}
                    </td>


                    <td>
                        ${team.gewonnen}
                    </td>


                    <td>
                        ${team.gelijk}
                    </td>


                    <td>
                        ${team.verloren}
                    </td>


                    <td>
                        ${team.voor}
                    </td>


                    <td>
                        ${team.tegen}
                    </td>


                    <td>

                        ${
                            team.doelsaldo > 0
                                ? "+"
                                : ""
                        }

                        ${team.doelsaldo}

                    </td>


                    <td>
                        ${team.punten}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    container.innerHTML =
        html;

}


/* ==========================================
   TEAM
========================================== */

function toonSpelers() {

    const container =
        document.getElementById(
            "spelers-lijst"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        spelers

            .map(
                speler => {


                    const initialen =
                        speler.naam

                            .split(
                                /[\s-]+/
                            )

                            .map(
                                deel =>
                                    deel.charAt(0)
                            )

                            .join("")

                            .substring(
                                0,
                                2
                            )

                            .toUpperCase();


                    const afbeelding =
                        speler.foto

                            ? `

                                <img
                                    src="${speler.foto}"
                                    alt="${speler.naam}"
                                >

                            `

                            : `

                                <div class="speler-placeholder">

                                    ${initialen}

                                </div>

                            `;


                    return `

                        <article class="speler-kaart">

                            <div class="speler-foto">

                                ${afbeelding}

                            </div>


                            <div class="speler-info">

                                <h3 class="speler-naam">

                                    ${speler.naam}

                                </h3>


                                <div class="speler-stats">

                                    <div class="speler-stat">

                                        <strong>

                                            ${
                                                speler.doelpunten === null
                                                    ? "–"
                                                    : speler.doelpunten
                                            }

                                        </strong>

                                        <span>
                                            Doelpunten
                                        </span>

                                    </div>


                                    <div class="speler-stat">

                                        <strong>

                                            ${
                                                speler.assists === null
                                                    ? "–"
                                                    : speler.assists
                                            }

                                        </strong>

                                        <span>
                                            Assists
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </article>

                    `;

                }
            )

            .join("");

}


/* ==========================================
   TOPSCORERS EN ASSISTS
========================================== */

function toonTopscorers() {

    const doelpuntenContainer =
        document.getElementById(
            "topscorers-lijst"
        );


    const assistsContainer =
        document.getElementById(
            "assists-lijst"
        );


    if (
        !doelpuntenContainer ||
        !assistsContainer
    ) {

        return;

    }


    const topscorers =
        spelers

            .filter(
                speler =>
                    speler.doelpunten !==
                    null
            )

            .sort(
                (a, b) =>
                    b.doelpunten -
                    a.doelpunten
            );


    const assistLijst =
        spelers

            .filter(
                speler =>
                    speler.assists !==
                    null
            )

            .sort(
                (a, b) =>
                    b.assists -
                    a.assists
            );


    if (
        topscorers.length === 0
    ) {

        doelpuntenContainer.innerHTML =
            "<p>Nog geen doelpuntenstatistieken ingevuld.</p>";

    } else {

        doelpuntenContainer.innerHTML =
            topscorers

                .map(
                    (speler, index) => `

                        <div class="ranking-rij">

                            <div class="ranking-positie">
                                ${index + 1}
                            </div>

                            <div class="ranking-naam">
                                ${speler.naam}
                            </div>

                            <div class="ranking-aantal">
                                ${speler.doelpunten}
                            </div>

                        </div>

                    `
                )

                .join("");

    }


    if (
        assistLijst.length === 0
    ) {

        assistsContainer.innerHTML =
            "<p>Nog geen assiststatistieken ingevuld.</p>";

    } else {

        assistsContainer.innerHTML =
            assistLijst

                .map(
                    (speler, index) => `

                        <div class="ranking-rij">

                            <div class="ranking-positie">
                                ${index + 1}
                            </div>

                            <div class="ranking-naam">
                                ${speler.naam}
                            </div>

                            <div class="ranking-aantal">
                                ${speler.assists}
                            </div>

                        </div>

                    `
                )

                .join("");

    }

}


/* ==========================================
   SPONSORS
========================================== */

function toonSponsors() {

    const container =
        document.getElementById(
            "sponsors-lijst"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        sponsors

            .map(
                sponsor => `

                    <article class="sponsor-kaart">

                        <div class="sponsor-logo-vak">

                            <img
                                src="${sponsor.logo}"
                                alt="${sponsor.naam}"
                                class="sponsor-logo"
                            >

                        </div>


                        <div class="sponsor-info">

                            <h3 class="sponsor-naam">

                                ${sponsor.naam}

                            </h3>


                            <a
                                href="${sponsor.website}"
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                class="sponsor-link"
                            >

                                Bezoek website

                            </a>

                        </div>

                    </article>

                `
            )

            .join("");

}


/* ==========================================
   WEBSITE STARTEN
========================================== */

toonCompetitieNaam();

toonVolgendeWedstrijd();

toonNieuws();

toonHomeSponsors();

toonUitslagen();

toonProgramma();

toonAlleUitslagen();

toonSeizoenStatistieken();

berekenStand();

toonSpelers();

toonTopscorers();

toonSponsors();