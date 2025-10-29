// Sorting algorithm implementations that yield animation steps

export interface SortStep {
  data: number[]
  focusIndices: number[]
  state: 'comparing' | 'swapping' | 'sorted' | 'idle'
}

export function* bubbleSort(arr: number[]): Generator<SortStep> {
  const data = [...arr]
  const n = data.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing
      yield {
        data: [...data],
        focusIndices: [j, j + 1],
        state: 'comparing',
      }

      if (data[j] > data[j + 1]) {
        // Show swap state BEFORE swapping
        yield {
          data: [...data],
          focusIndices: [j, j + 1],
          state: 'swapping',
        }
        
        // Perform the swap
        ;[data[j], data[j + 1]] = [data[j + 1], data[j]]
        
        // Show swapped result
        yield {
          data: [...data],
          focusIndices: [j, j + 1],
          state: 'swapping',
        }
      }
    }
  }

  // Sorted
  yield {
    data: [...data],
    focusIndices: [],
    state: 'sorted',
  }
}

export function* selectionSort(arr: number[]): Generator<SortStep> {
  const data = [...arr]
  const n = data.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    for (let j = i + 1; j < n; j++) {
      yield {
        data: [...data],
        focusIndices: [minIdx, j],
        state: 'comparing',
      }

      if (data[j] < data[minIdx]) {
        minIdx = j
      }
    }

    if (minIdx !== i) {
      // Show swap state BEFORE swapping
      yield {
        data: [...data],
        focusIndices: [i, minIdx],
        state: 'swapping',
      }
      
      // Perform the swap
      ;[data[i], data[minIdx]] = [data[minIdx], data[i]]
      
      // Show swapped result
      yield {
        data: [...data],
        focusIndices: [i, minIdx],
        state: 'swapping',
      }
    }
  }

  yield {
    data: [...data],
    focusIndices: [],
    state: 'sorted',
  }
}

export function* insertionSort(arr: number[]): Generator<SortStep> {
  const data = [...arr]
  const n = data.length

  for (let i = 1; i < n; i++) {
    const key = data[i]
    let j = i - 1

    yield {
      data: [...data],
      focusIndices: [i],
      state: 'comparing',
    }

    while (j >= 0 && data[j] > key) {
      yield {
        data: [...data],
        focusIndices: [j, j + 1],
        state: 'comparing',
      }

      data[j + 1] = data[j]
      yield {
        data: [...data],
        focusIndices: [j, j + 1],
        state: 'swapping',
      }
      j--
    }
    data[j + 1] = key
  }

  yield {
    data: [...data],
    focusIndices: [],
    state: 'sorted',
  }
}

export function* mergeSort(arr: number[]): Generator<SortStep> {
  const data = [...arr]
  
  function* merge(left: number, mid: number, right: number): Generator<SortStep> {
    const leftArr = data.slice(left, mid + 1)
    const rightArr = data.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left
    
    while (i < leftArr.length && j < rightArr.length) {
      yield {
        data: [...data],
        focusIndices: [left + i, mid + 1 + j],
        state: 'comparing',
      }
      
      if (leftArr[i] <= rightArr[j]) {
        data[k] = leftArr[i]
        i++
      } else {
        data[k] = rightArr[j]
        j++
      }
      
      yield {
        data: [...data],
        focusIndices: [k],
        state: 'swapping',
      }
      k++
    }
    
    while (i < leftArr.length) {
      data[k] = leftArr[i]
      yield {
        data: [...data],
        focusIndices: [k],
        state: 'swapping',
      }
      i++
      k++
    }
    
    while (j < rightArr.length) {
      data[k] = rightArr[j]
      yield {
        data: [...data],
        focusIndices: [k],
        state: 'swapping',
      }
      j++
      k++
    }
  }
  
  function* mergeSortHelper(left: number, right: number): Generator<SortStep> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      yield* mergeSortHelper(left, mid)
      yield* mergeSortHelper(mid + 1, right)
      yield* merge(left, mid, right)
    }
  }
  
  yield* mergeSortHelper(0, data.length - 1)
  
  yield {
    data: [...data],
    focusIndices: [],
    state: 'sorted',
  }
}

export function* quickSort(arr: number[]): Generator<SortStep> {
  const data = [...arr]
  
  function* partition(low: number, high: number): Generator<SortStep, number> {
    const pivot = data[high]
    let i = low - 1
    
    yield {
      data: [...data],
      focusIndices: [high],
      state: 'comparing',
    }
    
    for (let j = low; j < high; j++) {
      yield {
        data: [...data],
        focusIndices: [j, high],
        state: 'comparing',
      }
      
      if (data[j] < pivot) {
        i++
        if (i !== j) {
          yield {
            data: [...data],
            focusIndices: [i, j],
            state: 'swapping',
          }
          ;[data[i], data[j]] = [data[j], data[i]]
          yield {
            data: [...data],
            focusIndices: [i, j],
            state: 'swapping',
          }
        }
      }
    }
    
    yield {
      data: [...data],
      focusIndices: [i + 1, high],
      state: 'swapping',
    }
    ;[data[i + 1], data[high]] = [data[high], data[i + 1]]
    yield {
      data: [...data],
      focusIndices: [i + 1, high],
      state: 'swapping',
    }
    
    return i + 1
  }
  
  function* quickSortHelper(low: number, high: number): Generator<SortStep> {
    if (low < high) {
      const pi = yield* partition(low, high)
      yield* quickSortHelper(low, pi - 1)
      yield* quickSortHelper(pi + 1, high)
    }
  }
  
  yield* quickSortHelper(0, data.length - 1)
  
  yield {
    data: [...data],
    focusIndices: [],
    state: 'sorted',
  }
}

export function* heapSort(arr: number[]): Generator<SortStep> {
  const data = [...arr]
  const n = data.length
  
  function* heapify(n: number, i: number): Generator<SortStep> {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2
    
    if (left < n) {
      yield {
        data: [...data],
        focusIndices: [largest, left],
        state: 'comparing',
      }
      
      if (data[left] > data[largest]) {
        largest = left
      }
    }
    
    if (right < n) {
      yield {
        data: [...data],
        focusIndices: [largest, right],
        state: 'comparing',
      }
      
      if (data[right] > data[largest]) {
        largest = right
      }
    }
    
    if (largest !== i) {
      yield {
        data: [...data],
        focusIndices: [i, largest],
        state: 'swapping',
      }
      ;[data[i], data[largest]] = [data[largest], data[i]]
      yield {
        data: [...data],
        focusIndices: [i, largest],
        state: 'swapping',
      }
      yield* heapify(n, largest)
    }
  }
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i)
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    yield {
      data: [...data],
      focusIndices: [0, i],
      state: 'swapping',
    }
    ;[data[0], data[i]] = [data[i], data[0]]
    yield {
      data: [...data],
      focusIndices: [0, i],
      state: 'swapping',
    }
    yield* heapify(i, 0)
  }
  
  yield {
    data: [...data],
    focusIndices: [],
    state: 'sorted',
  }
}

export function getSortingAlgorithm(algorithm: string) {
  switch (algorithm) {
    case 'bubbleSort':
      return bubbleSort
    case 'selectionSort':
      return selectionSort
    case 'insertionSort':
      return insertionSort
    case 'mergeSort':
      return mergeSort
    case 'quickSort':
      return quickSort
    case 'heapSort':
      return heapSort
    default:
      return bubbleSort
  }
}
