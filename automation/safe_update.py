from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]

IMPORTER_FILE = (
    ROOT
    / "automation"
    / "import_hzs.py"
)

SITE_FILE = (
    ROOT
    / "data"
    / "site.json"
)

MATCHES_FILE = (
    ROOT
    / "data"
    / "wedstrijden.json"
)


# =========================================================
# VEILIGHEIDSLIMIETEN
# =========================================================

MIN_ROUNDS = 7

MIN_SOURCE_MATCHES = 49

MAX_TOTAL_CHANGES = 10

MAX_NEW_MATCHES = 10

MAX_EXISTING_SCORE_CORRECTIONS = 2

MAX_GOALS = 50


DATE_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}$"
)


class SafetyError(RuntimeError):
    pass


# =========================================================
# JSON LADEN
# =========================================================

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

        raise SafetyError(
            f"Bestand niet gevonden: {path}"
        ) from exc

    except json.JSONDecodeError as exc:

        raise SafetyError(
            f"Ongeldige JSON in {path} "
            f"op regel {exc.lineno}."
        ) from exc


    if not isinstance(
        data,
        dict
    ):

        raise SafetyError(
            f"{path} bevat geen JSON-object."
        )


    return data


# =========================================================
# IMPORTER UITVOEREN
# =========================================================

def run_importer(
    write: bool
) -> str:

    command = [
        sys.executable,
        str(IMPORTER_FILE)
    ]


    if write:

        command.append(
            "--write"
        )


    environment = {
        **os.environ,
        "PYTHONIOENCODING": "utf-8",
        "PYTHONUTF8": "1",
    }


    result = subprocess.run(
        command,
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        env=environment
    )


    output = result.stdout


    if result.stderr:

        output += (
            "\n"
            + result.stderr
        )


    print(output)


    if result.returncode != 0:

        raise SafetyError(
            "De HZS-importer gaf een fout. "
            "Er wordt niets gepubliceerd."
        )


    return output


# =========================================================
# CIJFERS UIT IMPORTER LEZEN
# =========================================================

def read_number(
    output: str,
    label: str
) -> int:

    pattern = re.compile(
        re.escape(label)
        + r"\s*(\d+)"
    )


    match = pattern.search(
        output
    )


    if not match:

        raise SafetyError(
            "Veiligheidscontrole kon "
            f"'{label}' niet vinden."
        )


    return int(
        match.group(1)
    )


def parse_summary(
    output: str
) -> dict[str, int]:

    return {

        "rounds":
            read_number(
                output,
                "Speelrondes gevonden:"
            ),

        "tables":
            read_number(
                output,
                "Wedstrijdtabellen gevonden:"
            ),

        "source":
            read_number(
                output,
                "Bronwedstrijden gevonden:"
            ),

        "new":
            read_number(
                output,
                "Nieuwe wedstrijden:"
            ),

        "changed":
            read_number(
                output,
                "Gewijzigd/verrijkt:"
            ),

        "unchanged":
            read_number(
                output,
                "Zonder wijziging:"
            ),

    }


# =========================================================
# PREVIEW CONTROLEREN
# =========================================================

def validate_preview(
    output: str,
    teams: list[str]
) -> dict[str, int]:

    summary = parse_summary(
        output
    )


    if len(teams) % 2 != 0:

        raise SafetyError(
            "Het aantal competitieteams "
            "is oneven."
        )


    expected_per_round = (
        len(teams) // 2
    )


    if (
        summary["rounds"]
        != summary["tables"]
    ):

        raise SafetyError(
            "Aantal speelrondes en "
            "wedstrijdtabellen komt "
            "niet overeen."
        )


    if (
        summary["rounds"]
        < MIN_ROUNDS
    ):

        raise SafetyError(
            "HZS toont onverwacht minder "
            f"dan {MIN_ROUNDS} speelrondes."
        )


    if (
        summary["source"]
        < MIN_SOURCE_MATCHES
    ):

        raise SafetyError(
            "HZS toont onverwacht minder "
            f"dan {MIN_SOURCE_MATCHES} wedstrijden."
        )


    expected_source_count = (
        summary["rounds"]
        * expected_per_round
    )


    if (
        summary["source"]
        != expected_source_count
    ):

        raise SafetyError(
            "Het aantal wedstrijden past "
            "niet bij het aantal speelrondes. "
            f"Verwacht: {expected_source_count}. "
            f"Gevonden: {summary['source']}."
        )


    counted_total = (
        summary["new"]
        + summary["changed"]
        + summary["unchanged"]
    )


    if (
        counted_total
        != summary["source"]
    ):

        raise SafetyError(
            "De aantallen uit de importer "
            "tellen niet correct op."
        )


    total_changes = (
        summary["new"]
        + summary["changed"]
    )


    if (
        total_changes
        > MAX_TOTAL_CHANGES
    ):

        raise SafetyError(
            "Er veranderen onverwacht veel "
            "wedstrijden tegelijk: "
            f"{total_changes}."
        )


    if (
        summary["new"]
        > MAX_NEW_MATCHES
    ):

        raise SafetyError(
            "Er zijn onverwacht veel "
            "nieuwe wedstrijden gevonden: "
            f"{summary['new']}."
        )


    if (
        "WAARSCHUWINGEN"
        in output
    ):

        raise SafetyError(
            "De importer geeft waarschuwingen. "
            "Automatische publicatie wordt "
            "geblokkeerd."
        )


    return summary


