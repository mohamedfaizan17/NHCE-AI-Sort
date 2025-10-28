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

export function getSortingAlgorithm(algorithm: string) {
  switch (algorithm) {
    case 'bubbleSort':
      return bubbleSort
    case 'selectionSort':
      return selectionSort
    case 'insertionSort':
      return insertionSort
    default:
      return bubbleSort
  }
}
