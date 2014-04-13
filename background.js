var TABTREE_APP = {};

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

//initialize tree
chrome.tabs.query({},function(tabs){
	TABTREE_APP.activeWindowId = tabs[0].windowId;

	for(var i = 0; i < tabs.length; i++){
		var newTab = createTabNode(tabs[i]);
		newTab.parent = tabTree;
		tabTree.children.push(newTab);

	}

	console.log(tabTree);
});

//tab swap functions
function tabSwapIn(tabId){
	//find tab
	var tab = findTabNode(tabTree, tabId);
}

function tabSwapOut(tabId){

}

//listeners
chrome.tabs.onCreated.addListener(function(tab){
	if(tab.url.indexOf("chrome-devtools") != -1){
		return;
	}else if(tab.url.indexOf("chrome-extension") != -1 && tab.url.indexOf("homepage.html") != -1){
		console.log("created hidden window tab");
		TABTREE_APP.hiddenWindowId = tab.windowId;
		return;	
	}else if(tab.title == "New Tab"){
		console.log(tab);
		//creating sibling tab node
		var currentTab = findTabNode(tabTree, tab.openerTabId);
		var parentTab = currentTab.parent;
		var childTab = createTabNode(tab);
		childTab.parent = parentTab;
		parentTab.children.push(childTab);
	}else{
		//creating child tab node
		var currentTab = findTabNode(tabTree, tab.openerTabId);
		var childTab = createTabNode(tab);
		childTab.parent = currentTab;
		currentTab.children.push(childTab);
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
	if(findTabNode(tabTree, tabId) != null){
		console.log("attempting to remove node id " + tabId);
		var removedNode = findTabNode(tabTree, tabId);
		var orphans = removedNode.children;

		//removes node from parent's children
		var parentArray = removedNode.parent.children;
		for(var i = 0; i < parentArray.length; i++){
			if(parentArray[i].tab.id == tabId){
				parentArray.splice(i, 1);
				break;
			}
		}

		//add orphans to new parent
		for(var i = 0; i < orphans.length; i ++){
			orphans[i].parent = removedNode.parent;
			parentArray.push(orphans[i]);
		}
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(tab.url.indexOf("chrome-devtools") != -1){
		return;
	}else if(findTabNode(tabTree, tabId) != null){	
		console.log(tabId + " has been updated");
		var updateNode = findTabNode(tabTree, tabId);
		console.log(updateNode);

		for(var property in changeInfo){
			if(changeInfo.hasOwnProperty(property)){
				updateNode.tab[property] = changeInfo[property];
				console.log(changeInfo[property]);
				console.log(updateNode.tab[property]);
			}
		}	

		updateNode.tab.title = tab.title;
	}
});