# =========================================================
# WEDSTRIJDEN.JSON CONTROLEREN
# =========================================================

def validate_matches_file(
    data: dict[str, Any],
    teams: list[str]
) -> None:

    matches = data.get(
        "wedstrijden"
    )


    if not isinstance(
        matches,
        list
    ):

        raise SafetyError(
            "wedstrijden.json bevat "
            "geen geldige wedstrijdenlijst."
        )


    if (
        len(matches)
        < MIN_SOURCE_MATCHES
    ):

        raise SafetyError(
            "wedstrijden.json bevat "
            "onverwacht weinig wedstrijden."
        )


    team_set = set(
        teams
    )


    seen_ids = set()


    for match in matches:

        if not isinstance(
            match,
            dict
        ):

            raise SafetyError(
                "Een wedstrijd is geen "
                "geldig JSON-object."
            )


        match_id = match.get(
            "id"
        )


        if (
            not isinstance(
                match_id,
                str
            )
            or not match_id
        ):

            raise SafetyError(
                "Een wedstrijd mist een ID."
            )


        if (
            match_id
            in seen_ids
        ):

            raise SafetyError(
                "Dubbele wedstrijd-ID gevonden: "
                f"{match_id}"
            )


        seen_ids.add(
            match_id
        )


        date = match.get(
            "datum"
        )


        if (
            not isinstance(
                date,
                str
            )
            or not DATE_RE.fullmatch(
                date
            )
        ):

            raise SafetyError(
                "Ongeldige wedstrijddatum bij "
                f"{match_id}."
            )


        home = match.get(
            "thuis"
        )

        away = match.get(
            "uit"
        )


        if (
            home not in team_set
            or away not in team_set
        ):

            raise SafetyError(
                "Onbekend team gevonden bij "
                f"{match_id}."
            )


        if (
            home == away
        ):

            raise SafetyError(
                "Een team speelt tegen zichzelf bij "
                f"{match_id}."
            )


        played = match.get(
            "gespeeld"
        )


        if not isinstance(
            played,
            bool
        ):

            raise SafetyError(
                "Ongeldige gespeeld-status bij "
                f"{match_id}."
            )


        home_goals = match.get(
            "thuisGoals"
        )

        away_goals = match.get(
            "uitGoals"
        )


        if played:

            if (
                not isinstance(
                    home_goals,
                    int
                )
                or isinstance(
                    home_goals,
                    bool
                )
            ):

                raise SafetyError(
                    "Ongeldige thuisgoals bij "
                    f"{match_id}."
                )


            if (
                not isinstance(
                    away_goals,
                    int
                )
                or isinstance(
                    away_goals,
                    bool
                )
            ):

                raise SafetyError(
                    "Ongeldige uitgoals bij "
                    f"{match_id}."
                )


            if not (
                0
                <= home_goals
                <= MAX_GOALS
            ):

                raise SafetyError(
                    "Onwaarschijnlijke thuis-score bij "
                    f"{match_id}."
                )


            if not (
                0
                <= away_goals
                <= MAX_GOALS
            ):

                raise SafetyError(
                    "Onwaarschijnlijke uit-score bij "
                    f"{match_id}."
                )


# =========================================================
# VOOR EN NA VERGELIJKEN
# =========================================================

