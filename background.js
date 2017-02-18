var ChromeNewTabURL = "chrome://newtab/";


function moveTabIfNeeded(tab) {
	moveIfDefaultNewTab(tab);
	moveIfDuplicatedTab(tab);
}

function moveIfDefaultNewTab(tab) {
	if(!isDefaultNewTab(tab))
		return;
	
	moveTabNextToParent(tab);
}
function isDefaultNewTab(tab) {
	if(!tab)
		return false;
	
	return (tab.url == ChromeNewTabURL);
}

function moveIfDuplicatedTab(tab) {
	var parentId = getTabParentId(tab);
	if(!parentId)
		return;
	
	chrome.tabs.get(
		parentId,
		function(parentTab) {
			if(!gotTabOK(parentTab))
				return;
			if(tab.url != parentTab.url)
				return;
			
			moveTabNextToParent(tab);
		}
	);
}

function moveTabNextToParent(tab) {
	var parentId = getTabParentId(tab);
	if(!parentId)
		return;
	
	chrome.tabs.get(
		parentId,
		function(parentTab) {
			if(!gotTabOK(parentTab))
				return;
			
			moveTabNextToOtherTab(tab, parentTab);
		}
	);
}
function moveTabNextToOtherTab(tab, otherTab) {
	if(!otherTab)
		return;
	
	moveTabToIndex(tab, otherTab.index + 1);
}
function moveTabToIndex(tab, index) {
	if(!tab)
		return;
	
	chrome.tabs.move(
		tab.id, 
		{
			"index": index
		}
	);
}

function getTabParentId(tab) {
	if(!tab)
		return "";
	
	return tab.openerTabId;
}

function gotTabOK(tab) {
	var lastError = chrome.runtime.lastError; // Check lastError so Chrome doesn't output anything to the console.
	if(lastError)
		return false;
	
	if(!tab)
		return false;
	
	return true;
}


chrome.tabs.onCreated.addListener(moveTabIfNeeded);
