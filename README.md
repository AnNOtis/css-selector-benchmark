# css-selector-benchmark

## Device

MacBook Pro (15-inch, 2019)
CPU: 2.6 GHz Intel Core i7 with 4x slower CPU simulation

## Goal

Styling all the children of `#app` but not first one.

## Result

Average of recalculating style times of each case:

```
loop 100 times 

   21.21ms - 1000 elements with no-css
   23.72ms - 1000 elements with * + *
   24.83ms - 1000 elements with > * + *
   25.18ms - 1000 elements with 2 > * + *
   26.22ms - 1000 elements with 4 > * + *
   25.95ms - 1000 elements with > *:not(:first-child)
   25.49ms - 1000 elements with > .child + .child
   23.88ms - 1000 elements with > .child
   25.27ms - 1000 elements with > .child & > .child:first-child 

  236.43ms - 10000 elements with no-css
  257.44ms - 10000 elements with * + *
  269.60ms - 10000 elements with > * + *
  271.94ms - 10000 elements with 2 > * + *
  279.42ms - 10000 elements with 4 > * + *
  281.80ms - 10000 elements with > *:not(:first-child)
  267.65ms - 10000 elements with > .child + .child
  256.75ms - 10000 elements with > .child
  272.37ms - 10000 elements with > .child & > .child:first-child 
```

## Conclusion

In general, a page containes less than 1000 elements (calculated by `document.querySelectorAll('*')`), so it's rational to give following conclusion based on 1000 elements test cases.

- Add `>` make it slower
  - compares `* + *` (23.72ms) and `> * + *` (24.83ms)
- The alternatives of `> * + *` (24.83ms)
  - slower (25.95ms): `> *:not(:first-child)`
  - slower (25.49ms): `> .child + .child`
  - slower (25.27ms): `> .child` with `> .child:first-child` override
  - faster (23.88ms): `> .child`
    - This method should implement some logic in JS to ignore the first child of `#app`.
- Adding one extra `> * + *` increate less than 1ms.
- CSS selector is not a major factor of recalculating style times
  - because when the test cases are ran once instead of 100 times, the result is randomized and not consistent.

  


