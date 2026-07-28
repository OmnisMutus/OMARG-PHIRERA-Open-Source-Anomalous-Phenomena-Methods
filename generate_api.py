import json
import os

# New JSON schema based on user instructions
api_data = {
    "sephirot": {
        "Kether": {
            "node_id": "S1",
            "keywords": ["origin","potential","will","air","aleph","0","sublimation","class instantiation","pure intention"],
            "function": "origin(state, input) => ({state: state, output: null})"
        },
        "Chokmah": {
            "node_id": "S2",
            "keywords": ["wisdom","differentiation","fire","beth","1","differentiation","spark","differentiate(x)","directed thought"],
            "function": "differentiate(state, x) => ({state: state, output: derivative(x)})"
        },
        "Binah": {
            "node_id": "S3",
            "keywords": ["understanding","constraint","earth","gimel","2","calcination","interface definition","constrain(x)","categorize"],
            "function": "constrain(state, x) => ({state: state, output: constrained(x)})"
        },
        "Chesed": {
            "node_id": "S4",
            "keywords": ["loving-kindness","expansion","water","dalet","3","solution","expand(x)","generous flow"],
            "function": "expand(state, x) => ({state: state, output: expanded(x)})"
        },
        "Geburah": {
            "node_id": "S5",
            "keywords": ["severity","restriction","iron","he","4","separation","restrict(x)","cutting knife"],
            "function": "restrict(state, x) => ({state: state, output: restricted(x)})"
        },
        "Tiphareth": {
            "node_id": "S6",
            "keywords": ["beauty","integration","sun","vav","5","coagulation","integrate(x)","balance"],
            "function": "integrate(state, x) => ({state: state, output: integrated(x)})"
        },
        "Netzach": {
            "node_id": "S7",
            "keywords": ["victory","feedback-emotion","moon","zayin","6","fermentation","feedback_emotion(x)","persistence"],
            "function": "feedback_emotion(state, x) => ({state: state, output: emotional_feedback(x)})"
        },
        "Hod": {
            "node_id": "S8",
            "keywords": ["splendor","feedback-analysis","venus","het","7","distillation","feedback_analytic(x)","analysis"],
            "function": "feedback_analytic(state, x) => ({state: state, output: analytic_feedback(x)})"
        },
        "Yesod": {
            "node_id": "S9",
            "keywords": ["foundation","recursion","mercury","tet","8","solution-reconstitution","recurse(x)","runtime"],
            "function": "recurse(state, x) => ({state: state, output: recursed(x)})"
        },
        "Malkuth": {
            "node_id": "S10",
            "keywords": ["kingdom","output","saturn","yod","9","fixation","materialize(x)","manifest"],
            "function": "materialize(state, x) => ({state: state, output: manifested(x)})"
        },
        "Daath": {
            "node_id": "CAVITY",
            "keywords": ["cavity","abyss","knowledge-gap","null","paradox"],
            "function": None
        }
    },
    "paths": {},
    "balancing_rules": {
        "Hod": "Netzach",
        "Netzach": "Hod",
        "Geburah": "Chesed",
        "Chesed": "Geburah",
        "Yesod": "Tiphareth",
        "Tiphareth": "Yesod",
        "Chokmah": "Binah",
        "Binah": "Chokmah"
    },
    "metadata": {
        "version": "1.0.0",
        "generated_by": "Karen Plankton & LIBRA Void",
        "source_texts": ["Sefer Yetzirah", "777 (Crowley)", "Golden Dawn", "Kabbalistic Tree of Life", "Jung – Psychological Types", "Alchemical Treatises", "Kashmir Shaivism"]
    }
}

