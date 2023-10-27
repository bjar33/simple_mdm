// Register device using the form
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('deviceId').value;
    const name = document.getElementById('deviceName').value;
    const model = document.getElementById('deviceModel').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name, model })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        loadDevices();
    });
});

// Load list of devices
function loadDevices() {
    fetch('/devices')
    .then(response => response.json())
    .then(data => {
        const deviceList = document.getElementById('deviceList');
        deviceList.innerHTML = '';
        data.forEach(device => {
            const li = document.createElement('li');
            li.textContent = `${device.name} (${device.model}) - ID: ${device.id}`;
            deviceList.appendChild(li);
        });
    });
}

// Initially load devices
loadDevices();
