/* ==========================================
   RISDAM SEEDAN - WEBSITELOGICA

   Data staat voortaan in /data/*.json.
   Dit bestand bevat alleen:
   - data laden
   - data controleren
   - berekeningen
   - HTML tonen
========================================== */


const DATA_PADDEN = {
    site: "data/site.json",
    wedstrijden: "data/wedstrijden.json",
    nieuws: "data/nieuws.json",
    spelers: "data/spelers.json",
    sponsors: "data/sponsors.json"
};


const state = {
    site: null,
    teams: [],
    wedstrijden: [],
    nieuws: [],
    spelers: [],
    sponsors: []
};


/* ==========================================
   DATA LADEN
========================================== */

async function laadJson(pad) {

    const response = await fetch(
        pad,
        {
            cache: "no-store"
        }
    );


    if (!response.ok) {

        throw new Error(
            `Kon ${pad} niet laden (${response.status}).`
        );

    }


    return response.json();

}


async function laadData() {

    const [
        site,
        wedstrijden,
        nieuws,
        spelers,
        sponsors
    ] = await Promise.all([

        laadJson(
            DATA_PADDEN.site
        ),

        laadJson(
            DATA_PADDEN.wedstrijden
        ),

        laadJson(
            DATA_PADDEN.nieuws
        ),

        laadJson(
            DATA_PADDEN.spelers
        ),

        laadJson(
            DATA_PADDEN.sponsors
        )

    ]);


    state.site =
        site;


    state.teams =
        site.competitie.teams;


    state.wedstrijden =
        wedstrijden.wedstrijden;


    state.nieuws =
        nieuws.nieuws;


    state.spelers =
        spelers.spelers;


    state.sponsors =
        sponsors.sponsors;


    valideerData();

}


/* ==========================================
   DATA CONTROLEREN

   Hiermee voorkomen we dat een toekomstige
   automatische update stilletjes verkeerde
   standen of kapotte pagina's veroorzaakt.
========================================== */

function valideerData() {

    if (
        !state.site?.club?.naam
    ) {

        throw new Error(
            "site.json mist club.naam."
        );

    }


    if (
        !state.site?.competitie?.naam
    ) {

        throw new Error(
            "site.json mist competitie.naam."
        );

    }


    if (
        !Array.isArray(
            state.teams
        )
    ) {

        throw new Error(
            "site.json mist competitie.teams."
        );

    }


    controleerUniekeIds(
        "wedstrijden",
        state.wedstrijden
    );


    controleerUniekeIds(
        "nieuws",
        state.nieuws
    );


    controleerUniekeIds(
        "spelers",
        state.spelers
    );


    controleerUniekeIds(
        "sponsors",
        state.sponsors
    );


    state.wedstrijden.forEach(
        wedstrijd => {


            if (
                !isIsoDatum(
                    wedstrijd.datum
                )
            ) {

                throw new Error(
                    `Wedstrijd ${wedstrijd.id} heeft geen geldige ISO-datum.`
                );

            }


            if (
                !state.teams.includes(
                    wedstrijd.thuis
                )
            ) {

                throw new Error(
                    `Onbekend thuisteam in ${wedstrijd.id}: ${wedstrijd.thuis}`
                );

            }


            if (
                !state.teams.includes(
                    wedstrijd.uit
                )
            ) {

                throw new Error(
                    `Onbekend uitteam in ${wedstrijd.id}: ${wedstrijd.uit}`
                );

            }


            if (
                wedstrijd.gespeeld &&
                (
                    !Number.isInteger(
                        wedstrijd.thuisGoals
                    ) ||
                    !Number.isInteger(
                        wedstrijd.uitGoals
                    )
                )
            ) {

                throw new Error(
                    `Gespeelde wedstrijd ${wedstrijd.id} mist een geldige score.`
                );

            }

        }
    );


    state.nieuws.forEach(
        bericht => {


            if (
                !isIsoDatum(
                    bericht.datum
                )
            ) {

                throw new Error(
                    `Nieuwsbericht ${bericht.id} heeft geen geldige ISO-datum.`
                );

            }

        }
    );

}


