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
        alert(data.message);
    } catch (error) {
        alert('Login failed');
    }
}

async function makeCall() {
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
    } catch (error) {
        alert('Call failed');
    }
}

async function loadCallHistory(userId = '101') {
    try {
        const response = await fetch(`/calls/history/${userId}`);
        const callHistory = await response.json();

        const historyContainer = document.getElementById('callHistory');
        historyContainer.innerHTML = callHistory.map(log =>
            `<p>${log.caller} → ${log.receiver} (${log.duration})</p>`
        ).join('');
    } catch (error) {
        console.error('Error loading call history:', error);
    }
}
