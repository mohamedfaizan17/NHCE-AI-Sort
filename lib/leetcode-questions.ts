export interface LeetCodeQuestion {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  leetcodeUrl: string
  geeksforgeeksUrl?: string
  hackerrankUrl?: string
  difficultyScore: number
  tags: string[]
  description: string
}

export const SORTING_QUESTIONS: Record<string, LeetCodeQuestion[]> = {
  bubbleSort: [
    {
      id: 'sort-array',
      title: 'Sort an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/bubble-sort/1',
      difficultyScore: 5,
      tags: ['Array', 'Sorting', 'Bubble Sort'],
      description: 'Given an array of integers nums, sort the array in ascending order and return it.'
    },
    {
      id: 'sort-colors',
      title: 'Sort Colors',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-colors/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1',
      difficultyScore: 6,
      tags: ['Array', 'Two Pointers', 'Sorting'],
      description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place.'
    },
    {
      id: 'largest-number',
      title: 'Largest Number',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/largest-number/',
      difficultyScore: 7,
      tags: ['Array', 'String', 'Sorting'],
      description: 'Given a list of non-negative integers, arrange them to form the largest number.'
    },
  ],
  selectionSort: [
    {
      id: 'minimum-number-game',
      title: 'Minimum Number Game',
      difficulty: 'Easy',
      leetcodeUrl: 'https://leetcode.com/problems/minimum-number-game/',
      difficultyScore: 4,
      tags: ['Array', 'Sorting', 'Selection Sort'],
      description: 'Alice and Bob play a game with an array of positive integers.'
    },
    {
      id: 'sort-array',
      title: 'Sort an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/',
      difficultyScore: 5,
      tags: ['Array', 'Sorting'],
      description: 'Given an array of integers nums, sort the array in ascending order.'
    },
    {
      id: 'kth-largest-element',
      title: 'Kth Largest Element in an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/kth-largest-element5034/1',
      difficultyScore: 6,
      tags: ['Array', 'Selection', 'Sorting'],
      description: 'Find the kth largest element in an unsorted array.'
    },
  ],
  insertionSort: [
    {
      id: 'insertion-sort-list',
      title: 'Insertion Sort List',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/insertion-sort-list/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/insertion-sort-for-singly-linked-list/1',
      difficultyScore: 6,
      tags: ['Linked List', 'Sorting', 'Insertion Sort'],
      description: 'Sort a linked list using insertion sort.'
    },
    {
      id: 'sort-array',
      title: 'Sort an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/',
      difficultyScore: 5,
      tags: ['Array', 'Sorting'],
      description: 'Given an array of integers nums, sort the array in ascending order.'
    },
    {
      id: 'sort-list',
      title: 'Sort List',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-list/',
      difficultyScore: 7,
      tags: ['Linked List', 'Sorting'],
      description: 'Sort a linked list in O(n log n) time and O(1) space.'
    },
  ],
  mergeSort: [
    {
      id: 'sort-array',
      title: 'Sort an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/',
      difficultyScore: 5,
      tags: ['Array', 'Merge Sort', 'Divide and Conquer'],
      description: 'Given an array of integers nums, sort the array using merge sort.'
    },
    {
      id: 'merge-sorted-array',
      title: 'Merge Sorted Array',
      difficulty: 'Easy',
      leetcodeUrl: 'https://leetcode.com/problems/merge-sorted-array/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1',
      difficultyScore: 4,
      tags: ['Array', 'Two Pointers', 'Sorting'],
      description: 'Merge two sorted arrays into one sorted array.'
    },
    {
      id: 'sort-list',
      title: 'Sort List',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-list/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/sort-a-linked-list/1',
      difficultyScore: 7,
      tags: ['Linked List', 'Merge Sort', 'Divide and Conquer'],
      description: 'Sort a linked list using merge sort in O(n log n) time.'
    },
    {
      id: 'count-inversions',
      title: 'Count of Smaller Numbers After Self',
      difficulty: 'Hard',
      leetcodeUrl: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1',
      difficultyScore: 8,
      tags: ['Array', 'Merge Sort', 'Binary Indexed Tree'],
      description: 'Count inversions in an array using merge sort.'
    },
  ],
  quickSort: [
    {
      id: 'sort-array',
      title: 'Sort an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/',
      difficultyScore: 5,
      tags: ['Array', 'Quick Sort', 'Divide and Conquer'],
      description: 'Given an array of integers nums, sort the array using quick sort.'
    },
    {
      id: 'kth-largest-element',
      title: 'Kth Largest Element in an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/kth-largest-element5034/1',
      hackerrankUrl: 'https://www.hackerrank.com/challenges/find-the-median/problem',
      difficultyScore: 6,
      tags: ['Array', 'Quick Select', 'Divide and Conquer'],
      description: 'Find the kth largest element using quick select algorithm.'
    },
    {
      id: 'sort-colors',
      title: 'Sort Colors',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-colors/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1',
      difficultyScore: 6,
      tags: ['Array', 'Two Pointers', 'Quick Sort'],
      description: 'Sort an array with three distinct values using Dutch National Flag algorithm.'
    },
    {
      id: 'wiggle-sort-ii',
      title: 'Wiggle Sort II',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/wiggle-sort-ii/',
      difficultyScore: 8,
      tags: ['Array', 'Quick Select', 'Sorting'],
      description: 'Reorder array such that nums[0] < nums[1] > nums[2] < nums[3]...'
    },
  ],
  heapSort: [
    {
      id: 'sort-array',
      title: 'Sort an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/',
      difficultyScore: 5,
      tags: ['Array', 'Heap Sort', 'Heap'],
      description: 'Given an array of integers nums, sort the array using heap sort.'
    },
    {
      id: 'kth-largest-element',
      title: 'Kth Largest Element in an Array',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/kth-largest-element5034/1',
      difficultyScore: 6,
      tags: ['Array', 'Heap', 'Priority Queue'],
      description: 'Find the kth largest element using a heap.'
    },
    {
      id: 'top-k-frequent',
      title: 'Top K Frequent Elements',
      difficulty: 'Medium',
      leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/top-k-frequent-elements-in-array/1',
      difficultyScore: 7,
      tags: ['Array', 'Heap', 'Hash Table'],
      description: 'Find the k most frequent elements using a heap.'
    },
    {
      id: 'merge-k-sorted-lists',
      title: 'Merge k Sorted Lists',
      difficulty: 'Hard',
      leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
      geeksforgeeksUrl: 'https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1',
      difficultyScore: 8,
      tags: ['Linked List', 'Heap', 'Merge Sort'],
      description: 'Merge k sorted linked lists using a min heap.'
    },
  ],
}
