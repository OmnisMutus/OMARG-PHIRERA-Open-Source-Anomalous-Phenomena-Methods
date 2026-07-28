# OMARG-PHIRERA Alternate Reality Games (ARGs)

This document outlines the two playable ARG prototypes designed to practically demonstrate the Recursive Symbolics framework in a participatory narrative format.

## Prototype 1: The Terminal ARG (Cicada-Style)
**Location:** `games/omarg_terminal.py`

This is a Python command-line puzzle simulating a corrupted terminal left behind by a missing OMARG researcher.

### Mechanics & Solution
1. The script simulates a corrupted log file, displaying hints of a mental loop characterized by "Hod" keywords (analysis, logic, detail, distillation).
2. **The Puzzle:** The player must realize this represents the "Hod" state and determine the balancing operator.
3. **The Tools:** The terminal imports `tools/symbolic_debugger.py`. If the player uses the debugger (or manually checks the `symbolic_api.json`), they will see that the balance for Hod is **Netzach**.
4. **Win Condition:** The player types `netzach` into the `OMARG_SYS>` prompt. The script accepts this case-insensitively and unlocks the next sequence (or prints the victory message).
5. **Loss Condition:** Three incorrect attempts trigger a lockout, generating a SHA-256 hash that can be used as a cross-platform clue.
6. **Hint System:** Typing `hint` reveals the first 3 letters of the required operator.

---

## Prototype 2: The Web ARG (I Love Bees-Style)
**Location:** `games/web_arg/`

A transmedia web prototype built with HTML/CSS/JS, designed to be hosted statically (e.g., via GitHub Pages). It uses dark mode, console typography, and subtle glitch animations to create an immersive, unsettling atmosphere.

### Mechanics & Solution
1. **The Steganography:** The `index.html` file contains a hidden `<pre>` block that is nearly invisible and aria-hidden. It contains a Base64 string: `UEFUSF9JRDogUDEx`.
2. **Decoding:** Decoding this string yields `PATH_ID: P11`.
3. **The API Mapping:** The player must cross-reference `P11` with the canonical `tools/symbolic_api.json`. Path 11 (Kether → Chokmah) is mapped to the standard function `instantiate`.
4. **Win Condition:** Typing `instantiate` into the password field successfully validates the form. The red "Access denied" error disappears, and a hidden link to `secret_document.md` is revealed.
5. **Secondary Clue:** The background image `anomaly_scan.jpg` has text injected at the end of its binary file: `SECONDARY_CLUE: THE SPECTRAL GAP IS 7.4 PERCENT`. This can be found by opening the image in a text editor or using the `strings` command.
