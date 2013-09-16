// Upon tab creation, grab the parent tab by its ID, and copy over the history.
function tabCreated(childTab) {
	// If the new tab isn't empty, don't move it - it's probably already next to the tab we want.
	if(childTab.url === "chrome://newtab/") {
		// Get the parent's index.
		chrome.tabs.get(childTab.openerTabId, function(parentTab) {
			// Stick the new tab right next to it.
			chrome.tabs.move(childTab.id, {"index": parentTab.index+1});
		});
	}
}

// Register it to happen when a new tab opens.
chrome.tabs.onCreated.addListener(tabCreated);