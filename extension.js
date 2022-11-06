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
        const keywordsOfTabs = { chromeTabsOnZoomChange: "chrome.tabs.onZoomChange.addListener(function (${1:zoomChangeInfo}) {\n\t$2\n});", chromeTabsOnUpdated: "chrome.tabs.onUpdated.addListener(function (${1:tabId}, ${2:changeInfo}, ${3:tab}) {\n\t$4\n});", chromeTabsOnReplaced: "chrome.tabs.onReplaced.addListener(function (${1:addedTabId}, ${2:removedTabId}) {\n\t$3\n});", chromeTabsOnRemoved: "chrome.tabs.onRemoved.addListener(function (${1:tabId}, ${2:removeInfo}) {\n\t$3\n});", chromeTabsOnMoved: "chrome.tabs.onMoved.addListener(function (${1:tabId}, ${2:moveInfo}) {\n\t$3\n});", chromeTabsOnHighlighted: "chrome.tabs.onHighlighted.addListener(function (${1:highlightInfo}) {\n\t$2\n});", chromeTabsOnDetached: "chrome.tabs.onDetached.addListener(function (${1:tabId}, ${2: detachInfo}) {\n\t$3\n});", chromeTabsOnCreated: "chrome.tabs.onCreated.addListener(function (${1:tab}) {\n\t$2\n});", chromeTabsOnAttched: "chrome.tabs.onAttached.addListener(function (${1:tabId}, \${2:attachInfo}) {\n\t$3\n});", chromeTabsOnActivated: "chrome.tabs.onActivated.addListener(function (${1:activeInfo}) {\n\t$2\n});", chromeTabsUpdate: "chrome.tabs.update(${1:tabId}, ${2:updateProperties}, function (${3:tab}) {\n\t$4\n});", chromeTabsUngroup: "chrome.tabs.ungroup(${1:tabIds}, function () {});", chromeTabsSetZoomSettings: "chrome.tabs.setZoomSettings(${1:tabId}, ${2:zoomSettings}, function () {});", chromeTabsSetZoom: "chrome.tabs.setZoom(${1:tabId}, ${2:zoomFactor}, function () {});", chromeTabsRemove: "chrome.tabs.remove(${1:tabIds}, function () {});", chromeTabsReload: "chrome.tabs.reload(${1:tabId}, ${2:reloadProperties}, function () {});", chromeTabsMove: "chrome.tabs.move(${1:tabIds}, ${2:moveProperties}, function (${3:tabs}) {\n\t$4\n});", chromeTabsHighlight: "chrome.tabs.highlight(${1:highlightInfo}, function (${2:window}) {\n\t$3\n});", chromeTabsGroup: "chrome.tabs.group(${1:options}, function (${2:groupId}) {\n\t$3\n});", chromeTabsGoForward: "chrome.tabs.goForward(${1:tabId}, function () {});", chromeTabsGoBack: "chrome.tabs.goBack(${1:tabId}, function () {});", chromeTabsGetZoomSettings: "chrome.tabs.getZoomSettings(${1:tabId}, function (${2:zoomSettings}) {\n\t$3\n});", chromeTabsGetZoom: "chrome.tabs.getZoom(${1:tabId}, function (${2:zoomFactor}) {\n\t$3\n});", chromeTabsGetCurrent: "chrome.tabs.getCurrent(function (${1:tab}) {\n\t$2\n});", chromeTabsGet: "chrome.tabs.get(${1:tabId}, function (${2:tab}) {\n\t$3\n});", chromeTabsDuplicate: "chrome.tabs.duplicate(${1:tabId}, function (${2:tab}) {\n\t$3\n});", chromeTabsDiscard: "chrome.tabs.discard(${1:tabId}, function (${2:tab}) {\n\t$3\n});", chromeTabsDetectLanguages: "chrome.tabs.detectLanguage(${1:tabId}, function (${2:languages}) {\n\t$3\n});", chromeTabsCreate: "chrome.tabs.create(${1:createProperties}, function (${2:tab}) {\n\t$3\n});", chromeTabsConnect: "chrome.tabs.connect(${1:tabId}, ${2:connectInfo});", chromeTabsCaptureVisibleTab: "chrome.tabs.captureVisibleTab(${1:windowId}, ${2:options}, function (${3:dataUrl}) {\n\t$4\n});", chromeTabsQuery: "chrome.tabs.query(${1:queryInfo}, function (${2:tabs}) {\n\t$3\n});", chromeTabsOnUpdated: "chrome.tabs.onUpdated.addListener(function (${1:tabId}, ${2:changeInfo}, ${3:tab}) {\n\t$4\n});", chromeTabsSendMessage: "chrome.tabs.sendMessage(${1:tabs}, ${2:message}, ${3:options}, function(${3:res}) {\n\t$4\n});" };
        const keywordsOfStorage = { chromeStorageLocalSet: "chrome.storage.local.set({$1}, function () {});", chromeStorageSyncSet: "chromestorage.sync.set({$1}, function () {});", chromeStorageLocalGet: "chrome.storage.local.get([$1], function (${2:result}) {\n\t$3\n});", chromeStorageSyncGet: "chrome.storage.sync.get([$1], function (${2:result}) {\n\t$3\n});" };
        const keywordsOfBrowserAction = { chromeBrowserActionOnClicked: "chrome.browserAction.onClicked.addListener(function () {\n\t$2\n});" }
        const keywordsOfContextMenus = {}
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
