//tab tree definition and traversal functions
var tabTree = {
	'tab': {title: "root", id: -1},
	'savedIndex': -1,
	'active': false,
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

//node is where the search will begin from
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


function isSibling(tabid1, tabid2){
	var tabNode1 = findTabNode(tabTree, tabid1);		
	var tabNode2 = findTabNode(tabTree, tabid2);

	if(tabNode1.parent == tabNode2.parent)
		return true;
	else
		return false;	
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
		
		var children = findTabNode(tabTree, tabs[0].id).children;	
		var targetNodeId = children[0].tab.id;
		for(var i = 0; i  < children.length; i++){
			if(children[i].active)
				targetNodeId = children[i].tab.id;	
		}
		
		treeShiftLevel(targetNodeId);	
	});
}

function treeShiftLevel(tabId){
	chrome.tabs.query({currentWindow: true}, function(tabs){
		console.log(tabs);
		//find current active tab
		var currentNode;
		for(var i = 0; i < tabs.length; i++){
			if(tabs[i].active){
				currentNode = findTabNode(tabTree, tabs[i].id);	
				console.log(currentNode);
			}
		}

		//find targetNode
		var targetNode = findTabNode(tabTree, tabId);

		if(targetNode.tab.title == "root"){
			//check if user is trying to shift further up than root
			//print some kind of error message***
			return;
		}else if(isSibling(currentNode.tab.id, targetNode.tab.id)){
			//swap active tab
			chrome.tabs.update(currentNode.tab.id, {active: false});
			chrome.tabs.update(targetNode.tab.id, {active: true});
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
			//save moveOrder
			var moveOrder = [];
			for(var i = 0; i < switchInTabNodes.length; i++){
				moveOrder.push({id: switchInTabNodes[i].tab.id, index: switchInTabNodes[i].savedIndex});	
			}

			//sort moveOrder by index
			moveOrder.sort(function(a, b){
				if(a.index < b.index)
					return -1;
				else if(a.index > b.index)
					return 1;	
				else
					return 0;
			});

			//get savedIndex order
			//add with -1 index but in the correct order
			for(var i = 0; i < moveOrder.length; i++){
				tabSwapIn(moveOrder[i].id, -1);
			}

			//move out tabs
			for(var i = 0; i < switchOutTabs.length; i++){
				var node = findTabNode(tabTree, switchOutTabs[i].id);
				if(switchOutTabs[i].active == true){
					node.active = true;
				}else{
					node.active = false;
				}

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

