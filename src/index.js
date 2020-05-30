export default function findOverrides(pureCss) {
  const flatten = (acc, arr) => acc.concat(...arr);

  let customRules = [...document.styleSheets].map(parseRules).reduce(flatten, []);

  const style = getReferenceSheet(pureCss);
  const pureRules = parseRules(style.sheet).reduce(flatten, []);

  const pureText = pureRules.map(({cssText}) => cssText);
  customRules = customRules.filter(({cssText}) => !pureText.includes(cssText));

  const pureSelectors = pureRules.map(({ selectorText }) => selectorText);
  const elements = pureSelectors.length
    ? [...document.querySelectorAll(pureSelectors.join())]
    : [];

  style.remove();

  return elements
    .map((element) => {
      return { 
        custom: getMatchedRules(element, customRules),
        original: getMatchedRules(element, pureRules).pop(),
        element,
      };
    })
    .filter(({custom}) => custom.length)
    .map(describeOverrides);
}

function getMatchedRules(element, rules) {
  return rules.filter(({selectorText}) => element.matches(selectorText));
}

function describeOverrides({ element, custom, original }) {
  const declarations = custom.map((rule) => {
    return {
      sheet: rule.parentStyleSheet,
      selector: rule.selectorText,
      properties: getOverrides(original.style, rule.style),
    }
  });
  return { element, declarations };
}

function getReferenceSheet(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  style.sheet.disabled = true;
  return style;
}


function parseRules(sheet) {
  return [...(sheet.cssRules || sheet.rules || [])].map((rule) => {
    if (rule instanceof CSSStyleRule) {
      return [rule];
    } else if (rule instanceof CSSMediaRule && window.matchMedia(rule.conditionText)) {
      return [...rule.cssRules];
    }
    return [];
  });
}

function getOverrides(orig, target) {
  return Array.prototype.slice.call(target).reduce((acc, prop) => {
    return Object.assign(acc, {[prop]: { original: orig[prop], override: target[prop] }})
  }, {});
}
