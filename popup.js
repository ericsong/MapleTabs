var background = chrome.extension.getBackgroundPage();
var tabTree = background.tabTree;

chrome.tabs.update(1266, {url: 'https://google.com'});
