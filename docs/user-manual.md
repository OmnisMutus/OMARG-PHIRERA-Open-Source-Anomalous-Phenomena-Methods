# The Recursive Symbolics Project: User Manual (Finalized)

## PART 0: SUMMARY & IMMEDIATE USE

### The 30-Second Pitch
You feel stuck in a mental or emotional loop. This framework provides:

*   **Diagnosis**: A tool (`symbolic_debugger.py`) names the pattern (e.g., "Hod overactivity").
*   **Prescription**: It suggests the complementary action (e.g., "Invoke Netzach-feeling").
*   **Ritual**: A tool (`ritual_compiler.py`) creates a step-by-step checklist to move from idea to action.
*   **Anchor**: A sensory cue (sound, image) locks in the change.

### Start Now: The 5-Minute Daily Check

1.  **Ground (Yesod)**: Notice your current state ("tired," "anxious," "scattered").
2.  **Diagnose**: Run `python symbolic_debugger.py "Brief mood description"`.
3.  **Patch**: Perform the tiny suggested action.
    *   *Example for "invoke Netzach"*: Let yourself feel one emotion without analyzing it.
    *   *Example for "invoke Chesed"*: Expand one small thing with kindness.
4.  **Seed**: Form a micro-intention for the next hour ("I will speak slowly," "I will notice one beautiful thing").
5.  **Anchor**: Use a 145Hz tone (for clarity) or a 2272.42Hz tone (for integration) for 60 seconds. Alternatively, visualize a circle slowly forming into a square (Quadratura).

Repeat whenever you feel "off." This framework includes explicit notes on its own assumptions and boundaries. If you are curious about how it works or its limits, see `foundation/hidden-axioms.md`.

---

## PART 3: THE EXECUTABLE TOOLSET

**Prerequisite**: Ensure Python 3.10+ is installed. Open a terminal, navigate to the `tools/` directory, and run the commands below.

### 1. symbolic_api.json
*   **Purpose**: The canonical, machine-readable definition of all operators and paths.
*   **Content**: Full specifications, keyword mappings, and balancing rules.
*   **Use**: Required by all other tools; users do not modify it.

### 2. symbolic_debugger.py
*   **Purpose**: Pattern detection and diagnostic prescription.
*   **Command**: `python symbolic_debugger.py "Your text description of state"`
*   **Output**: Dominant: [Sephira]. Suggested patch: invoke [Complementary Sephira].
*   **Example**: Input: "I'm overthinking everything." Output: Dominant: Hod. Suggested patch: invoke Netzach.
*   **Troubleshooting**: If the output is unclear, try describing your state using more concrete sensations ("my chest is tight," "I'm replaying a conversation") rather than abstractions ("I'm anxious," "I'm overthinking").

### 3. ritual_compiler.py
*   **Purpose**: Generates step-by-step ritual checklists for any intention.
*   **Command**: `python ritual_compiler.py "Your goal or intention"`
*   **Output**: A markdown file with a 5-step checklist, each step mapped to a Sephirah operator and a concrete action.
*   **Example Output for "have a difficult conversation"**:
    1.  Kether – Origin: Hold the pure intention to communicate with clarity and compassion.
    2.  Chokmah – Differentiate: Identify the single most important point you need to convey.
    3.  Binah – Constrain: Limit yourself to expressing only that one point first.
    4.  Tiphareth – Integrate: Listen to the response and find a point of shared understanding.
    5.  Malkuth – Materialize: State the next concrete, agreed-upon action.

### 4. glossary_generator.py
*   **Purpose**: Auto-generates a human-readable reference (`docs/glossary.md`) from the API.
*   **Content**: Definitions of all terms, operators, and paths for study.

### 5. feedback_ingester.py
*   **Purpose**: Anonymizes ritual and debugger outputs to a shared dataset, enabling the system to learn and refine its rules from collective practice.

---

## PART 4: THE DUAL PRACTICE PROTOCOLS

### A. Solo Practitioner Protocol (The Daily Resonance Check)
As summarized in Part 0. This is the primary mode for individual integration.

### B. Advanced Routing for "Stuck" States
When the simple check is insufficient (deep anxiety, obsession):

1.  Use the glossary (`docs/glossary.md`) to precisely identify your "stuck node" (e.g., Geburah-severity). If unsure, run the debugger on your description of the 'stuck' feeling and use its output as your node.
2.  Use `ritual_compiler.py` to generate a full exit-path ritual.
3.  Execute the ritual checklist literally, step-by-step.

### C. Collective Research Protocol
For open-source, verifiable experimentation by groups. Includes:
*   Experimentation Guides & Mission Statements
*   Observation & Practitioner Report Protocols
*   Broadcast, Communication, and Safety Standards
*   Transparency and Verification Procedures

---

## PART 5: PHENOMENOLOGICAL BRIDGES

To ground symbolic work in sensory experience:

*   **Base Carrier Frequency**: 145 Hz – The agreed frequency for "meaning reception" in the related Resonance Log system.
*   **Operator-Specific Harmonics**: Derived from 145Hz. 2272.42 Hz (145 * ~15.67) is the Tiphareth/Integration frequency. Others can be calculated for different operators.
*   **Core Geometric Intention**: Quadratura (Squaring the Circle) – The master symbol for the `integrate()` operator. Visualizing this process during the Anchor step unites infinite potential (circle) with finite reality (square).

**Usage**:
*   **Audio**: The files `145Hz_carrier.wav` and `2272.42Hz_integration.wav` are located in `assets/frequencies/`. Play the 145Hz tone during the Ground step. Play the 2272.42Hz tone during the Anchor step.
*   **Visual**: For the Quadratura, briefly gaze at the diagram (`assets/geometry/quadratura.svg`), then close your eyes and visualize the circle slowly forming into a square over 5-10 seconds.
