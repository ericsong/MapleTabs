var text = "hi from background";

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

chrome.tabs.query({},function(tabs){
	for(var i = 0; i < tabs.length; i++){
		var newTab = createTabNode(tabs[i]);
		newTab.parent = tabTree;
		tabTree.children.push(newTab);

	}

	console.log(tabTree);
});

chrome.tabs.onCreated.addListener(function(tab){
	if(tab.url.indexOf("chrome-devtools") != -1){
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
		childTab.parent = parentTab;
		currentTab.children.push(childTab);
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
	var removedTab = findTabNode(tabTree, tabId);
	//remove tab
});
