//tab tree definition and traversal functions
var tabTree = {
	'tab': {title: "root", id: -1},
	'parent': null,
	'children': []
}

function createTabNode(tab){
	var node = {
		'tab': tab,
		'parent': null,
		'children': []
	}	

	return node;
}

function findTabNode(node, goalTabId){
	var stack = new Array();
	stack.push(node);

	while(stack.length != 0){
		var currentNode = stack.pop();
		if(currentNode.tab.id == goalTabId){
			return currentNode;
		}else{
			for(var i = 0; i < currentNode.children.length; i++){
				stack.push(currentNode.children[i]);
			}
		}
	}

	return null;
}

//Move up/down levels
function treeShiftUp(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var tab = tabs[0];
		var currentNode = findTabNode(tabTree, tab.id);
		var targetNode = currentNode.parent;

		if(targetNode.parent == null){
			return
		}else{
			chrome.tabs.getAllInWindow(TABTREE_APP.activeWindowId, function(oldTabs){
				var newOpenNodes = targetNode.parent.children;
				//add tabs
				for(var i = 0; i < newOpenNodes.length; i++){
					tabSwapIn(newOpenNodes[i].tab.id);
				}	

				//remove tabs
				for(var i = 0; i < oldTabs.length; i++){
					tabSwapOut(oldTabs[i].id);
				}
			});
		}
	});
}

function treeShiftDown(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var tab = tabs[0];
		
		var currentNode = findTabNode(tabTree, tab.id);
		var targetNodes = currentNode.children;
		if(targetNodes.length == 0){
			return
		}else{
			chrome.tabs.getAllInWindow(TABTREE_APP.activeWindowId, function(oldTabs){
				var newOpenNodes = targetNodes;
				//add tabs
				for(var i = 0; i < newOpenNodes.length; i++){
					tabSwapIn(newOpenNodes[i].tab.id);
				}	

				//remove tabs
				for(var i = 0; i < oldTabs.length; i++){
					tabSwapOut(oldTabs[i].id);
				}
			});
		}
	});
}

//moving tabs in and out of active window
function tabSwapIn(tabId){
	//find tab
	var tab = findTabNode(tabTree, tabId);
	chrome.tabs.move(tabId, {windowId: TABTREE_APP.activeWindowId, index: -1});
}

function tabSwapOut(tabId){
	//find tab
	var tab = findTabNode(tabTree, tabId);
	chrome.tabs.move(tabId, {windowId: TABTREE_APP.hiddenWindowId, index: -1});
}