function controleerUniekeIds(
    naam,
    items
) {

    if (
        !Array.isArray(items)
    ) {

        throw new Error(
            `${naam} is geen lijst.`
        );

    }


    const ids =
        new Set();


    items.forEach(
        item => {


            if (
                !item.id
            ) {

                throw new Error(
                    `${naam} bevat een item zonder id.`
                );

            }


            if (
                ids.has(
                    item.id
                )
            ) {

                throw new Error(
                    `${naam} bevat een dubbele id: ${item.id}`
                );

            }


            ids.add(
                item.id
            );

        }
    );

}


function isIsoDatum(
    datum
) {

    return (
        /^\d{4}-\d{2}-\d{2}$/.test(
            datum
        )
    );

}


/* ==========================================
   CENTRALE INSTELLINGEN
========================================== */

function clubNaam() {

    return (
        state.site.club.naam
    );

}


function competitieNaam() {

    return (
        state.site.competitie.naam
    );

}


function puntenVoorWinst() {

    return (
        state.site
            .competitie
            .puntentelling
            ?.winst ?? 3
    );

}


function puntenVoorGelijk() {

    return (
        state.site
            .competitie
            .puntentelling
            ?.gelijk ?? 1
    );

}


/* ==========================================
   HULPFUNCTIES
========================================== */

function datumNaarDate(
    datum
) {

    const [
        jaar,
        maand,
        dag
    ] =
        datum
            .split("-")
            .map(Number);


    return new Date(
        jaar,
        maand - 1,
        dag
    );

}