def compare_before_after(
    before: dict[str, Any],
    after: dict[str, Any]
) -> None:

    before_matches = (
        before["wedstrijden"]
    )

    after_matches = (
        after["wedstrijden"]
    )


    before_by_id = {

        match["id"]:
            match

        for match
        in before_matches

    }


    after_by_id = {

        match["id"]:
            match

        for match
        in after_matches

    }


    removed_ids = (
        set(before_by_id)
        - set(after_by_id)
    )


    if removed_ids:

        raise SafetyError(
            "Bestaande wedstrijden zijn "
            "verdwenen."
        )


    new_ids = (
        set(after_by_id)
        - set(before_by_id)
    )


    if (
        len(new_ids)
        > MAX_NEW_MATCHES
    ):

        raise SafetyError(
            "Na het schrijven zijn te veel "
            "nieuwe wedstrijden gevonden."
        )


    score_corrections = 0


    for (
        match_id,
        old_match
    ) in before_by_id.items():

        new_match = (
            after_by_id[
                match_id
            ]
        )


        if (
            old_match.get(
                "gespeeld"
            )
            is True
            and new_match.get(
                "gespeeld"
            )
            is not True
        ):

            raise SafetyError(
                "Een gespeelde wedstrijd werd "
                "teruggezet naar niet gespeeld: "
                f"{match_id}"
            )


        for field in (
            "datum",
            "thuis",
            "uit"
        ):

            if (
                old_match.get(
                    field
                )
                != new_match.get(
                    field
                )
            ):

                raise SafetyError(
                    "Een bestaande wedstrijd "
                    "veranderde van identiteit: "
                    f"{match_id}"
                )


        if (
            old_match.get(
                "gespeeld"
            )
            is True
        ):

            old_score = (
                old_match.get(
                    "thuisGoals"
                ),
                old_match.get(
                    "uitGoals"
                )
            )


            new_score = (
                new_match.get(
                    "thuisGoals"
                ),
                new_match.get(
                    "uitGoals"
                )
            )


            if (
                old_score
                != new_score
            ):

                score_corrections += 1


    if (
        score_corrections
        > MAX_EXISTING_SCORE_CORRECTIONS
    ):

        raise SafetyError(
            "Er veranderen te veel bestaande "
            "uitslagen tegelijk: "
            f"{score_corrections}."
        )


# =========================================================
# ORIGINEEL HERSTELLEN
# =========================================================

def restore_original(
    original_bytes: bytes
) -> None:

    MATCHES_FILE.write_bytes(
        original_bytes
    )


    print(
        "\nVEILIGHEID: "
        "originele wedstrijden.json "
        "is hersteld."
    )


# =========================================================
# PROGRAMMA
# =========================================================

def main() -> int:

    print(
        "Risdam Seedan veilige updater"
    )

    print(
        "============================="
    )


    site_data = load_json(
        SITE_FILE
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

        raise SafetyError(
            "site.json mist competitie.teams."
        ) from exc


    if not isinstance(
        teams,
        list
    ):

        raise SafetyError(
            "competitie.teams is geen lijst."
        )


    if (
        len(teams)
        < 2
    ):

        raise SafetyError(
            "Te weinig competitieteams."
        )


    before_data = load_json(
        MATCHES_FILE
    )


    validate_matches_file(
        before_data,
        teams
    )


    original_bytes = (
        MATCHES_FILE.read_bytes()
    )


    print(
        "\n1. Veilige preview uitvoeren..."
    )


    preview_output = run_importer(
        write=False
    )


    summary = validate_preview(
        preview_output,
        teams
    )


    print(
        "\nVEILIGHEIDSCHECK PREVIEW: OK"
    )


    if (
        summary["new"] == 0
        and summary["changed"] == 0
    ):

        print(
            "\nAlles is al actueel."
        )

        print(
            "Er hoeft niets gewijzigd "
            "of gepubliceerd te worden."
        )

        return 0


    print(
        "\n2. Wijzigingen zijn veilig genoeg."
    )

    print(
        "Importer mag schrijven..."
    )


    try:

        write_output = run_importer(
            write=True
        )


        validate_preview(
            write_output,
            teams
        )


        after_data = load_json(
            MATCHES_FILE
        )


        validate_matches_file(
            after_data,
            teams
        )


        compare_before_after(
            before_data,
            after_data
        )


    except Exception:

        restore_original(
            original_bytes
        )

        raise


    print(
        "\nVEILIGHEIDSCHECK NA SCHRIJVEN: OK"
    )

    print(
        "De data mag door GitHub "
        "worden gepubliceerd."
    )


    return 0


if __name__ == "__main__":

    try:

        raise SystemExit(
            main()
        )

    except SafetyError as exc:

        print(
            "\nAUTOMATISCHE UPDATE GEBLOKKEERD",
            file=sys.stderr
        )

        print(
            f"Reden: {exc}",
            file=sys.stderr
        )

        print(
            "De bestaande live data "
            "blijft behouden.",
            file=sys.stderr
        )

        raise SystemExit(
            1
        )