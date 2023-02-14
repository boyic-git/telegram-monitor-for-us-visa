console.log('background.js is running...')

// create a chrome notification
function createNotification(title, message) {
    var options = { type: "basic", title: title, message: message, iconUrl: "src/img/icon.png" };
    chrome.notifications.create(options);
}

// show notification now
// createNotification("Hello", "Welcome to the extension");
let injectData = {}

// read chat every 200 ms
setInterval(readChat, 200);

function readChat() {
    let chats = Array.from(document.querySelectorAll('p.last-message.shared-canvas-container'))

    let obj = {}
    obj.innertext = chats[0].innerText

    // parse obj.innertext to get the location, from date, to date and updated time
    obj.location = obj.innertext.split(': ')[0]
    obj.fromDate = obj.innertext.split(': ')[1].split(' -> ')[0]
    obj.toDate = obj.innertext.split(': ')[1].split(' -> ')[1]
    // updatedTime is now
    obj.updatedTime = new Date().toLocaleString()

    // verify if this obj is already in chrome storage
    chrome.storage.sync.get('updates', (injectData) => {
        if (injectData.updates) {
            // if the location in the last injectData is not the same as the location in the obj
            if (injectData.updates[injectData.updates.length - 1].location != obj.location || 
                injectData.updates[injectData.updates.length - 1].fromDate != obj.fromDate || 
                injectData.updates[injectData.updates.length - 1].toDate != obj.toDate) {
                // append the new obj to the array
                injectData.updates.push(obj)
                // save the new array to chrome storage
                chrome.storage.sync.set({ updates: injectData.updates });
                console.log(obj)
            }
        } 
        else {
            console.log('no data')
            // create a new data object array
            injectData.updates = []
            // append the new obj to the array
            injectData.updates.push(obj)
            // save the new array to chrome storage
            chrome.storage.sync.set({ updates: injectData.updates });
            console.log(obj)
        }
    });
}