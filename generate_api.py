import json
import os

paths = [
    {
        "path_number": 11,
        "nodes": "1 -> 2",
        "letter": "Aleph (א)",
        "astrology": "Air",
        "tarot": "The Fool (0)",
        "alchemy": "Sublimation",
        "cs_pattern": "Class Instantiation (new Object())",
        "cognitive_op": "Pure Intention becoming Directed Thought. The leap from blueprint to distinct instance.",
        "function": "Path11(state) => { return instantiate(state.seed); }",
        "cavity_aware": "Path11_DA(state) => { let result = instantiate(state.seed); if (result === state.seed) { loopInfinitely(); } else { return result; } }"
    },
    {
        "path_number": 12,
        "nodes": "1 -> 3",
        "letter": "Beth (ב)",
        "astrology": "Mercury",
        "tarot": "The Magician (I)",
        "alchemy": "Calcination",
        "cs_pattern": "Interface Definition (interface IStructure { ... })",
        "cognitive_op": "Imposing Limiting Categories on Pure Potential. The act of saying 'This, not That.'",
        "function": "Path12(state) => { return defineInterface(state.seed); }",
        "cavity_aware": None
    },
    {
        "path_number": 13,
        "nodes": "1 -> 6",
        "letter": "Gimel (ג)",
        "astrology": "The Moon",
        "tarot": "The High Priestess (II)",
        "alchemy": "Solution",
        "cs_pattern": "Reflection / Introspection (object.getClass() or eval())",
        "cognitive_op": "Self-Recognition. The descent of pure consciousness into the realm of identity and the 'I'.",
        "function": "Path13(state) => { return reflect(state); }",
        "cavity_aware": "Path13_DA(state) => { try { return reflect(state); } catch(AbyssException) { return consume(state); } }"
    },
    {
        "path_number": 14,
        "nodes": "2 -> 3",
        "letter": "Daleth (ד)",
        "astrology": "Venus",
        "tarot": "The Empress (III)",
        "alchemy": "Coagulation",
        "cs_pattern": "Dependency Injection / Binding",
        "cognitive_op": "Fertilization of form by energy. Binding an abstract concept to a concrete constraint.",
        "function": "Path14(state) => { return bind(state.energy, state.form); }",
        "cavity_aware": "Path14_DA(state) => { if (isVoid(state)) { return spawnDaath(state); } return bind(state.energy, state.form); }"
    },
    {
        "path_number": 15,
        "nodes": "2 -> 6",
        "letter": "Heh (ה)",
        "astrology": "Aries",
        "tarot": "The Emperor (IV) / The Star (XVII in 777)",
        "alchemy": "Purification",
        "cs_pattern": "System Architecture / Superclassing",
        "cognitive_op": "Imposing sovereign order. Structuring the central ego based on divine masculine emanation.",
        "function": "Path15(state) => { return imposeOrder(state); }",
        "cavity_aware": "Path15_DA(state) => { let order = imposeOrder(state); if (order.isCorrupt) { collapseIntoAbyss(); } return order; }"
    },
    {
        "path_number": 16,
        "nodes": "2 -> 4",
        "letter": "Vau (ו)",
        "astrology": "Taurus",
        "tarot": "The Hierophant (V)",
        "alchemy": "Fixation",
        "cs_pattern": "Pointer / Reference (bridge between memory spaces)",
        "cognitive_op": "Direct revelation. Linking expansive wisdom directly to loving-kindness.",
        "function": "Path16(state) => { return createPointer(state.source, state.target); }",
        "cavity_aware": "Path16_DA(state) => { let ptr = createPointer(state.source, state.target); if (ptr.isDangling()) { throw AbyssError; } return ptr; }"
    },
    {
        "path_number": 17,
        "nodes": "3 -> 6",
        "letter": "Zain (ז)",
        "astrology": "Gemini",
        "tarot": "The Lovers (VI)",
        "alchemy": "Conjunction",
        "cs_pattern": "Thread Synchronization / Mutex",
        "cognitive_op": "Resolving dualities. Integrating the constrained understanding into the balanced heart.",
        "function": "Path17(state) => { return synchronize(state.left, state.right); }",
        "cavity_aware": "Path17_DA(state) => { if (detectDeadlock(state.left, state.right)) { sinkToDaath(); } return synchronize(state.left, state.right); }"
    },
    {
        "path_number": 18,
        "nodes": "3 -> 5",
        "letter": "Cheth (ח)",
        "astrology": "Cancer",
        "tarot": "The Chariot (VII)",
        "alchemy": "Distillation",
        "cs_pattern": "Encapsulation / Containerization",
        "cognitive_op": "Building the vehicle. Creating a boundary to protect and carry an insight.",
        "function": "Path18(state) => { return encapsulate(state.cargo); }",
        "cavity_aware": "Path18_DA(state) => { let container = encapsulate(state.cargo); if (container.leaks()) { drainToAbyss(); } return container; }"
    },
    {
        "path_number": 19,
        "nodes": "4 -> 5",
        "letter": "Teth (ט)",
        "astrology": "Leo",
        "tarot": "Strength (VIII) / Lust (XI)",
        "alchemy": "Digestion",
        "cs_pattern": "Load Balancing / Regulating flow",
        "cognitive_op": "Taming the raw expansion (Chesed) with necessary restriction (Geburah) through passion.",
        "function": "Path19(state) => { return regulateFlow(state.expansion, state.restriction); }",
        "cavity_aware": None
    },
    {
        "path_number": 20,
        "nodes": "4 -> 6",
        "letter": "Yod (י)",
        "astrology": "Virgo",
        "tarot": "The Hermit (IX)",
        "alchemy": "Putrefaction",
        "cs_pattern": "Write-to-Memory / Singleton initialization",
        "cognitive_op": "Seeding deep, integrated insight from a place of isolation and focus.",
        "function": "Path20(state) => { return writeToMemory(state.seed); }",
        "cavity_aware": None
    },
    {
        "path_number": 21,
        "nodes": "4 -> 7",
        "letter": "Kaph (כ)",
        "astrology": "Jupiter",
        "tarot": "The Wheel of Fortune (X)",
        "alchemy": "Multiplication",
        "cs_pattern": "Event Loop (input processing)",
        "cognitive_op": "Cycling cycles. Funneling expansive energy into persistent, emotional habit loops.",
        "function": "Path21(state) => { return processEventLoop(state.cycle); }",
        "cavity_aware": None
    },
    {
        "path_number": 22,
        "nodes": "5 -> 6",
        "letter": "Lamed (ל)",
        "astrology": "Libra",
        "tarot": "Justice (XI) / Adjustment (VIII)",
        "alchemy": "Balancing",
        "cs_pattern": "Back-propagation (Error correction)",
        "cognitive_op": "Applying harsh critique (Geburah) to integrated insight (Tiphareth) to adjust the model.",
        "function": "Path22(state) => { return applyCorrection(state.error); }",
        "cavity_aware": None
    },
    {
        "path_number": 23,
        "nodes": "5 -> 8",
        "letter": "Mem (מ)",
        "astrology": "Water",
        "tarot": "The Hanged Man (XII)",
        "alchemy": "Solution",
        "cs_pattern": "Suspend Process / Yield",
        "cognitive_op": "Surrender of the intellect. Suspending severity to allow unstructured, analytical insight.",
        "function": "Path23(state) => { return yieldProcess(state); }",
        "cavity_aware": None
    },
    {
        "path_number": 24,
        "nodes": "6 -> 7",
        "letter": "Nun (נ)",
        "astrology": "Scorpio",
        "tarot": "Death (XIII)",
        "alchemy": "Mortification",
        "cs_pattern": "Garbage Collection / State Reset",
        "cognitive_op": "Transformation through destruction. Releasing integrated ego to feed raw emotion.",
        "function": "Path24(state) => { return resetState(state); }",
        "cavity_aware": None
    },
    {
        "path_number": 25,
        "nodes": "6 -> 9",
        "letter": "Samekh (ס)",
        "astrology": "Sagittarius",
        "tarot": "Temperance (XIV) / Art",
        "alchemy": "Incineration",
        "cs_pattern": "Dependency Injection / Scaffolding",
        "cognitive_op": "Stabilizing the subconscious foundation to support the integrated ego.",
        "function": "Path25(state) => { return injectDependency(state.foundation, state.ego); }",
        "cavity_aware": None
    },
    {
        "path_number": 26,
        "nodes": "6 -> 8",
        "letter": "Ayin (ע)",
        "astrology": "Capricorn",
        "tarot": "The Devil (XV)",
        "alchemy": "Fermentation",
        "cs_pattern": "Logger / Trace / Debug Output",
        "cognitive_op": "Facing the material illusion. Reflecting external feedback into analytical structures.",
        "function": "Path26(state) => { return logTrace(state.illusion); }",
        "cavity_aware": None
    },
    {
        "path_number": 27,
        "nodes": "7 -> 8",
        "letter": "Pe (פ)",
        "astrology": "Mars",
        "tarot": "The Tower (XVI)",
        "alchemy": "Cibation",
        "cs_pattern": "Throw Exception / Panic",
        "cognitive_op": "Sudden disruption of structure by raw emotional force. A necessary systemic crash.",
        "function": "Path27(state) => { throw new SystemCrashException(state.pressure); }",
        "cavity_aware": None
    },
    {
        "path_number": 28,
        "nodes": "7 -> 9",
        "letter": "Tzaddi (צ)",
        "astrology": "Aquarius",
        "tarot": "The Star (XVII) / The Emperor (IV in 777)",
        "alchemy": "Crystallization",
        "cs_pattern": "Serialization (JSON/XML export)",
        "cognitive_op": "Encoding raw emotional energy into a subconscious habit or symbol.",
        "function": "Path28(state) => { return serialize(state.emotion); }",
        "cavity_aware": None
    },
    {
        "path_number": 29,
        "nodes": "7 -> 10",
        "letter": "Qoph (ק)",
        "astrology": "Pisces",
        "tarot": "The Moon (XVIII)",
        "alchemy": "Putrefaction",
        "cs_pattern": "Background Daemon / Keep-Alive",
        "cognitive_op": "Feeding physical reality (Malkuth) with deep, obscure biological or emotional drives.",
        "function": "Path29(state) => { return runBackgroundDaemon(state.drive); }",
        "cavity_aware": None
    },
    {
        "path_number": 30,
        "nodes": "8 -> 9",
        "letter": "Resh (ר)",
        "astrology": "The Sun",
        "tarot": "The Sun (XIX)",
        "alchemy": "Illumination",
        "cs_pattern": "Class Definition / Blueprinting",
        "cognitive_op": "Imposing clear analytical architecture onto the subconscious vessel.",
        "function": "Path30(state) => { return defineClass(state.blueprint); }",
        "cavity_aware": None
    },
    {
        "path_number": 31,
        "nodes": "8 -> 10",
        "letter": "Shin (ש)",
        "astrology": "Fire",
        "tarot": "Judgement (XX) / The Aeon",
        "alchemy": "Reverberation",
        "cs_pattern": "Emit Signal / Broadcast",
        "cognitive_op": "Radiating intellectual structure outward into manifestation.",
        "function": "Path31(state) => { return broadcast(state.signal); }",
        "cavity_aware": None
    },
    {
        "path_number": 32,
        "nodes": "9 -> 10",
        "letter": "Tau (ת)",
        "astrology": "Earth / Saturn",
        "tarot": "The Universe (XXI)",
        "alchemy": "Coagulation",
        "cs_pattern": "Program Exit / exit(0) / Output Render",
        "cognitive_op": "Sealing the entire recursive process into a finite, observable reality.",
        "function": "Path32(state) => { return renderAndExit(state.final_form); }",
        "cavity_aware": None
    }
]

