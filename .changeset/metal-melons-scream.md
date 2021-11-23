---
'@igloo-ui/tokens': major
---

## BREAKING CHANGE

- Adding base 10 support. If your project uses the mathematical trick of basing the value of `1rem` equals `10px`, there is also an base10 output within the dist folder of this package.<br/> In CSS, you can import the files by doing:<br/> `@import '~@igloo-ui/tokens/dist/base10/variables.css';`
