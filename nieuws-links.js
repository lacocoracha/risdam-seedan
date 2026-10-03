/* ==========================================
   RISDAM SEEDAN
   KLIKBARE NIEUWSBERICHTEN

   Deze code:

   1. maakt nieuwskaarten op de homepage klikbaar
   2. voegt "Lees verder →" toe
   3. koppelt iedere kaart aan zijn nieuws-ID
   4. stuurt door naar nieuws.html
   5. scrollt daar automatisch naar
      het gekozen volledige artikel
========================================== */


let nieuwsLinkData = [];


/* ==========================================
   NIEUWSDATA LADEN
========================================== */

async function laadNieuwsLinkData() {

    try {

        const response = await fetch(
            "data/nieuws.json",
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "nieuws.json kon niet worden geladen."
            );

        }


        const data =
            await response.json();


        nieuwsLinkData = [
            ...data.nieuws
        ];


        nieuwsLinkData.sort(
            (
                a,
                b
            ) => {

                const datumA =
                    new Date(
                        `${a.datum}T12:00:00`
                    );


                const datumB =
                    new Date(
                        `${b.datum}T12:00:00`
                    );


                return (
                    datumB -
                    datumA
                );

            }
        );


        activeerNieuwsFunctionaliteit();

    }

    catch (
        error
    ) {

        console.error(
            "Nieuwslinks konden niet worden geladen:",
            error
        );

    }

}


/* ==========================================
   HOMEPAGE NIEUWS KLIKBAAR MAKEN
========================================== */

function maakHomeNieuwsKlikbaar() {

    const container =
        document.getElementById(
            "home-nieuws"
        );


    if (!container) {

        return;

    }


    const kaarten =
        container.querySelectorAll(
            ".nieuws-kaart"
        );


    if (
        kaarten.length === 0 ||
        nieuwsLinkData.length === 0
    ) {

        return;

    }


    kaarten.forEach(
        (
            kaart,
            index
        ) => {


            const bericht =
                nieuwsLinkData[index];


            if (!bericht) {

                return;

            }


            /*
               Voorkomt dat dezelfde kaart
               meerdere keren wordt ingesteld.
            */

            if (
                kaart.dataset.nieuwsLinkActief ===
                "true"
            ) {

                return;

            }


            kaart.dataset.nieuwsLinkActief =
                "true";


            const artikelId =
                `nieuws-${bericht.id}`;


            const doelUrl =
                `nieuws.html#${artikelId}`;


            /*
               Hele kaart voelt als link.
            */

            kaart.style.cursor =
                "pointer";


            kaart.setAttribute(
                "role",
                "link"
            );


            kaart.setAttribute(
                "tabindex",
                "0"
            );


            kaart.setAttribute(
                "aria-label",
                `Lees het volledige nieuwsbericht: ${bericht.titel}`
            );


            /*
               Lees verder toevoegen.
            */

            const inhoud =
                kaart.querySelector(
                    ".nieuws-inhoud"
                );


            if (
                inhoud &&
                !inhoud.querySelector(
                    ".nieuws-lees-verder"
                )
            ) {

                const leesVerder =
                    document.createElement(
                        "span"
                    );


                leesVerder.className =
                    "nieuws-lees-verder";


                leesVerder.textContent =
                    "Lees verder →";


                /*
                   Styling staat bewust hier,
                   zodat style.css niet hoeft
                   te worden aangepast.
                */

                leesVerder.style.display =
                    "block";

                leesVerder.style.marginTop =
                    "auto";

                leesVerder.style.paddingTop =
                    "18px";

                leesVerder.style.color =
                    "#162447";

                leesVerder.style.fontSize =
                    "12px";

                leesVerder.style.fontWeight =
                    "800";


                inhoud.appendChild(
                    leesVerder
                );

            }


            /*
               Klik met muis.
            */

            kaart.addEventListener(
                "click",
                function (
                    event
                ) {

                    /*
                       Mocht er later een echte
                       knop of link in de kaart
                       komen, laat die gewoon werken.
                    */

                    if (
                        event.target.closest(
                            "a, button, input, select, textarea"
                        )
                    ) {

                        return;

                    }


                    window.location.href =
                        doelUrl;

                }
            );


            /*
               Ook toegankelijk met toetsenbord.
            */

            kaart.addEventListener(
                "keydown",
                function (
                    event
                ) {

                    if (
                        event.key ===
                            "Enter" ||

                        event.key ===
                            " "
                    ) {

                        event.preventDefault();


                        window.location.href =
                            doelUrl;

                    }

                }
            );

        }
    );

}


/* ==========================================
   ARTIKEL-ID'S OP NIEUWSPAGINA
========================================== */

function geefNieuwsKaartenIds() {

    const container =
        document.getElementById(
            "nieuws-lijst"
        );


    if (!container) {

        return;

    }


    const kaarten =
        container.querySelectorAll(
            ".nieuws-kaart"
        );


    if (
        kaarten.length === 0 ||
        nieuwsLinkData.length === 0
    ) {

        return;

    }


    kaarten.forEach(
        (
            kaart,
            index
        ) => {


            const bericht =
                nieuwsLinkData[index];


            if (!bericht) {

                return;

            }


            kaart.id =
                `nieuws-${bericht.id}`;


            /*
               Hierdoor komt het artikel niet
               onder de sticky navigatie terecht.
            */

            kaart.style.scrollMarginTop =
                "100px";

        }
    );


    scrollNaarGekozenArtikel();

}


/* ==========================================
   NAAR ARTIKEL SCROLLEN
========================================== */

function scrollNaarGekozenArtikel() {

    if (!window.location.hash) {

        return;

    }


    const doelId =
        decodeURIComponent(
            window.location.hash
            .substring(1)
        );


    if (
        !doelId.startsWith(
            "nieuws-"
        )
    ) {

        return;

    }


    const artikel =
        document.getElementById(
            doelId
        );


    if (!artikel) {

        return;

    }


    /*
       Kleine vertraging zodat browser en
       dynamische inhoud volledig klaar zijn.
    */

    requestAnimationFrame(
        function () {

            artikel.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "start"
                }
            );

        }
    );

}


/* ==========================================
   ALLES ACTIVEREN
========================================== */

function activeerNieuwsFunctionaliteit() {

    maakHomeNieuwsKlikbaar();

    geefNieuwsKaartenIds();

}


/* ==========================================
   WACHTEN OP SCRIPT.JS

   script.js laadt de nieuwsberichten
   asynchroon uit JSON.

   Daarom kijken we of de kaarten verschijnen.
========================================== */

function observeerNieuwsContainer(
    container
) {

    if (!container) {

        return;

    }


    const observer =
        new MutationObserver(
            function () {

                activeerNieuwsFunctionaliteit();

            }
        );


    observer.observe(
        container,
        {
            childList:
                true
        }
    );

}


/* ==========================================
   START
========================================== */

function startNieuwsLinks() {

    const homeContainer =
        document.getElementById(
            "home-nieuws"
        );


    const nieuwsContainer =
        document.getElementById(
            "nieuws-lijst"
        );


    observeerNieuwsContainer(
        homeContainer
    );


    observeerNieuwsContainer(
        nieuwsContainer
    );


    laadNieuwsLinkData();

}


/* ==========================================
   PAGINA KLAAR?
========================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startNieuwsLinks
    );

}

else {

    startNieuwsLinks();

}