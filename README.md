# css-identify-overrides

The main export of this package is expected to run in the browser. It takes a single argument; a string of CSS declarations that are expected to be styling the elements on the page. The return value will be a collection of reported elements which have styles that override the given styles.

## Examples 
Check out the console at the following link: https://ddamato.github.io/css-identify-overrides/examples

## How it works
1. Create a disabled stylesheet from the provided styles.
1. Collect all the page stylesheets.
1. Get the declarations (rules) from all of the sheets.
1. Get unique set of rules; diff the provided rules from the page rules.
1. Get the selectors that the provided styles are targeting.
1. Get the elements from those selectors and for each of the elements...
    1. Get the rulesets from the provided stylesheet that match the element.
    1. Get the rulesets from the page stylesheets; unique rules.
    1. Provide a reference to the sheet, selector, and offending properties.