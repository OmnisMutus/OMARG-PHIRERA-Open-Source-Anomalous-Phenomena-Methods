/**
 * sephiroticSorting.js
 * 
 * Ports the Kabbalistic sorting algorithms to JS generator functions.
 * Yielding the state at each step allows the React UI to animate the Tikun process.
 */

// HOD: Insertion Sort (Step-by-step, meticulous)
export function* insertionSort(arr) {
    let A = [...arr];
    yield { array: [...A], activeIndices: [], description: "Hod: Initiating step-by-step assembly." };
    
    for (let i = 1; i < A.length; i++) {
        let key = A[i];
        let j = i - 1;
        while (j >= 0 && A[j].value > key.value) {
            yield { array: [...A], activeIndices: [j, j + 1], description: `Hod: Analyzing element ${key.value}.` };
            A[j + 1] = A[j];
            j = j - 1;
        }
        A[j + 1] = key;
        yield { array: [...A], activeIndices: [j + 1, i], description: `Hod: Placing ${key.value} in exact order.` };
    }
    yield { array: [...A], activeIndices: [], description: "Hod: Assembly Complete.", complete: true };
}

// GEBURAH: Selection Sort (Harsh discrimination, isolating extremes)
export function* selectionSort(arr) {
    let A = [...arr];
    yield { array: [...A], activeIndices: [], description: "Geburah: Initiating harsh discrimination." };
    
    for (let i = 0; i < A.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < A.length; j++) {
            yield { array: [...A], activeIndices: [minIdx, j], description: `Geburah: Scanning for extreme weakness.` };
            if (A[j].value < A[minIdx].value) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            let temp = A[i];
            A[i] = A[minIdx];
            A[minIdx] = temp;
            yield { array: [...A], activeIndices: [i, minIdx], description: `Geburah: Isolating and extracting ${A[i].value}.` };
        }
    }
    yield { array: [...A], activeIndices: [], description: "Geburah: Weakness purged. Order restored.", complete: true };
}

// CHOKMAH: Quicksort (Recursive partitioning)
export function* quickSort(arr) {
    let A = [...arr];
    yield { array: [...A], activeIndices: [], description: "Chokmah: Initiating recursive partitioning." };
    
    function* qs(low, high) {
        if (low < high) {
            let pi = yield* partition(low, high);
            yield* qs(low, pi - 1);
            yield* qs(pi + 1, high);
        }
    }
    
    function* partition(low, high) {
        let pivot = A[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield { array: [...A], activeIndices: [j, high], description: `Chokmah: Binary decision against pivot ${pivot.value}.` };
            if (A[j].value < pivot.value) {
                i++;
                let temp = A[i];
                A[i] = A[j];
                A[j] = temp;
                yield { array: [...A], activeIndices: [i, j], description: `Chokmah: Partitioning element ${A[i].value}.` };
            }
        }
        let temp = A[i + 1];
        A[i + 1] = A[high];
        A[high] = temp;
        yield { array: [...A], activeIndices: [i + 1, high], description: `Chokmah: Establishing central pivot.` };
        return i + 1;
    }
    
    yield* qs(0, A.length - 1);
    yield { array: [...A], activeIndices: [], description: "Chokmah: Infinite recursion unified.", complete: true };
}

// TIFERETH: Merge Sort (Harmonious integration)
export function* mergeSort(arr) {
    let A = [...arr];
    yield { array: [...A], activeIndices: [], description: "Tifereth: Initiating harmonious integration." };
    
    function* ms(l, r) {
        if (l < r) {
            let m = Math.floor(l + (r - l) / 2);
            yield* ms(l, m);
            yield* ms(m + 1, r);
            yield* merge(l, m, r);
        }
    }
    
    function* merge(l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);
        
        for (let i = 0; i < n1; i++) L[i] = A[l + i];
        for (let j = 0; j < n2; j++) R[j] = A[m + 1 + j];
        
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            yield { array: [...A], activeIndices: [k], description: `Tifereth: Balancing dual forces.` };
            if (L[i].value <= R[j].value) {
                A[k] = L[i];
                i++;
            } else {
                A[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) {
            A[k] = L[i];
            i++;
            k++;
            yield { array: [...A], activeIndices: [k-1], description: `Tifereth: Integrating remainder.` };
        }
        while (j < n2) {
            A[k] = R[j];
            j++;
            k++;
            yield { array: [...A], activeIndices: [k-1], description: `Tifereth: Integrating remainder.` };
        }
    }
    
    yield* ms(0, A.length - 1);
    yield { array: [...A], activeIndices: [], description: "Tifereth: Perfect harmony achieved.", complete: true };
}

export const ALGO_MAP = {
    "Hod": insertionSort,
    "Geburah": selectionSort,
    "Chokmah": quickSort,
    "Tifereth": mergeSort
};
