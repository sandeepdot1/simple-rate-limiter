let limitSet = false;
let countdownInterval = null;

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
        clearInterval(countdownInterval);
        if (response.ok) {
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').className = 'success';
        } else {
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').className = 'error';
        }
    } catch (error) {
        clearInterval(countdownInterval);
        document.getElementById('message').textContent = "Error setting limit.";
        document.getElementById('message').className = 'error';
    }
});

document.getElementById('test-api').addEventListener('click', async function() {
    const username = document.getElementById('username').value;

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/resource?user_id=${encodeURIComponent(username)}`);
        
        const result = await response.json();
        if (response.ok) {
            clearInterval(countdownInterval);
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').className = 'success';
        } else {
            // Check if the response contains time remaining for the next request
            rateLimitExceededMsg = `Rate limit exceeded for user: ${result.user_id}! Try again in ${result.time_remaining} seconds.`;

            if (result.time_remaining) {
                startCountdown(result.time_remaining, result.user_id);
                document.getElementById('message').textContent = rateLimitExceededMsg
                document.getElementById('message').className = 'error';
            } else {
                clearInterval(countdownInterval);
                document.getElementById('message').textContent = rateLimitExceededMsg;
                document.getElementById('message').className = 'error';
            }
        }
    } catch (error) {
        clearInterval(countdownInterval);
        document.getElementById('message').textContent = "Error testing API.";
        document.getElementById('message').className = 'error';
    }
});

// Function to start the countdown
function startCountdown(seconds, user_id) {
    clearInterval(countdownInterval);  // Clear any existing countdown to prevent overlap

    countdownInterval = setInterval(() => {
        if (seconds > 0) {
            document.getElementById('message').textContent = `Rate limit exceeded for user: ${user_id}! Try again in ${seconds} seconds.`;
            document.getElementById('message').className = 'error';
            seconds--;
        } else {
            clearInterval(countdownInterval);
            document.getElementById('message').textContent = `user: ${user_id}  can now make a request!`;
            document.getElementById('message').className = 'success';
        }
    }, 1000);  // Update every second
}
