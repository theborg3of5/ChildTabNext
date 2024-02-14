
/**
 * Whenever a new tab is created, check if we need to move it (and do so if so).
 * https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated
 * @param {Tab} tab Tab that was created.
 */
chrome.tabs.onCreated.addListener(async (tab) =>
{
	if (!tab)
		return;
	
	const parentTab = await chrome.tabs.get(tab.openerTabId);
	if (!parentTab)
		return;
	
	if (needToMoveTab(tab, parentTab))
	{ 
		// moveTabNextToOtherTab(tab, parentTab);
		chrome.tabs.move(tab.id, { "index": parentTab.index + 1 });
	}
	

	// // moveIfDefaultNewTab(tab);
	// if ( (tab.url === "chrome://newtab/") || (tab.pendingUrl === "chrome://newtab/") )
	// 	moveTabNextToParent(tab);
	// //return

	// // moveIfDuplicatedTab(tab);
	// var parentId = tab.openerTabId;
	// if(!parentId)
	// 	return;
	
	// chrome.tabs.get(
	// 	parentId,
	// 	function(parentTab) {
	// 		if(!gotTabOK(parentTab))
	// 			return;
	// 		if(tab.url != parentTab.url)
	// 			return;
			
	// 		moveTabNextToParent(tab);
	// 	}
	// );
});

function needToMoveTab(tab, parentTab)
{
	// New tabs
	if (tab.url === "chrome://newtab/")
		return true;
	if (tab.pendingUrl === "chrome://newtab/")
		return true;

	// Duplicated tabs
	if (tab.url === parentTab.url)
		return true;

	return false;
}

// function moveIfDefaultNewTab(tab) {
// 	if (!tab)
// 		return;
	
// 	if ( (tab.url === "chrome://newtab/") || (tab.pendingUrl === "chrome://newtab/") )
// 		moveTabNextToParent(tab);
// }

// function moveIfDuplicatedTab(tab) {
	
// }

// function moveTabNextToParent(tab) {
// 	var parentId = tab.openerTabId;
// 	if(!parentId)
// 		return;
	
// 	chrome.tabs.get(
// 		parentId,
// 		function(parentTab) {
// 			if(!gotTabOK(parentTab))
// 				return;
			
// 			moveTabNextToOtherTab(tab, parentTab);
// 		}
// 	);
// }
// function moveTabNextToOtherTab(tab, otherTab) {
// 	if(!otherTab)
// 		return;
	
// 	// moveTabToIndex(tab, otherTab.index + 1);
// 	chrome.tabs.move(tab.id, { "index": otherTab.index + 1 });
// }
// function moveTabToIndex(tab, index) {
// 	if(!tab)
// 		return;
	
// 	chrome.tabs.move(
// 		tab.id, 
// 		{
// 			"index": index
// 		}
// 	);
// }

// function gotTabOK(tab) {
// 	var lastError = chrome.runtime.lastError; // Check lastError so Chrome doesn't output anything to the console.
// 	if(lastError)
// 		return false;
	
// 	if(!tab)
// 		return false;
	
// 	return true;
// }
