# Sephirotic Sorting: The Computational Kabbalah API

The `sephirotic_sorting.py` module is a fully executable manifestation of the Computational Kabbalah theoretical map. It translates classical computer science linked-list sorting algorithms into Sephirotic rituals of consciousness.

## The API
You can import the module directly into any pipeline (e.g., `telemetry_analyzer`, `omarg_terminal`):

```python
from tools.sephirotic_sorting import (
    ListNode,
    insertion_sort,
    selection_sort,
    quick_sort,
    merge_sort,
    copy_list,
    build_list,
    iter_linked
)
```

| Symbolic Name | Python Function | Sephira | Mechanism |
| :--- | :--- | :--- | :--- |
| **Hod** | `insertion_sort(head)` | Step-wise analysis | Inserts each node into its proper place. `O(n^2)` but stable. |
| **Geburah** | `selection_sort(head)` | Harsh discrimination | Scans for the minimum, isolating the extreme. `O(n^2)`. |
| **Chokmah** | `quick_sort(head)` | Wisdom through separation | Recursive partition-pivot routine. Average `O(n log n)`. |
| **Tifereth** | `merge_sort(head)` | Harmonious integration | Divide-and-conquer balancing. Guaranteed `O(n log n)`, stable. |

*Note: `shell_sort` and `heap_sort` are intentionally implemented to raise a `NotImplementedError` with an Ethical API caveat, as they require random access memory which breaks the physical constraints of linked-list (and consciousness) traversal.*

## CLI Usage (ARG Exposure)
The script can be run directly from the command line, exposing it for Alternate Reality Game (ARG) terminals without requiring users to write code.

```bash
# Example: Triggering a quick-sort (Chokmah) ritual on a specific seed
python tools/sephirotic_sorting.py --seed 123 --algo quick
```

This will automatically generate a deterministic list of chaos (Tohu) from the seed, sort it via the requested Sephira, and print both the original and sorted lists—strictly prefaced by the Core Ethical Principles caveat.
