// clear chrome sync storage
chrome.storage.sync.clear();

let button = document.getElementById('switchButton');
let tableRows = document.getElementsByTagName('tbody')[0];

sleep = async (ms)=>{ return new Promise(resolve => setTimeout(resolve, ms)); }

// create a chrome notification
function createNotification(title, message) {
    var options = { type: "basic", title: title, message: message, iconUrl: "src/img/icon.png" };
    chrome.notifications.create(options);
}

// get data from chrome storage and save it in global variable data
let n = 0

// let loc = 'Vancouver B'
let loc = 'Monterrey B'

// start function
start = async() => {
    await sleep(200)
    console.log('Starting...')

    chrome.runtime.sendMessage({isStarted: true});
}

// stop function
stop = () => {
    chrome.runtime.sendMessage({isStarted: false});
    console.log('Stopping...')
}

// add event listener to button
button.addEventListener('click', function() {
    if (button.innerText == 'Start') {
        button.innerText = 'Stop'
        start()
        createNotification("Hello", "Welcome to the Telegram Monitor extension");
    } else {
        button.innerText = 'Start'
        stop()
    }
})

function updateView() {
    // load all objs in updates from chrome storage to the data object array
    chrome.storage.sync.get('updates', (data) => {
        tableRows.innerHTML = ''
        // check if the length of data.updates is n
        if (!data.updates) {
            console.log('updates is undefined')
        } else {
            console.log(n)
            if (data.updates.length != n) {
                // if it is not n, then n = data.updates.length
                n = data.updates.length
                // load all objs and index in updates from chrome storage to the data object array
                data.updates.forEach((e, i) => {
                    if (e.location == loc) {
                        let row = `<td>${e.fromDate}</td><td>${e.toDate}</td><td>${e.updatedTime}</td>`
                        tableRows.insertRow().innerHTML = row
                        if (i == data.updates.length - 1) {
                            createNotification("New update", `${loc} ${e.updatedTime}: ${e.fromDate} -> ${e.toDate}`)
                        }
                    }
                })
            } else {
                if (n == 0) {
                    console.log('no data')
                } else {
                    n = data.updates.length
                    data.updates.forEach((e) => {
                        if (e.location == loc) {
                            let row = `<td>${e.fromDate}</td><td>${e.toDate}</td><td>${e.updatedTime}</td>`
                            tableRows.insertRow().innerHTML = row
                        }
                    })
                }
            }
        }
    });
}

// update view every 200 ms if button.innerText == 'Stop'
setInterval(() => {
    if (button.innerText == 'Stop') {
        updateView()
    }
}, 200);
