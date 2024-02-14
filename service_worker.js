
/**
 * Whenever a new tab is created, check if we need to move it (and if we do, take care of it).
 * https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated
 * @param {Tab} tab The tab that was just created.
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
		chrome.tabs.move(tab.id, { "index": parentTab.index + 1 });
	}
});

/**
 * Determine whether we should move the new tab to be next to its parent.
 * @param {Tab} tab The tab we might want to move.
 * @param {Tab} parentTab The parent (opener) of tab.
 * @returns true/false - do we need to move the tab?
 */
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
