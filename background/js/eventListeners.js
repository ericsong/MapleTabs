//chrome event listeners (create tab, delete tab, etc)

//new tab listener
chrome.tabs.onCreated.addListener(function(tab){
	if(tab.url.indexOf("chrome-devtools") != -1){
		return;
	}else if(tab.url.indexOf("chrome-extension") != -1 && tab.url.indexOf("homepage.html") != -1){
		console.log("created hidden window tab");
		TABTREE_APP.hiddenWindowId = tab.windowId;
		return;	
	}else if(TABTREE_APP.activeWindowId == tab.windowId){
		if(tab.title == "New Tab"){
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
			tabSwapOut(tab.id);
		
			chrome.tabs.query({active: true, currentWindow: true}, 
						function(tabs){
							chrome.tabs.sendMessage(tabs[0].id, {message: "tab child created"});	
						});
		}
	}
});

//tab removed listener
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

//tab updated listener
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

chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
	chrome.tabs.query({currentWindow: true}, function(tabs){
		for(var i = 0;i < tabs.length; i++){
			var updateNode = findTabNode(tabTree, tabs[i].id);
			updateNode.tab.index = tabs[i].index;
			updateNode.savedIndex = tabs[i].index;
		}
	});
});

//hotkeys listener
chrome.commands.onCommand.addListener(function(command) {
	if(command == "shift_up"){
		console.log("shifting up");
		treeShiftUp();
	}else if(command == "shift_down"){
		console.log("shifting down");
		treeShiftDown();
	}
});

//message listener (from popup manipulation)
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.command == "shiftLevel"){
			var targetId = request.targetId;
			treeShiftLevel(targetId);	
			sendResponse({status: "success"});
		}
	}
);