function mooieDatum(
    datum
) {

    return datumNaarDate(
        datum
    )
        .toLocaleDateString(
            "nl-NL",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


function matchdayDatum(
    datum
) {

    return datumNaarDate(
        datum
    )
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


function isRisdamWedstrijd(
    wedstrijd
) {

    return (
        wedstrijd.thuis ===
            clubNaam() ||

        wedstrijd.uit ===
            clubNaam()
    );

}


function isVandaagOfLater(
    wedstrijd
) {

    const wedstrijdDatum =
        datumNaarDate(
            wedstrijd.datum
        );


    wedstrijdDatum.setHours(
        23,
        59,
        59,
        999
    );


    return (
        wedstrijdDatum >=
        new Date()
    );

}


function risdamClass(
    team
) {

    return (
        team === clubNaam()
            ? "risdam-naam"
            : ""
    );

}


/*
   Data die uit JSON komt wordt eerst veilig
   gemaakt voordat deze als HTML wordt getoond.
*/

function escapeHtml(
    waarde
) {

    return String(
        waarde
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ==========================================
   COMPETITIENAAM
========================================== */

function toonCompetitieNaam() {

    const programma =
        document.getElementById(
            "programma-competitie"
        );


    const stand =
        document.getElementById(
            "stand-competitie"
        );


    if (
        programma
    ) {

        programma.textContent =
            competitieNaam();

    }


    if (
        stand
    ) {

        stand.textContent =
            competitieNaam();

    }

}


/* ==========================================
   VOLGENDE WEDSTRIJD / MATCHDAY
========================================== */

function toonVolgendeWedstrijd() {

    const container =
        document.getElementById(
            "volgende-wedstrijd"
        );


    if (
        !container
    ) {

        return;

    }


    const komende =
        state.wedstrijden

            .filter(
                wedstrijd =>

                    isRisdamWedstrijd(
                        wedstrijd
                    ) &&

                    wedstrijd.gespeeld ===
                        false &&

                    isVandaagOfLater(
                        wedstrijd
                    )
            )

            .sort(
                (a, b) =>

                    datumNaarDate(
                        a.datum
                    ) -

                    datumNaarDate(
                        b.datum
                    )
            );


    if (
        komende.length === 0
    ) {

        container.innerHTML = `

            <div class="geen-wedstrijd">

                <h3>
                    Nieuw programma volgt
                </h3>

                <p>
                    Er staat momenteel nog geen nieuwe
                    wedstrijd van ${escapeHtml(
                        clubNaam()
                    )} gepland.
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
            clubNaam();


    const uitRisdam =
        wedstrijd.uit ===
            clubNaam();


    const locatieHtml =
        wedstrijd.locatieLink

            ? `

                <a
                    href="${escapeHtml(
                        wedstrijd.locatieLink
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="matchday-locatie-link"
                    title="Open ${escapeHtml(
                        wedstrijd.locatie
                    )} in Google Maps"
                >

                    ${escapeHtml(
                        wedstrijd.locatie
                    )} ↗

                </a>

            `

            : `

                <strong>

                    ${escapeHtml(
                        wedstrijd.locatie ||
                        "Locatie volgt"
                    )}

                </strong>

            `;


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

                    ${escapeHtml(
                        wedstrijd.tijd ||
                        "Tijd volgt"
                    )}

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

                        ${escapeHtml(
                            wedstrijd.thuis
                        )}

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

                        ${escapeHtml(
                            wedstrijd.uit
                        )}

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

                            ${escapeHtml(
                                competitieNaam()
                            )}

                        </strong>

                    </div>


                    <div class="matchday-info-item">

                        <span>
                            LOCATIE
                        </span>

                        ${locatieHtml}

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

function maakNieuwsHtml(
    berichten
) {

    return berichten

        .map(
            bericht => {


                const afbeeldingHtml =
                    bericht.afbeelding

                        ? `

                            <div class="nieuws-afbeelding">

                                <img
                                    src="${escapeHtml(
                                        bericht.afbeelding
                                    )}"
                                    alt="${escapeHtml(
                                        bericht.afbeeldingAlt ||
                                        bericht.titel
                                    )}"
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

                                        ${escapeHtml(
                                            bericht.categorie ||
                                            "Nieuws"
                                        )}

                                    </span>


                                    <span class="nieuws-datum">

                                        ${mooieDatum(
                                            bericht.datum
                                        )}

                                    </span>


                                </div>


                                <h3 class="nieuws-titel">

                                    ${escapeHtml(
                                        bericht.titel
                                    )}

                                </h3>


                            </div>


                        </div>


                        ${afbeeldingHtml}


                        <div class="nieuws-inhoud">

                            <p>

                                ${escapeHtml(
                                    bericht.tekst
                                )}

                            </p>

                        </div>


                    </article>

                `;

            }
        )

        .join("");

}


function toonNieuws() {

    const gesorteerd =
        [...state.nieuws]

            .sort(
                (a, b) =>

                    datumNaarDate(
                        b.datum
                    ) -

                    datumNaarDate(
                        a.datum
                    )
            );


    const nieuwsContainer =
        document.getElementById(
            "nieuws-lijst"
        );


    const homeContainer =
        document.getElementById(
            "home-nieuws"
        );


    if (
        nieuwsContainer
    ) {

        nieuwsContainer.innerHTML =
            maakNieuwsHtml(
                gesorteerd
            );

    }


    if (
        homeContainer
    ) {

        homeContainer.innerHTML =
            maakNieuwsHtml(
                gesorteerd.slice(
                    0,
                    2
                )
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


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        state.sponsors

            .map(
                sponsor => `

                    <a
                        href="${escapeHtml(
                            sponsor.website
                        )}"
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        class="home-sponsor-link"
                        aria-label="Bezoek de website van ${escapeHtml(
                            sponsor.naam
                        )}"
                    >

                        <img
                            src="${escapeHtml(
                                sponsor.logo
                            )}"
                            alt="${escapeHtml(
                                sponsor.naam
                            )}"
                            class="home-sponsor-logo"
                            loading="lazy"
                        >

                    </a>

                `
            )

            .join("");

}


/* ==========================================
   UITSLAGEN RISDAM SEEDAN
========================================== */

function toonUitslagen() {

    const container =
        document.getElementById(
            "uitslagen-lijst"
        );


    if (
        !container
    ) {

        return;

    }


    const gespeeld =
        state.wedstrijden

            .filter(
                wedstrijd =>

                    isRisdamWedstrijd(
                        wedstrijd
                    ) &&

                    wedstrijd.gespeeld
            )

            .sort(
                (a, b) =>

                    datumNaarDate(
                        b.datum
                    ) -

                    datumNaarDate(
                        a.datum
                    )
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

                                ${escapeHtml(
                                    wedstrijd.thuis
                                )}

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

                                ${escapeHtml(
                                    wedstrijd.uit
                                )}

                            </span>


                        </div>


                    </div>

                `
            )

            .join("");

}


