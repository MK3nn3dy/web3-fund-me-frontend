# Web3 Frontend Test

A very, very basic frontend used to test the contracts I wrote as part of <a href="https://www.youtube.com/watch?v=gyMwXuJrbJQ">Patrick Collins's full stack Web3 course</a>.

This assumes the use of a Metamask wallet and uses the `window.ethereum` object. :cat: :purse:

## Structure

-   A basic index.html
-   An index.js file with the button listeners set to type module so we can import frontend ethers
-   A minified version of frontend ethers imported by script.js
-   An index.css that's not in this step of the course - some very basic styling so the form is a little easier to look at whilst we play with the basics!

You'll need to create a constants.js file in the root of this directory that should export your contract ABIs and addresses for import into script.js, like below:

```javascript
export const fundMeAddress = "0xYourContractAddress"

export const fundMeABI = []
```
