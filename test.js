import fetch from "node-fetch"
console.log("ikiteruka");
(async () => {
    const data = await fetch("https://developer.chrome.com/docs/extensions/reference/scripting/", {
        method: "GET"
    });
    let text = await data.text();
    text = text.split(/<code.*>/);
    text.shift();
    const groupOfFunction = [];
    const arrayOfFunction = [];
    for (let num in text) {
        arrayOfFunction.push(text[num].slice(0, text[num].indexOf("</code>")));
    }
    /* console.log(allHtml[1]);
    console.log(text); */
    /* const allCodeHtmls = [];
    for (let num in allHtml) {
        const text = allHtml[num];
        console.log(text);
        if (text.indexOf("chrome") != -1 && allHtml[Number(num) + 1].indexOf("void") != -1) {
            //console.log(text);
            allCodeHtmls.push(text);
        } else if (text.indexOf("callback") != -1) {
            allCodeHtmls.push(allHtml[Number(num) + 1]);
        }
    } */
    //console.log(allCodeHtmls);
    for (let num in arrayOfFunction) {
        const codeOfHtml = arrayOfFunction[num];
        //console.log(codeOfHtml);
        if (codeOfHtml) {
            if (codeOfHtml.indexOf("chrome") != -1) {
                if (arrayOfFunction[Number(num) + 1].indexOf("void") != -1) {
                    groupOfFunction.push([codeOfHtml, arrayOfFunction[Number(num) + 1]]);
                } else {
                    groupOfFunction.push([codeOfHtml, null]);
                }
            }
        }
    }
    //console.log(groupOfFunction);
    const result = [];
    for (let num in groupOfFunction) {
        let variableOfCallback = groupOfFunction[num][1];
        let functionOfExtension = groupOfFunction[num][0].replace(/&nbsp;/g, "").replace(/<.*>/g, "").replace(/\s+/g, "")
            .replace(/\r?\n/g, "").replace(/:/g, ", ").replace(/\?/g, "").replace(")", ");");;
        let variablesOfCallback = [];
        if (variableOfCallback) {
            variableOfCallback = variableOfCallback.slice(0, variableOfCallback.indexOf(")")).replace("(", "")
                .replace(/<.*>/g, "").split(", ");
            for (let num in variableOfCallback) {
                const correctText = variableOfCallback[num].replace("?", "").replace(/ /g, "").replace(/\r?\n/g, "");
                variablesOfCallback.push(correctText.slice(0, correctText.indexOf(":")));
            }
        } else {
            variablesOfCallback.push(null)
        }
        let arrayOfVariables = functionOfExtension.replace("callback, );", "").split(", ");
        arrayOfVariables.unshift((arrayOfVariables[0].slice(functionOfExtension.indexOf("(")).replace("(", "")));
        arrayOfVariables.splice(1, 1);
        arrayOfVariables.pop();
        arrayOfVariables.forEach((value, index) => {
            const newVariable = "${" + String(index + 1) + ":" + value + "}";
            functionOfExtension = functionOfExtension.replace(value, newVariable);
        });
        if (functionOfExtension.indexOf("callback") != -1) {
            if (variablesOfCallback[0]) {
                variablesOfCallback = variablesOfCallback.map((value, index) => {
                    return "${" + String(arrayOfVariables.length + index + 1) + ":" + value + "}";
                });
                functionOfExtension = functionOfExtension.replace("callback, ", "function (" +
                    variablesOfCallback.toString().replace(/,/g, ", ") + ") {\\n\\t$"
                    + String(variablesOfCallback.length + arrayOfVariables.length + 1) + "\\n}");
            } else {
                functionOfExtension = functionOfExtension.replace("callback, ", "function () {}");
            }
        } else {
            functionOfExtension = functionOfExtension.replace(", )", ")");
        }
        const nameOfFunction = functionOfExtension.split("(")[0];
        const listOfName = nameOfFunction.split(".").map((value, index) => {
            if (value.indexOf("addListener") != -1) {
                return null;
            } else if (index != 0) {
                return value.slice(0, 1).toUpperCase() + value.slice(1);//42
            } else {
                return value;
            }
        });
        result.push(listOfName.join("") + ': "' + functionOfExtension + '"');
        console.log(functionOfExtension);
        console.log(variablesOfCallback);
    }
    console.log(result.length);
    console.log(result.join(", "));
})();



/* 
let A = "(info: OnClickData, tab?: tabs.Tab, gorira: Gorira) => void";

A = A.slice(0, A.indexOf(")")).replace("(", "");
let B = A.split(", ");
let C = [];
for (let num in B) {
    const correctText = B[num].replace("?", "");
    C.push(correctText.slice(0, correctText.indexOf(":")));
}
console.log(C); 
//[ 'info', 'tab', 'gorira' ]
*/


/* chrome.contextMenus
contextMenus
create()
update()
{
  "name": "My extension",
  ...
  "permissions": [
    "contextMenus"
  ],
  "icons": {
    "16": "icon-bitty.png",
    "48": "icon-small.png",
    "128": "icon-large.png"
  },
  ...
}
chrome.contextMenus.create(
  createProperties: object,
  callback?: function,
)
runtime.lastError
true
false
['page']
true
documentUrlPatterns
src
img
audio
video
href
a
type
separator
selection
%s
normal
contextMenus.onClicked
onclick
(info: OnClickData, tab: Tab) => {...}
callback
() => void
chrome.contextMenus.remove(
  menuItemId: string | number,
  callback?: function,
)
callback
() => void
chrome.contextMenus.removeAll(
  callback?: function,
)
callback
() => void
chrome.contextMenus.update(
  id: string | number,
  updateProperties: object,
  callback?: function,
)
contextMenus.create
onclick
(info: OnClickData, tab: Tab) => {...}
callback
() => void
chrome.contextMenus.onClicked.addListener(
  callback: function,
)
callback
(info: OnClickData, tab?: tabs.Tab) => void */