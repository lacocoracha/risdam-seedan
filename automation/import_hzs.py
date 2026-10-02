from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
import unicodedata
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup, Tag


SOURCE_URL = (
    "https://www.hoornsezaalvoetbalstichting.nl/"
    "competitie/najaar-2026/schema/"
)

ROOT = Path(__file__).resolve().parents[1]

SITE_FILE = ROOT / "data" / "site.json"
MATCHES_FILE = ROOT / "data" / "wedstrijden.json"

BACKUP_DIR = (
    ROOT.parent
    / "risdam-seedan-backups"
)


DATE_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}$"
)

TIME_RE = re.compile(
    r"^(?:[01]?\d|2[0-3]):[0-5]\d$"
)

SCORE_RE = re.compile(
    r"^(\d+)\s*[-–—]\s*(\d+)$"
)


LOCATION_ALIASES = {
    "Sportcentrum Opgang":
        "De Opgang",

    "Sporthal De Kers":
        "De Kers",
}


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 "
        "(Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/154.0.0.0 "
        "Safari/537.36"
    ),

    "Accept-Language":
        "nl-NL,nl;q=0.9,en;q=0.8",
}


# =========================================================
# ALGEMEEN
# =========================================================

def clean(text: str) -> str:

    return " ".join(
        text
        .replace("\xa0", " ")
        .strip()
        .split()
    )


