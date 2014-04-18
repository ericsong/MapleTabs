//tab tree definition and traversal functions
var tabTree = {
	'tab': {title: "root", id: -1},
	'savedIndex': -1,
	'parent': null,
	'children': []
}

function createTabNode(tab){
	var node = {
		'tab': tab,
		'parent': null,
		'children': [],
		'savedIndex': -1,
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
		console.log("Shift up function called");
		var targetNodeId = findTabNode(tabTree, tabs[0].id).parent.tab.id;

		treeShiftLevel(targetNodeId);	
	});
}

function treeShiftDown(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		console.log("Shift down function called");
		var targetNodeId = findTabNode(tabTree, tabs[0].id).children[0].tab.id;
		
		treeShiftLevel(targetNodeId);	
	});
}

function treeShiftLevel(tabId){
	chrome.tabs.query({currentWindow: true}, function(tabs){
		//find targetNode
		var targetNode = findTabNode(tabTree, tabId);

		if(targetNode.tab.title == "root"){
			//check if user is trying to shift further up than root
			//print some kind of error message***
			return;
		}else{
			//find tabs to switch in (siblings on tabNode)
			//find targetNode's parent
			var targetNodeParent = targetNode.parent;
			var switchInTabNodes = targetNodeParent.children;

			//find tabs to switch out (current active tabs)
			var switchOutTabs = tabs;

			//record tabOut indexes 
			for(var i = 0; i < switchOutTabs.length; i++){
				var tempNode = findTabNode(tabTree, switchOutTabs[i].id);
				tempNode.savedIndex = tempNode.tab.index;
			}

			//move in tabs
			for(var i = 0; i < switchInTabNodes.length; i ++){
				tabSwapIn(switchInTabNodes[i].tab.id, switchInTabNodes[i].savedIndex);
			}

			//move out tabs
			for(var i = 0; i < switchOutTabs.length; i++){
				tabSwapOut(switchOutTabs[i].id);
			}

			//activate proper window (for shift up)
			chrome.tabs.update(targetNode.tab.id, {active: true});
		}
	});
}

//moving tabs in and out of active window
function tabSwapIn(tabId, savedIndex){
	//find tab
	var tab = findTabNode(tabTree, tabId);
	chrome.tabs.move(tabId, {windowId: TABTREE_APP.activeWindowId, index: savedIndex});
}

function tabSwapOut(tabId){
	//find tab
	var tab = findTabNode(tabTree, tabId);
	chrome.tabs.move(tabId, {windowId: TABTREE_APP.hiddenWindowId, index: -1});
}

function tabReorder(tabId, newIndex){
	//find tab
	chrome.tabs.move(tabId, {index: newIndex});
}

