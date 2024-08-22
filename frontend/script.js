let limitSet = false;

document.getElementById('set-limit').addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const limit = document.getElementById('limit').value;
    const period = document.getElementById('period').value;

    if (!username || !limit || !period) {
        document.getElementById('message').textContent = "Please fill in all fields.";
        document.getElementById('message').className = 'error';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/set_limit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: username,
                limit: parseInt(limit),
                period: parseInt(period)
            })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').className = 'success';
            limitSet = true;
        } else {
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').className = 'error';
        }
    } catch (error) {
        document.getElementById('message').textContent = "Error setting limit.";
        document.getElementById('message').className = 'error';
    }
});

document.getElementById('test-api').addEventListener('click', async function() {
    if (!limitSet) {
        document.getElementById('message').textContent = "Please set a limit first.";
        document.getElementById('message').className = 'error';
        return;
    }

    const username = document.getElementById('username').value;

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/resource?user_id=${encodeURIComponent(username)}`);

        const result = await response.json();
        if (response.ok) {
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').className = 'success';
        } else {
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').className = 'error';
        }
    } catch (error) {
        document.getElementById('message').textContent = "Error testing API.";
        document.getElementById('message').className = 'error';
    }
});