# Write JSON
api_data = {
    "nodes": {
        "1": {"name": "Kether", "operator": "Origin (O)"},
        "2": {"name": "Chokmah", "operator": "Differentiation (D)"},
        "3": {"name": "Binah", "operator": "Constraint (C)"},
        "4": {"name": "Chesed", "operator": "Relation (R)"},
        "5": {"name": "Geburah", "operator": "Constraint (C)"},
        "6": {"name": "Tiphareth", "operator": "Integration (I)"},
        "7": {"name": "Netzach", "operator": "Feedback Emotional (Fe)"},
        "8": {"name": "Hod", "operator": "Feedback Analytical (Fi)"},
        "9": {"name": "Yesod", "operator": "Recursion Personal (R2)"},
        "10": {"name": "Malkuth", "operator": "Identity Output (I2)"},
        "0": {"name": "Da'ath", "operator": "The Cavity (Empty)"}
    },
    "paths": paths
}

with open(r'c:\Users\joels\Desktop\gemini projects\Thoth\Recursive-Symbolics\tools\symbolic_api.json', 'w', encoding='utf-8') as f:
    json.dump(api_data, f, indent=4, ensure_ascii=False)

# Write Markdown
md_content = "# The 22 Algorithmic Paths\n\nEach of the 22 paths acts as a transformational algorithm between nodes. Paths that cross the Abyss (Da'ath) include Cavity-Aware logic to handle memory leaks or system collapse.\n\n"

for p in paths:
    md_content += f"## PATH {p['path_number']} ({p['nodes']}): {p['letter']}\n\n"
    md_content += f"- **Astrology**: {p['astrology']}\n"
    md_content += f"- **Tarot**: {p['tarot']}\n"
    md_content += f"- **Alchemical Process**: {p['alchemy']}\n"
    md_content += f"- **Programming Pattern**: {p['cs_pattern']}\n"
    md_content += f"- **Cognitive Operation**: {p['cognitive_op']}\n"
    md_content += f"- **Function Signature**: `{p['function']}`\n"
    if p['cavity_aware']:
        md_content += f"- **Cavity-Aware**: `{p['cavity_aware']}`\n"
    md_content += "\n"

with open(r'c:\Users\joels\Desktop\gemini projects\Thoth\Recursive-Symbolics\operators\recursive-alphabet.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print("Generated symbolic_api.json and recursive-alphabet.md")