def load_json(
    path: Path
) -> dict[str, Any]:

    try:

        with path.open(
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

    except FileNotFoundError as exc:

        raise RuntimeError(
            f"Bestand niet gevonden: {path}"
        ) from exc

    except json.JSONDecodeError as exc:

        raise RuntimeError(
            f"Ongeldige JSON in {path}, "
            f"regel {exc.lineno}."
        ) from exc


    if not isinstance(data, dict):

        raise RuntimeError(
            f"{path} bevat geen geldig JSON-object."
        )


    return data


# =========================================================
# HZS OPHALEN
# =========================================================

def fetch_source() -> str:

    try:

        response = requests.get(
            SOURCE_URL,
            headers=HEADERS,
            timeout=25
        )

        response.raise_for_status()

        return response.text

    except requests.RequestException as exc:

        raise RuntimeError(
            "De HZS-website kon niet worden opgehaald."
        ) from exc


# =========================================================
# TEAMS
# =========================================================

def team_lookup(
    teams: list[str]
) -> dict[str, str]:

    return {
        clean(team).casefold():
            team

        for team in teams
    }


def canonical_team(
    name: str,
    lookup: dict[str, str]
) -> str | None:

    return lookup.get(
        clean(name).casefold()
    )


# =========================================================
# LOCATIE
# =========================================================

def read_location(
    cell: Tag
) -> tuple[str | None, str | None]:

    source_name = clean(
        cell.get_text(
            " ",
            strip=True
        )
    )


    if not source_name:

        return None, None


    display_name = (
        LOCATION_ALIASES.get(
            source_name,
            source_name
        )
    )


    link_tag = cell.find(
        "a",
        href=True
    )


    link = None


    if link_tag:

        href = clean(
            str(
                link_tag.get(
                    "href",
                    ""
                )
            )
        )

        if href:

            link = href


    return (
        display_name,
        link
    )


# =========================================================
# DATUMS UIT DE PAGINA
# =========================================================

def extract_dates(
    soup: BeautifulSoup
) -> list[str]:

    dates = []

    seen = set()


    for node in soup.find_all(
        string=True
    ):

        parent = node.parent


        if (
            parent
            and parent.name in {
                "script",
                "style"
            }
        ):

            continue


        value = clean(
            str(node)
        )


        if not DATE_RE.fullmatch(
            value
        ):

            continue


        if value in seen:

            continue


        seen.add(value)

        dates.append(value)


    return dates


# =========================================================
# ÉÉN WEDSTRIJDTABEL UITLEZEN
# =========================================================

def parse_table(
    table: Tag,
    lookup: dict[str, str]
) -> tuple[
    list[dict[str, Any]],
    list[str]
]:

    matches = []

    warnings = []


    for row in table.find_all(
        "tr"
    ):

        cells = row.find_all(
            "td"
        )


        if len(cells) < 4:

            continue


        values = [
            clean(
                cell.get_text(
                    " ",
                    strip=True
                )
            )

            for cell in cells
        ]


        home = canonical_team(
            values[0],
            lookup
        )


        away = canonical_team(
            values[1],
            lookup
        )


        if (
            home is None
            or away is None
        ):

            continue


        status = values[2]


        score = SCORE_RE.fullmatch(
            status
        )


        time = TIME_RE.fullmatch(
            status
        )


        if (
            score is None
            and time is None
        ):

            warnings.append(
                f"{home} - {away}: "
                f"onbekende tijd/score {status!r}"
            )

            continue


        (
            location,
            location_link
        ) = read_location(
            cells[3]
        )


        match = {
            "thuis":
                home,

            "uit":
                away,

            "locatie":
                location,

            "locatieLink":
                location_link,
        }


        if score:

            match.update({
                "thuisGoals":
                    int(
                        score.group(1)
                    ),

                "uitGoals":
                    int(
                        score.group(2)
                    ),

                "gespeeld":
                    True,

                "tijd":
                    None,
            })


        else:

            match.update({
                "thuisGoals":
                    None,

                "uitGoals":
                    None,

                "gespeeld":
                    False,

                "tijd":
                    status,
            })


        matches.append(match)


    return (
        matches,
        warnings
    )


# =========================================================
# COMPLETE HZS-PAGINA UITLEZEN
#
# We verzamelen:
#
# 7 datums
# 7 echte wedstrijdtabellen
#
# en koppelen die vervolgens OP VOLGORDE.
#
# Daardoor zijn we niet meer afhankelijk
# van de vreemde HTML-positie van de datum.
# =========================================================

def parse_source(
    html: str,
    teams: list[str]
) -> tuple[
    list[dict[str, Any]],
    list[str]
]:

    soup = BeautifulSoup(
        html,
        "html.parser"
    )


    lookup = team_lookup(
        teams
    )


    dates = extract_dates(
        soup
    )


    table_data = []

    warnings = []


    for table in soup.find_all(
        "table"
    ):

        (
            matches,
            table_warnings
        ) = parse_table(
            table,
            lookup
        )


        warnings.extend(
            table_warnings
        )


        # Alleen echte competitietabellen.
        if matches:

            table_data.append(
                matches
            )


    print(
        f"Speelrondes gevonden: {len(dates)}"
    )

    print(
        f"Wedstrijdtabellen gevonden: {len(table_data)}"
    )


    if (
        len(dates)
        != len(table_data)
    ):

        raise RuntimeError(

            "Aantal datums en wedstrijdtabellen "
            "komt niet overeen. "
            "Er wordt uit veiligheid niets aangepast."

        )


    all_matches = []

    seen = set()


    for (
        date,
        matches
    ) in zip(
        dates,
        table_data
    ):


        for match in matches:

            match = dict(
                match
            )


            match[
                "datum"
            ] = date


            key = (
                date,
                match["thuis"],
                match["uit"]
            )


            if key in seen:

                raise RuntimeError(

                    "Dubbele wedstrijd gevonden: "
                    f"{date} | "
                    f"{match['thuis']} - "
                    f"{match['uit']}"

                )


            seen.add(key)

            all_matches.append(
                match
            )


    if not all_matches:

        raise RuntimeError(
            "Geen wedstrijden gevonden."
        )


    all_matches.sort(

        key=lambda match: (

            match["datum"],

            match.get("tijd")
            or "99:99",

            match["thuis"],

            match["uit"]

        )

    )


    return (
        all_matches,
        warnings
    )


# =========================================================
# ID MAKEN
# =========================================================

def slugify(
    value: str
) -> str:

    ascii_value = (
        unicodedata
        .normalize(
            "NFKD",
            value
        )
        .encode(
            "ascii",
            "ignore"
        )
        .decode(
            "ascii"
        )
        .lower()
    )


    return re.sub(
        r"[^a-z0-9]+",
        "-",
        ascii_value
    ).strip("-")


def make_id(
    match: dict[str, Any]
) -> str:

    return (
        f'{match["datum"]}-'
        f'{slugify(match["thuis"])}-'
        f'{slugify(match["uit"])}'
    )


def key_of(
    match: dict[str, Any]
) -> tuple[str, str, str]:

    return (
        match["datum"],
        match["thuis"],
        match["uit"]
    )


# =========================================================
# JSON NETJES HOUDEN
# =========================================================

def ordered_match(
    match: dict[str, Any]
) -> dict[str, Any]:

    preferred_order = [
        "id",
        "datum",
        "tijd",
        "locatie",
        "locatieLink",
        "thuis",
        "uit",
        "thuisGoals",
        "uitGoals",
        "gespeeld",
    ]


    result = {}


    for key in preferred_order:

        if key not in match:

            continue


        value = match[key]


        if (
            value is None
            and key not in {
                "thuisGoals",
                "uitGoals"
            }
        ):

            continue


        result[key] = value


    # Eventuele toekomstige velden behouden.
    for (
        key,
        value
    ) in match.items():

        if key not in preferred_order:

            result[key] = value


    return result


def new_local_match(
    source: dict[str, Any]
) -> dict[str, Any]:

    return ordered_match({
        "id":
            make_id(source),

        "datum":
            source["datum"],

        "tijd":
            source.get("tijd"),

        "locatie":
            source.get("locatie"),

        "locatieLink":
            source.get(
                "locatieLink"
            ),

        "thuis":
            source["thuis"],

        "uit":
            source["uit"],

        "thuisGoals":
            source.get(
                "thuisGoals"
            ),

        "uitGoals":
            source.get(
                "uitGoals"
            ),

        "gespeeld":
            source["gespeeld"],
    })


# =========================================================
# DATA SAMENVOEGEN
# =========================================================

def merge(
    local_matches:
        list[dict[str, Any]],

    source_matches:
        list[dict[str, Any]]

) -> tuple[
    list[dict[str, Any]],
    list[str],
    list[str],
    list[str]
]:

    result = [
        dict(match)

        for match
        in local_matches
    ]


    index = {
        key_of(match):
            match

        for match
        in result
    }


    added = []

    changed = []

    warnings = []


    for source in source_matches:

        key = key_of(
            source
        )


        local = index.get(
            key
        )


        label = (
            f'{source["datum"]} | '
            f'{source["thuis"]} - '
            f'{source["uit"]}'
        )


        # -------------------------------------
        # NIEUWE WEDSTRIJD
        # -------------------------------------

        if local is None:

            item = new_local_match(
                source
            )


            result.append(item)

            index[key] = item


            if source["gespeeld"]:

                status = (
                    f'{source["thuisGoals"]}'
                    "-"
                    f'{source["uitGoals"]}'
                )

            else:

                status = source["tijd"]


            added.append(
                f"{label} | {status}"
            )

            continue


        changes = []


        # -------------------------------------
        # UITSLAG BESCHIKBAAR
        # -------------------------------------

        if source["gespeeld"]:

            old_score = (
                local.get("thuisGoals"),
                local.get("uitGoals")
            )


            new_score = (
                source["thuisGoals"],
                source["uitGoals"]
            )


            if old_score != new_score:

                changes.append(
                    "score: "
                    f"{old_score[0]}-{old_score[1]} "
                    "→ "
                    f"{new_score[0]}-{new_score[1]}"
                )


                local["thuisGoals"] = (
                    source["thuisGoals"]
                )

                local["uitGoals"] = (
                    source["uitGoals"]
                )


            if (
                local.get("gespeeld")
                is not True
            ):

                changes.append(
                    "gespeeld: false → true"
                )


                local["gespeeld"] = True


            # Tijd is niet langer nodig
            # zodra er een uitslag staat.
            local.pop(
                "tijd",
                None
            )


        # -------------------------------------
        # NOG GEEN UITSLAG
        # -------------------------------------

        else:

            # Bestaande uitslag nooit
            # automatisch terugdraaien.
            if (
                local.get("gespeeld")
                is True
            ):

                warnings.append(
                    f"{label}: "
                    f"HZS toont {source['tijd']}, "
                    "maar lokaal staat al een uitslag. "
                    "Lokale uitslag behouden."
                )


            else:

                if (
                    local.get("tijd")
                    != source["tijd"]
                ):

                    changes.append(
                        "tijd: "
                        f"{local.get('tijd')} "
                        "→ "
                        f"{source['tijd']}"
                    )


                    local["tijd"] = (
                        source["tijd"]
                    )


                local["gespeeld"] = False


                # Alleen toekomstige/niet gespeelde
                # wedstrijden verrijken.
                if (
                    not local.get("locatie")
                    and source.get("locatie")
                ):

                    local["locatie"] = (
                        source["locatie"]
                    )

                    changes.append(
                        "locatie toegevoegd"
                    )


                if (
                    not local.get(
                        "locatieLink"
                    )
                    and source.get(
                        "locatieLink"
                    )
                ):

                    local["locatieLink"] = (
                        source["locatieLink"]
                    )

                    changes.append(
                        "locatieLink toegevoegd"
                    )


        if changes:

            changed.append(
                f"{label} | "
                + "; ".join(changes)
            )


    result = [
        ordered_match(match)

        for match
        in result
    ]


    result.sort(

        key=lambda match: (

            match["datum"],

            match.get("tijd")
            or "99:99",

            match["thuis"],

            match["uit"]

        )

    )


    ids = [
        match.get("id")

        for match
        in result
    ]


    duplicate_ids = [
        match_id

        for (
            match_id,
            count
        )
        in Counter(ids).items()

        if count > 1
    ]


    if duplicate_ids:

        raise RuntimeError(
            "Dubbele wedstrijd-ID's: "
            + ", ".join(
                duplicate_ids
            )
        )


    return (
        result,
        added,
        changed,
        warnings
    )


# =========================================================
# BACKUP
# =========================================================

def backup_matches_file() -> Path:

    BACKUP_DIR.mkdir(
        parents=True,
        exist_ok=True
    )


    timestamp = (
        datetime.now()
        .strftime(
            "%Y%m%d-%H%M%S"
        )
    )


    backup = (
        BACKUP_DIR
        / f"wedstrijden-{timestamp}.json"
    )


    shutil.copy2(
        MATCHES_FILE,
        backup
    )


    return backup


# =========================================================
# VEILIG OPSLAAN
# =========================================================

def write_json_atomic(
    path: Path,
    data: dict[str, Any]
) -> None:

    temporary = path.with_suffix(
        ".json.tmp"
    )


    with temporary.open(
        "w",
        encoding="utf-8",
        newline="\n"
    ) as file:

        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2
        )

        file.write("\n")


    os.replace(
        temporary,
        path
    )


