let isLoggedIn = false;
let currentSession = null;

async function login() {
    const extension = document.getElementById('extension').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ extension, password })
        });

        const data = await response.json();
        if (response.ok) {
            isLoggedIn = true;
            updateStatus('Connected');
            alert(data.message);
            loadCallHistory();
        } else {
            updateStatus('Not Connected');
            alert(data.message);
        }
    } catch (error) {
        updateStatus('Not Connected');
        alert('Login failed');
    }
}

function updateStatus(status) {
    document.getElementById('status').textContent = status;
}

async function makeCall() {
    if (!isLoggedIn) {
        alert('Please login first');
        return;
    }
    const number = document.getElementById('number').value;
    if (!number) {
        alert('Please enter a number to call');
        return;
    }
    try {
        const response = await fetch('/call/make', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number })
        });
        const data = await response.json();
        alert(data.message);
        // Simulate call start
        currentSession = { number, startTime: new Date() };
        updateStatus('In Call');
    } catch (error) {
        alert('Call failed');
    }
}

function hangup() {
    if (currentSession) {
        const endTime = new Date();
        const duration = Math.floor((endTime - currentSession.startTime) / 1000);
        storeCallHistory(currentSession.number, duration);
        currentSession = null;
        updateStatus('Connected');
        alert('Call ended');
        loadCallHistory();
    } else {
        alert('No active call');
    }
}

function mute() {
    alert('Mute functionality - placeholder');
}

function unmute() {
    alert('Unmute functionality - placeholder');
}

function hold() {
    alert('Hold functionality - placeholder');
}

function unhold() {
    alert('Unhold functionality - placeholder');
}

function transfer() {
    alert('Transfer functionality - placeholder');
}

function storeCallHistory(number, duration) {
    const history = JSON.parse(localStorage.getItem('callHistory') || '[]');
    history.push({ number, duration, timestamp: new Date().toISOString() });
    localStorage.setItem('callHistory', JSON.stringify(history));
}

function loadCallHistory() {
    const history = JSON.parse(localStorage.getItem('callHistory') || '[]');
    const historyContainer = document.getElementById('callHistory');
    historyContainer.innerHTML = history.map(log =>
        `<p>${log.number} - ${log.duration}s - ${new Date(log.timestamp).toLocaleString()}</p>`
    ).join('');
}

async function loadCallHistory(userId = '101') {
    // Keep server history if needed, but now using local
    loadCallHistory();
}