/* ==========================================
   PROGRAMMA RISDAM SEEDAN
========================================== */

function toonProgramma() {

    const container =
        document.getElementById(
            "programma-lijst"
        );


    if (
        !container
    ) {

        return;

    }


    const komend =
        state.wedstrijden

            .filter(
                wedstrijd =>

                    isRisdamWedstrijd(
                        wedstrijd
                    ) &&

                    wedstrijd.gespeeld ===
                        false &&

                    isVandaagOfLater(
                        wedstrijd
                    )
            )

            .sort(
                (a, b) =>

                    datumNaarDate(
                        a.datum
                    ) -

                    datumNaarDate(
                        b.datum
                    )
            );


    if (
        komend.length === 0
    ) {

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
                                      escapeHtml(
                                          wedstrijd.tijd
                                      )

                                    : ""
                            }

                        </div>


                        <div class="wedstrijd-teams">


                            <span
                                class="${risdamClass(
                                    wedstrijd.thuis
                                )}"
                            >

                                ${escapeHtml(
                                    wedstrijd.thuis
                                )}

                            </span>


                            <strong>
                                VS
                            </strong>


                            <span
                                class="${risdamClass(
                                    wedstrijd.uit
                                )}"
                            >

                                ${escapeHtml(
                                    wedstrijd.uit
                                )}

                            </span>


                        </div>


                        ${
                            wedstrijd.locatie

                                ? `

                                    <div class="wedstrijd-locatie">

                                        ${escapeHtml(
                                            wedstrijd.locatie
                                        )}

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


    if (
        !container
    ) {

        return;

    }


    const gespeeld =
        state.wedstrijden

            .filter(
                wedstrijd =>
                    wedstrijd.gespeeld
            )

            .sort(
                (a, b) =>

                    datumNaarDate(
                        b.datum
                    ) -

                    datumNaarDate(
                        a.datum
                    )
            );


    const perDatum =
        gespeeld.reduce(
            (
                groepen,
                wedstrijd
            ) => {


                if (
                    !groepen[
                        wedstrijd.datum
                    ]
                ) {

                    groepen[
                        wedstrijd.datum
                    ] = [];

                }


                groepen[
                    wedstrijd.datum
                ].push(
                    wedstrijd
                );


                return groepen;

            },
            {}
        );


    container.innerHTML =
        Object.entries(
            perDatum
        )

            .map(
                (
                    [
                        datum,
                        wedstrijdenVanDag
                    ]
                ) => `

                    <div class="speelronde">


                        <div class="speelronde-titel">

                            ${mooieDatum(
                                datum
                            )}

                        </div>


                        ${wedstrijdenVanDag

                            .map(
                                wedstrijd => `

                                    <div
                                        class="
                                            competitie-wedstrijd

                                            ${
                                                isRisdamWedstrijd(
                                                    wedstrijd
                                                )

                                                    ? "risdam-wedstrijd"

                                                    : ""
                                            }
                                        "
                                    >


                                        <span class="thuisteam">

                                            ${escapeHtml(
                                                wedstrijd.thuis
                                            )}

                                        </span>


                                        <span class="competitie-score">

                                            ${wedstrijd.thuisGoals}-${wedstrijd.uitGoals}

                                        </span>


                                        <span class="uitteam">

                                            ${escapeHtml(
                                                wedstrijd.uit
                                            )}

                                        </span>


                                    </div>

                                `
                            )

                            .join("")}


                    </div>

                `
            )

            .join("");

}


/* ==========================================
   SEIZOENSTATISTIEKEN
========================================== */

function toonSeizoenStatistieken() {

    const container =
        document.getElementById(
            "statistieken"
        );


    if (
        !container
    ) {

        return;

    }


    const stats = {

        gespeeld: 0,

        gewonnen: 0,

        gelijk: 0,

        verloren: 0,

        goalsVoor: 0,

        goalsTegen: 0

    };


    state.wedstrijden.forEach(
        wedstrijd => {


            if (
                !wedstrijd.gespeeld ||
                !isRisdamWedstrijd(
                    wedstrijd
                )
            ) {

                return;

            }


            stats.gespeeld++;


            const risdamThuis =
                wedstrijd.thuis ===
                    clubNaam();


            const risdamGoals =
                risdamThuis

                    ? wedstrijd.thuisGoals

                    : wedstrijd.uitGoals;


            const tegenGoals =
                risdamThuis

                    ? wedstrijd.uitGoals

                    : wedstrijd.thuisGoals;


            stats.goalsVoor +=
                risdamGoals;


            stats.goalsTegen +=
                tegenGoals;


            if (
                risdamGoals >
                tegenGoals
            ) {

                stats.gewonnen++;

            }

            else if (
                risdamGoals ===
                tegenGoals
            ) {

                stats.gelijk++;

            }

            else {

                stats.verloren++;

            }

        }
    );


    const punten =
        stats.gewonnen *
            puntenVoorWinst() +

        stats.gelijk *
            puntenVoorGelijk();


    const doelsaldo =
        stats.goalsVoor -
        stats.goalsTegen;


    container.innerHTML = `

        <div class="stat-box">

            <strong>
                ${stats.gespeeld}
            </strong>

            <span>
                Gespeeld
            </span>

        </div>


        <div class="stat-box">

            <strong>
                ${stats.gewonnen}
            </strong>

            <span>
                Gewonnen
            </span>

        </div>


        <div class="stat-box">

            <strong>
                ${stats.gelijk}
            </strong>

            <span>
                Gelijk
            </span>

        </div>


        <div class="stat-box">

            <strong>
                ${stats.verloren}
            </strong>

            <span>
                Verloren
            </span>

        </div>


        <div class="stat-box">

            <strong>
                ${punten}
            </strong>

            <span>
                Punten
            </span>

        </div>


        <div class="stat-box">

            <strong>
                ${stats.goalsVoor}-${stats.goalsTegen}
            </strong>

            <span>
                Goals
            </span>

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


    if (
        !container
    ) {

        return;

    }


    const stand =
        Object.fromEntries(

            state.teams.map(
                team => [

                    team,

                    {

                        team:
                            team,

                        gespeeld:
                            0,

                        gewonnen:
                            0,

                        gelijk:
                            0,

                        verloren:
                            0,

                        voor:
                            0,

                        tegen:
                            0,

                        doelsaldo:
                            0,

                        punten:
                            0

                    }

                ]
            )

        );


    state.wedstrijden.forEach(
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

                thuis.punten +=
                    puntenVoorWinst();


                uit.verloren++;

            }

            else if (
                wedstrijd.thuisGoals <
                wedstrijd.uitGoals
            ) {

                uit.gewonnen++;

                uit.punten +=
                    puntenVoorWinst();


                thuis.verloren++;

            }

            else {

                thuis.gelijk++;

                uit.gelijk++;


                thuis.punten +=
                    puntenVoorGelijk();


                uit.punten +=
                    puntenVoorGelijk();

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

    container.innerHTML = `

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


                    ${stand

                        .map(
                            (
                                team,
                                index
                            ) => `

                                <tr
                                    class="${
                                        team.team ===
                                            clubNaam()

                                            ? "risdam-rij"

                                            : ""
                                    }"
                                >


                                    <td>
                                        ${index + 1}
                                    </td>


                                    <td class="teamnaam">

                                        ${escapeHtml(
                                            team.team
                                        )}

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

                            `
                        )

                        .join("")}


                </tbody>


            </table>


        </div>

    `;

}


