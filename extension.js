// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/* function activate(context) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "javascript" }, vscode.CompletionIte
    ));
} */
function makeSnippets(apiName, keywords, items) {
    for (let key in keywords) {
        const template = {
            label: key,
            insertText: new vscode.SnippetString(keywords[key]),
            kind: null,
            documentation: null,
            detail: ''
        }
        let urlWord = key.replace("chrome", "").replace(apiName, "");
        urlWord = urlWord[0].toLowerCase() + urlWord.replace(urlWord[0], "");
        console.log(urlWord);
        if (key.indexOf("On") == -1) {
            template.kind = vscode.CompletionItemKind.Method;
            template.documentation = new vscode.MarkdownString("https://developer.chrome.com/docs/extensions/reference/" + apiName.toLowerCase() + "/#method-" + urlWord);
            items.push(template);
        } else {
            template.kind = vscode.CompletionItemKind.Event;
            template.documentation = new vscode.MarkdownString("https://developer.chrome.com/docs/extensions/reference/" + apiName.toLowerCase() + "/#event-" + urlWord);
            items.push(template);
        }
    }
}

class JsCompletionItemProvider {
    constructor() {
        this.completionItems = [];
        const keywordsOfRuntime = { chromeRuntimeOnUpdateAvailable: "chrome.runtime.onUpdateAvailable.addListener(function (${1:details}) {\n\t$2\n});", chromeRuntimeOnSuspendCanceled: "chrome.runtime.onSuspendCanceled.addListener(function () {\n\t$1\n});", chromeRuntimeOnSuspend: "chrome.runtime.onSuspend.addListener(function () {\n\t$1\n});", chromeRuntimeOnStartup: "chrome.runtime.onStartup.addListener(function () {\n\t$1\n});", chromeRuntimeOnRestartRequired: "chrome.runtime.onRestartRequired.addListener(function (${1:reason}) {\n\t$2\n})", chromeRuntimeOnMessageExternal: "chrome.runtime.onMessageExternal.addListener(function (${1:message}, ${2:sender}, ${3:sendResponse}) {\n\t$4\n})", chromeRuntimeOnInstalled: "chrome.runtime.onInstalled.addListener(function (${1:details}) {\n\t$2\n});", chromeRuntimeOnConnectNative: "chrome.runtime.onConnectNative.addListener(function (${1:port}) {\n\t$2\n});", chromeRuntimeOnConnectExternal: "chrome.runtime.onConnectExternal.addListener(function (${1:port}) {\n\t$2\n});", chromeRuntimeOnConnect: "chrome.runtime.onConnect.addListener(function (${1:port}) {\n\t$2\n})", chromeRuntimeSetUninstallURL: "chrome.runtime.setUninstallURL(${1:url}, function () {});", chromeRuntimeNativeMessage: "chrome.runtime.sendNativeMessage(${1:application}, ${2:message}, function (${3:response}) {\n\t$4\n):", chromeRuntimeRestartAfterDelay: "chrome.runtime.restartAfterDelay(${1:seconds}, function () {});", chromeRuntimeRestart: "chrome.runtime.restart();", chromeRuntimeReload: "chrome.runtime.reload()", chromeRuntimeOpenOptionsPage: "chrome.runtime.openOptionsPage(function (${1:lastError}) {\n\t$2\n});", chromeRuntimeGetPlatformInfo: "chrome.runtime.getPlatformInfo(function (${1:platformInfo}) {\n\t$2\n})", chromeRuntimeGetPackageDirectoryEntry: "chrome.runtime.getPackageDirectoryEntry(function (${1:directoryEntry}) {\n\t$2\n})", chromeRuntimeGetManifest: "chrome.runtime.getManifest();", chromeRuntimeGetBackgroundPage: "chrome.runtime.getBackgroundPage(function (${1: window}) {\n\t$2\n});", chromeRuntimeConnectNative: "chrome.runtime.connectNative(${1:application});", chromeRuntimeConnect: "chrome.runtime.connect(${1:extensionId}, ${2:connectInfo});", chromeRuntimeSendMessage: "chrome.runtime.sendMessage({$1}, function (${2:res}) {\n\t$3\n});", chromeRuntimeOnMessage: "chrome.runtime.onMessage.addListener(function(${1:request}, ${2:sender}, ${3:sendResponse}) {\n\t$4\n});", chromeRuntimeGetURL: "chrome.runtime.getURL($1);" };
        const keywordsOfTabs = { chromeTabsQuery: "chrome.tabs.query({ active: true, currentWindow: true }, function (${1:tabs}) {\n\t$2\n});", chromeTabsOnUpdated: "chrome.tabs.onUpdated.addListener(function (${1:tabId}, ${2:changeInfo}, ${3:tab}) {\n\t$4\n});", chromeTabsSendMessage: "chrome.tabs.sendMessage(${1:tabs}, {$2}, function(${3:res}) {\n\t$4\n});" };
        const keywordsOfStorage = { chromeStorageLocalSet: "chrome.storage.local.set({$1}, function () {});", chromeStorageSyncSet: "chromestorage.sync.set({$1}, function () {});", chromeStorageLocalGet: "chrome.storage.local.get([$1], function (${2:result}) {\n\t$3\n});", chromeStorageSyncGet: "chrome.storage.sync.get([$1], function (${2:result}) {\n\t$3\n});" };
        const keywordsOfBrowserAction = { chromeBrowserActionOnClicked: "chrome.browserAction.onClicked.addListener(function () {\n\t$2\n});" }
        makeSnippets("Runtime", keywordsOfRuntime, this.completionItems);
        makeSnippets("Tabs", keywordsOfTabs, this.completionItems);
        makeSnippets("Storage", keywordsOfStorage, this.completionItems);
        makeSnippets("BrowserAction", keywordsOfBrowserAction, this.completionItems);
        this.completionList = new vscode.CompletionList(this.completionItems, false);
    }

    provideCompletionItems(document, position, token) {
        return Promise.resolve(this.completionList);
    }
}
function activate(context) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'javascript' },
            new JsCompletionItemProvider(),
            '.'
        )
    );
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
