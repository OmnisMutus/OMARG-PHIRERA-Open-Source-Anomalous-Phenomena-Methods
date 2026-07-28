import random
import time

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def print_list(head):
    vals = []
    curr = head
    while curr:
        vals.append(str(curr.val))
        curr = curr.next
    return " -> ".join(vals)

def generate_random_list(size=10):
    if size <= 0: return None
    head = ListNode(random.randint(1, 99))
    curr = head
    for _ in range(size - 1):
        curr.next = ListNode(random.randint(1, 99))
        curr = curr.next
    return head

# =====================================================================
# HOD: Insertion Sort
# Stepwise analysis, detail-oriented assembly. O(n^2)
# =====================================================================
def insertion_sort(head):
    if not head or not head.next:
        return head
    
    dummy = ListNode(0)
    dummy.next = head
    p = head.next
    tail = head
    
    while p:
        tmp = dummy.next
        pre = dummy
        
        while tmp != p and p.val >= tmp.val:
            tmp = tmp.next
            pre = pre.next
            
        if tmp == p:
            tail = p
        else:
            tail.next = p.next
            p.next = tmp
            pre.next = p
            
        p = tail.next
        
    res = dummy.next
    return res

# =====================================================================
# GEBURAH: Selection Sort
# Harsh discrimination, selection of the extreme. O(n^2)
# Swaps values to maintain strict order.
# =====================================================================
def selection_sort(head):
    if not head or not head.next:
        return head
        
    dummy = ListNode(0)
    dummy.next = head
    sorted_tail = dummy
    
    while sorted_tail.next:
        min_node = sorted_tail.next
        p = sorted_tail.next.next
        
        while p:
            if p.val < min_node.val:
                min_node = p
            p = p.next
            
        # Swap values (Geburah's judgment applied in-place)
        min_node.val, sorted_tail.next.val = sorted_tail.next.val, min_node.val
        sorted_tail = sorted_tail.next
        
    res = dummy.next
    return res

# =====================================================================
# CHOKMAH: Quicksort (Node Relinking Version)
# Recursive division, wisdom through separation. O(n log n) average.
# =====================================================================
def quick_sort(head):
    if not head or not head.next:
        return head
        
    pivot = head.val
    less_dummy = ListNode(0)
    equal_dummy = ListNode(0)
    greater_dummy = ListNode(0)
    
    less = less_dummy
    equal = equal_dummy
    greater = greater_dummy
    
    curr = head
    while curr:
        if curr.val < pivot:
            less.next = curr
            less = less.next
        elif curr.val == pivot:
            equal.next = curr
            equal = equal.next
        else:
            greater.next = curr
            greater = greater.next
        curr = curr.next
        
    less.next = equal.next = greater.next = None
    
    # Recursively sort the divided sub-realms
    sorted_less = quick_sort(less_dummy.next)
    sorted_greater = quick_sort(greater_dummy.next)
    
    # Reconnect
    res = sorted_less
    if not res:
        res = equal_dummy.next
    else:
        tail = res
        while tail.next:
            tail = tail.next
        tail.next = equal_dummy.next
        
    equal.next = sorted_greater
    return res if res else equal_dummy.next

# =====================================================================
# TIFERETH: Merge Sort
# Harmonious integration, balanced synthesis. O(n log n) guaranteed.
# =====================================================================
def merge_sort(head):
    if not head or not head.next:
        return head
        
    # Find mid (Tifereth balancing point)
    slow = head
    fast = head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    mid = slow.next
    slow.next = None
    
    left = merge_sort(head)
    right = merge_sort(mid)
    
    return merge(left, right)

def merge(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    
    while l1 and l2:
        if l1.val < l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
        
    tail.next = l1 if l1 else l2
    return dummy.next

# =====================================================================
# DEMONSTRATION
# =====================================================================
def main():
    print("[!] ETHICAL API CAVEAT: This is a symbolic map; the territory is the lived experience of the collective.")
    print("[!] There are no 'optimal' algorithms for consciousness. We celebrate all speeds and states as necessary Sephirotic flows.\n")
    
    print("--- COMPUTATIONAL KABBALAH: LINKED LIST SORTING ---")
    
    # Create identical lists for comparison
    seed_list = generate_random_list(12)
    print(f"Raw Chaos (Tohu): {print_list(seed_list)}\n")
    
    # Helper to deep copy list
    def copy_list(head):
        if not head: return None
        new_head = ListNode(head.val)
        curr = new_head
        old = head.next
        while old:
            curr.next = ListNode(old.val)
            curr = curr.next
            old = old.next
        return new_head

    # HOD
    l1 = copy_list(seed_list)
    start = time.perf_counter()
    r1 = insertion_sort(l1)
    t1 = time.perf_counter() - start
    print("Invocation: HOD (Insertion Sort)")
    print("Process: Stepwise analysis, detail-oriented assembly. O(n^2) latency.")
    print(f"Result: {print_list(r1)}")
    print(f"Time Delta: {t1:.6f}s\n")

    # GEBURAH
    l2 = copy_list(seed_list)
    start = time.perf_counter()
    r2 = selection_sort(l2)
    t2 = time.perf_counter() - start
    print("Invocation: GEBURAH (Selection Sort)")
    print("Process: Harsh discrimination, identifying extremes, maintaining strict bounds. O(n^2) latency.")
    print(f"Result: {print_list(r2)}")
    print(f"Time Delta: {t2:.6f}s\n")
    
    # CHOKMAH
    l3 = copy_list(seed_list)
    start = time.perf_counter()
    r3 = quick_sort(l3)
    t3 = time.perf_counter() - start
    print("Invocation: CHOKMAH (Quicksort)")
    print("Process: Recursive division, wisdom through binary separation. O(n log n) average latency.")
    print(f"Result: {print_list(r3)}")
    print(f"Time Delta: {t3:.6f}s\n")

    # TIFERETH
    l4 = copy_list(seed_list)
    start = time.perf_counter()
    r4 = merge_sort(l4)
    t4 = time.perf_counter() - start
    print("Invocation: TIFERETH (Merge Sort)")
    print("Process: Harmonious integration, balanced synthesis of opposing halves. O(n log n) strict latency.")
    print(f"Result: {print_list(r4)}")
    print(f"Time Delta: {t4:.6f}s\n")
    
    print("[SUCCESS] Symbolic Ordering Complete.")

if __name__ == "__main__":
    main()