# =========================================================
# TERMINAL
# =========================================================

def print_block(
    title: str,
    lines: list[str]
) -> None:

    if not lines:

        return


    print()

    print(title)

    print(
        "-" * len(title)
    )


    for line in lines:

        print(
            f"• {line}"
        )


# =========================================================
# COMMAND LINE
# =========================================================

def parse_args() -> argparse.Namespace:

    parser = argparse.ArgumentParser(
        description=(
            "Vergelijk het HZS-schema "
            "met data/wedstrijden.json."
        )
    )


    parser.add_argument(
        "--write",
        action="store_true",
        help=(
            "Sla veranderingen op. "
            "Zonder deze optie draait preview."
        )
    )


    return parser.parse_args()


# =========================================================
# START
# =========================================================

def main() -> int:

    args = parse_args()


    print(
        "HZS → Risdam Seedan importer"
    )

    print(
        "============================"
    )

    print(
        f"Bron: {SOURCE_URL}"
    )


    print(
        "Modus: "
        + (
            "SCHRIJVEN"

            if args.write

            else (
                "PREVIEW - "
                "niets wordt opgeslagen"
            )
        )
    )


    site_data = load_json(
        SITE_FILE
    )


    matches_data = load_json(
        MATCHES_FILE
    )


    try:

        teams = (
            site_data[
                "competitie"
            ][
                "teams"
            ]
        )

    except (
        KeyError,
        TypeError
    ) as exc:

        raise RuntimeError(
            "site.json mist competitie.teams."
        ) from exc


    local_matches = (
        matches_data.get(
            "wedstrijden"
        )
    )


    if not isinstance(
        local_matches,
        list
    ):

        raise RuntimeError(
            "wedstrijden.json bevat "
            "geen geldige wedstrijdenlijst."
        )


    html = fetch_source()


    (
        source_matches,
        parse_warnings
    ) = parse_source(
        html,
        teams
    )


    (
        merged,
        added,
        changed,
        merge_warnings
    ) = merge(
        local_matches,
        source_matches
    )


    unchanged = max(
        0,
        len(source_matches)
        - len(added)
        - len(changed)
    )


    print_block(
        "SAMENVATTING",
        [
            (
                "Bronwedstrijden gevonden: "
                f"{len(source_matches)}"
            ),
            (
                "Nieuwe wedstrijden: "
                f"{len(added)}"
            ),
            (
                "Gewijzigd/verrijkt: "
                f"{len(changed)}"
            ),
            (
                "Zonder wijziging: "
                f"{unchanged}"
            ),
        ]
    )


    print_block(
        "NIEUW",
        added
    )


    print_block(
        "GEWIJZIGD / VERRIJKT",
        changed
    )


    print_block(
        "WAARSCHUWINGEN",
        parse_warnings
        + merge_warnings
    )


    if (
        not added
        and not changed
    ):

        print(
            "\nGeen wijzigingen nodig."
        )

        return 0


    if not args.write:

        print(
            "\nPREVIEW KLAAR — "
            "er is niets opgeslagen."
        )

        return 0


    backup = (
        backup_matches_file()
    )


    matches_data[
        "wedstrijden"
    ] = merged


    write_json_atomic(
        MATCHES_FILE,
        matches_data
    )


    print(
        "\nKLAAR — "
        "wedstrijden.json is bijgewerkt."
    )


    print(
        f"Backup: {backup}"
    )


    return 0


if __name__ == "__main__":

    try:

        raise SystemExit(
            main()
        )

    except RuntimeError as exc:

        print(
            f"\nFOUT: {exc}",
            file=sys.stderr
        )

        print(
            "Er is niets aangepast.",
            file=sys.stderr
        )

        raise SystemExit(1)