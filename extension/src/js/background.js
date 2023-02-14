chrome.runtime.onMessage.addListener((message, sender)=> {
	if(!message.isStarted) return;
	else{chrome.tabs.executeScript({
		file: 'src/js/inject.js'
	}); }
});