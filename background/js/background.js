//global object for inter script communication
var TABTREE_APP = {};

//initialize tree
chrome.tabs.query({},function(tabs){
	chrome.tabs.query({active: true, currentWindow: true}, function(activeTabs){
		var tab = activeTabs[0];
		TABTREE_APP.activeWindowId = tab.windowId;
		for(var i = 0; i < tabs.length; i++){
			if(tabs[i].windowId == TABTREE_APP.activeWindowId){
				var newTab = createTabNode(tabs[i]);
				newTab.parent = tabTree;
				tabTree.children.push(newTab);
			}
		}

		console.log(tabTree);
	});		
});