/* ==========================================
   TEAM
========================================== */

function toonSpelers() {

    const container =
        document.getElementById(
            "spelers-lijst"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        state.spelers

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
                                    src="${escapeHtml(
                                        speler.foto
                                    )}"
                                    alt="${escapeHtml(
                                        speler.naam
                                    )}"
                                >

                            `

                            : `

                                <div class="speler-placeholder">

                                    ${escapeHtml(
                                        initialen
                                    )}

                                </div>

                            `;


                    return `

                        <article class="speler-kaart">


                            <div class="speler-foto">

                                ${afbeelding}

                            </div>


                            <div class="speler-info">


                                <h3 class="speler-naam">

                                    ${escapeHtml(
                                        speler.naam
                                    )}

                                </h3>


                                <div class="speler-stats">


                                    <div class="speler-stat">

                                        <strong>

                                            ${
                                                speler.doelpunten ===
                                                    null

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
                                                speler.assists ===
                                                    null

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
        state.spelers

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
        state.spelers

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


    doelpuntenContainer.innerHTML =
        topscorers.length

            ? maakRankingHtml(
                topscorers,
                "doelpunten"
            )

            : "<p>Nog geen doelpuntenstatistieken ingevuld.</p>";


    assistsContainer.innerHTML =
        assistLijst.length

            ? maakRankingHtml(
                assistLijst,
                "assists"
            )

            : "<p>Nog geen assiststatistieken ingevuld.</p>";

}


