
/**
 * Whenever a new tab is created, check if we need to move it (and do so if so).
 * https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated
 * @param {Tab} tab Tab that was created.
 */
chrome.tabs.onCreated.addListener((tab) =>
{ 
	moveIfDefaultNewTab(tab);
	moveIfDuplicatedTab(tab);
});

function moveIfDefaultNewTab(tab) {
	if (!tab)
		return;
	
	if ( (tab.url === "chrome://newtab/") || (tab.pendingUrl === "chrome://newtab/") )
		moveTabNextToParent(tab);
}
function isDefaultNewTab(tab) {
	if(!tab)
		return false;
	
	return (tab.url || tab.pendingUrl) === "chrome://newtab/";
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