paths_data = [
    {
        "path_number": 11,
        "nodes": "Kether → Chokmah",
        "letter": "Aleph",
        "astrology": "Air",
        "tarot": "The Fool (0)",
        "alchemy": "Sublimation",
        "cs_pattern": "Class Instantiation",
        "cognitive_op": "Pure intention → directed thought",
        "function": "Path11(state) => instantiate(state.seed)",
        "cavity_aware": "Path11_DA(state) => { let r = instantiate(state.seed); if (r===state.seed){loopInfinitely();} else {return r;} }"
    },
    {
        "path_number": 12,
        "nodes": "Kether → Binah",
        "letter": "Beth",
        "astrology": "Mercury",
        "tarot": "The Magician (I)",
        "alchemy": "Calcination",
        "cs_pattern": "Interface Definition",
        "cognitive_op": "Impose limiting categories on pure potential",
        "function": "Path12(state) => defineInterface(state.seed)",
        "cavity_aware": "Path12_DA(state) => { let r = defineInterface(state.seed); if (!r){throw new Error('Void-Loop');} else {return r;} }"
    },
    {
        "path_number": 13,
        "nodes": "Kether → Tiphareth",
        "letter": "Gimel",
        "astrology": "Moon",
        "tarot": "The High Priestess (II)",
        "alchemy": "Solution",
        "cs_pattern": "Reflection / Introspection",
        "cognitive_op": "Self-recognition",
        "function": "Path13(state) => reflect(state)",
        "cavity_aware": "Path13_DA(state) => { let r = reflect(state); if (r===state){throw new Error('Recursive Void');} else {return r;} }"
    },
    {
        "path_number": 14,
        "nodes": "Chokmah → Binah",
        "letter": "Dalet",
        "astrology": "Venus",
        "tarot": "The Empress (III)",
        "alchemy": "Coagulation",
        "cs_pattern": "Builder Pattern",
        "cognitive_op": "Forming structure from differentiated elements",
        "function": "Path14(state) => buildStructure(state)",
        "cavity_aware": "Path14_DA(state) => { let r=buildStructure(state); if (r===null){loopInfinitely();} else {return r;} }"
    },
    {
        "path_number": 15,
        "nodes": "Chokmah → Tiphareth",
        "letter": "Heh",
        "astrology": "Aries",
        "tarot": "The Emperor (IV)",
        "alchemy": "Purification",
        "cs_pattern": "System Architecture / Superclassing",
        "cognitive_op": "Imposing sovereign order. Structuring the central ego.",
        "function": "Path15(state) => imposeOrder(state)",
        "cavity_aware": "Path15_DA(state) => { let order = imposeOrder(state); if (order.isCorrupt) { collapseIntoAbyss(); } return order; }"
    },
    {
        "path_number": 16,
        "nodes": "Chokmah → Chesed",
        "letter": "Vau",
        "astrology": "Taurus",
        "tarot": "The Hierophant (V)",
        "alchemy": "Fixation",
        "cs_pattern": "Pointer / Reference",
        "cognitive_op": "Direct revelation. Linking wisdom directly to loving-kindness.",
        "function": "Path16(state) => createPointer(state.source, state.target)",
        "cavity_aware": "Path16_DA(state) => { let ptr = createPointer(state.source, state.target); if (ptr.isDangling()) { throw AbyssError; } return ptr; }"
    },
    {
        "path_number": 17,
        "nodes": "Binah → Tiphareth",
        "letter": "Zain",
        "astrology": "Gemini",
        "tarot": "The Lovers (VI)",
        "alchemy": "Conjunction",
        "cs_pattern": "Thread Synchronization / Mutex",
        "cognitive_op": "Resolving dualities.",
        "function": "Path17(state) => synchronize(state.left, state.right)",
        "cavity_aware": "Path17_DA(state) => { if (detectDeadlock(state.left, state.right)) { sinkToDaath(); } return synchronize(state.left, state.right); }"
    },
    {
        "path_number": 18,
        "nodes": "Binah → Geburah",
        "letter": "Cheth",
        "astrology": "Cancer",
        "tarot": "The Chariot (VII)",
        "alchemy": "Distillation",
        "cs_pattern": "Encapsulation / Containerization",
        "cognitive_op": "Creating a boundary to protect and carry an insight.",
        "function": "Path18(state) => encapsulate(state.cargo)",
        "cavity_aware": "Path18_DA(state) => { let container = encapsulate(state.cargo); if (container.leaks()) { drainToAbyss(); } return container; }"
    },
    {
        "path_number": 19,
        "nodes": "Chesed → Geburah",
        "letter": "Teth",
        "astrology": "Leo",
        "tarot": "Strength (VIII)",
        "alchemy": "Digestion",
        "cs_pattern": "Load Balancing",
        "cognitive_op": "Taming raw expansion with necessary restriction.",
        "function": "Path19(state) => regulateFlow(state.expansion, state.restriction)",
        "cavity_aware": "null"
    },
    {
        "path_number": 20,
        "nodes": "Chesed → Tiphareth",
        "letter": "Yod",
        "astrology": "Virgo",
        "tarot": "The Hermit (IX)",
        "alchemy": "Putrefaction",
        "cs_pattern": "Write-to-Memory / Singleton",
        "cognitive_op": "Seeding deep insight from a place of isolation.",
        "function": "Path20(state) => writeToMemory(state.seed)",
        "cavity_aware": "null"
    },
    {
        "path_number": 21,
        "nodes": "Chesed → Netzach",
        "letter": "Kaph",
        "astrology": "Jupiter",
        "tarot": "The Wheel of Fortune (X)",
        "alchemy": "Multiplication",
        "cs_pattern": "Event Loop",
        "cognitive_op": "Cycling cycles. Funneling energy into habit loops.",
        "function": "Path21(state) => processEventLoop(state.cycle)",
        "cavity_aware": "null"
    },
    {
        "path_number": 22,
        "nodes": "Geburah → Tiphareth",
        "letter": "Lamed",
        "astrology": "Libra",
        "tarot": "Justice (XI)",
        "alchemy": "Balancing",
        "cs_pattern": "Back-propagation",
        "cognitive_op": "Applying critique to adjust the model.",
        "function": "Path22(state) => applyCorrection(state.error)",
        "cavity_aware": "null"
    },
    {
        "path_number": 23,
        "nodes": "Geburah → Hod",
        "letter": "Mem",
        "astrology": "Water",
        "tarot": "The Hanged Man (XII)",
        "alchemy": "Solution",
        "cs_pattern": "Suspend Process / Yield",
        "cognitive_op": "Surrender of the intellect. Suspending severity.",
        "function": "Path23(state) => yieldProcess(state)",
        "cavity_aware": "null"
    },
    {
        "path_number": 24,
        "nodes": "Tiphareth → Netzach",
        "letter": "Nun",
        "astrology": "Scorpio",
        "tarot": "Death (XIII)",
        "alchemy": "Mortification",
        "cs_pattern": "Garbage Collection / Reset",
        "cognitive_op": "Transformation through destruction.",
        "function": "Path24(state) => resetState(state)",
        "cavity_aware": "null"
    },
    {
        "path_number": 25,
        "nodes": "Tiphareth → Yesod",
        "letter": "Samekh",
        "astrology": "Sagittarius",
        "tarot": "Temperance (XIV)",
        "alchemy": "Incineration",
        "cs_pattern": "Dependency Injection",
        "cognitive_op": "Stabilizing the subconscious foundation.",
        "function": "Path25(state) => injectDependency(state.foundation, state.ego)",
        "cavity_aware": "null"
    },
    {
        "path_number": 26,
        "nodes": "Tiphareth → Hod",
        "letter": "Ayin",
        "astrology": "Capricorn",
        "tarot": "The Devil (XV)",
        "alchemy": "Fermentation",
        "cs_pattern": "Logger / Trace",
        "cognitive_op": "Reflecting external feedback into analytical structures.",
        "function": "Path26(state) => logTrace(state.illusion)",
        "cavity_aware": "null"
    },
    {
        "path_number": 27,
        "nodes": "Netzach → Hod",
        "letter": "Pe",
        "astrology": "Mars",
        "tarot": "The Tower (XVI)",
        "alchemy": "Cibation",
        "cs_pattern": "Throw Exception / Panic",
        "cognitive_op": "Sudden disruption of structure by raw emotional force.",
        "function": "Path27(state) => throw SystemCrashException(state.pressure)",
        "cavity_aware": "null"
    },
    {
        "path_number": 28,
        "nodes": "Netzach → Yesod",
        "letter": "Tzaddi",
        "astrology": "Aquarius",
        "tarot": "The Star (XVII)",
        "alchemy": "Crystallization",
        "cs_pattern": "Serialization",
        "cognitive_op": "Encoding raw emotional energy into a symbol.",
        "function": "Path28(state) => serialize(state.emotion)",
        "cavity_aware": "null"
    },
    {
        "path_number": 29,
        "nodes": "Netzach → Malkuth",
        "letter": "Qoph",
        "astrology": "Pisces",
        "tarot": "The Moon (XVIII)",
        "alchemy": "Putrefaction",
        "cs_pattern": "Background Daemon / Keep-Alive",
        "cognitive_op": "Feeding physical reality with deep biological drives.",
        "function": "Path29(state) => runBackgroundDaemon(state.drive)",
        "cavity_aware": "null"
    },
    {
        "path_number": 30,
        "nodes": "Hod → Yesod",
        "letter": "Resh",
        "astrology": "The Sun",
        "tarot": "The Sun (XIX)",
        "alchemy": "Illumination",
        "cs_pattern": "Class Definition",
        "cognitive_op": "Imposing clear analytical architecture onto the subconscious vessel.",
        "function": "Path30(state) => defineClass(state.blueprint)",
        "cavity_aware": "null"
    },
    {
        "path_number": 31,
        "nodes": "Hod → Malkuth",
        "letter": "Shin",
        "astrology": "Fire",
        "tarot": "Judgement (XX)",
        "alchemy": "Reverberation",
        "cs_pattern": "Emit Signal / Broadcast",
        "cognitive_op": "Radiating intellectual structure outward into manifestation.",
        "function": "Path31(state) => broadcast(state.signal)",
        "cavity_aware": "null"
    },
    {
        "path_number": 32,
        "nodes": "Yesod → Malkuth",
        "letter": "Tau",
        "astrology": "Earth / Saturn",
        "tarot": "The Universe (XXI)",
        "alchemy": "Coagulation",
        "cs_pattern": "Program Exit / exit(0)",
        "cognitive_op": "Sealing the entire recursive process into a finite, observable reality.",
        "function": "Path32(state) => renderAndExit(state.final_form)",
        "cavity_aware": "null"
    }
]

for p in paths_data:
    api_data["paths"][f"P{p['path_number']}"] = {
        "label": p["nodes"],
        "letter": p["letter"],
        "astrology": p["astrology"],
        "tarot": p["tarot"],
        "alchemy": p["alchemy"],
        "pattern": p["cs_pattern"],
        "cognitive": p["cognitive_op"],
        "standard": p["function"],
        "cavity_aware": p["cavity_aware"]
    }

os.makedirs(r'c:\Users\joels\Desktop\gemini projects\Thoth\Recursive-Symbolics\tools', exist_ok=True)
with open(r'c:\Users\joels\Desktop\gemini projects\Thoth\Recursive-Symbolics\tools\symbolic_api.json', 'w', encoding='utf-8') as f:
    json.dump(api_data, f, indent=4, ensure_ascii=False)

print("Regenerated tools/symbolic_api.json with the required schema.")