function maakRankingHtml(
    spelers,
    veld
) {

    return spelers

        .map(
            (
                speler,
                index
            ) => `

                <div class="ranking-rij">


                    <div class="ranking-positie">

                        ${index + 1}

                    </div>


                    <div class="ranking-naam">

                        ${escapeHtml(
                            speler.naam
                        )}

                    </div>


                    <div class="ranking-aantal">

                        ${speler[veld]}

                    </div>


                </div>

            `
        )

        .join("");

}


/* ==========================================
   SPONSORS
========================================== */

function toonSponsors() {

    const container =
        document.getElementById(
            "sponsors-lijst"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        state.sponsors

            .map(
                sponsor => `

                    <article class="sponsor-kaart">


                        <div class="sponsor-logo-vak">


                            <img
                                src="${escapeHtml(
                                    sponsor.logo
                                )}"
                                alt="${escapeHtml(
                                    sponsor.naam
                                )}"
                                class="sponsor-logo"
                            >


                        </div>


                        <div class="sponsor-info">


                            <h3 class="sponsor-naam">

                                ${escapeHtml(
                                    sponsor.naam
                                )}

                            </h3>


                            <a
                                href="${escapeHtml(
                                    sponsor.website
                                )}"
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
   FOUTAFHANDELING
========================================== */

function toonDataFout(
    error
) {

    console.error(
        error
    );


    const main =
        document.querySelector(
            "main"
        );


    if (
        !main
    ) {

        return;

    }


    const melding =
        document.createElement(
            "section"
        );


    melding.innerHTML = `

        <h2>
            Websitegegevens konden niet worden geladen
        </h2>

        <p>
            Controleer of de bestanden in de map
            <strong>data</strong>
            aanwezig en geldig zijn.
        </p>

    `;


    main.prepend(
        melding
    );

}


/* ==========================================
   WEBSITE RENDEREN
========================================== */

function renderWebsite() {

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

}


/* ==========================================
   WEBSITE STARTEN
========================================== */

async function startWebsite() {

    try {

        await laadData();

        renderWebsite();

    }

    catch (
        error
    ) {

        toonDataFout(
            error
        );

    }

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startWebsite
    );

}

else {

    startWebsite();

}