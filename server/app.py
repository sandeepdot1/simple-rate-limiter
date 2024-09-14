from flask import Flask, request, jsonify
from flask_cors import CORS
import time

from user import User
from rate_limiter import SimpleRateLimiter


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

rate_limiter = SimpleRateLimiter()


@app.route('/api/set_limit', methods=['POST'])
def set_limit():
    data = request.json
    user_id = data.get('user_id')
    limit = data.get('limit')
    period = data.get('period')

    if not user_id or not isinstance(limit, int) or not isinstance(period, int):
        return jsonify({"message": "Invalid input", "status": "error"}), 400
    if not rate_limiter.request_user_present(user_id):
        rate_limiter.set_limit(user_id, limit, period)

    return jsonify({"message": f"Rate limit set for user: {user_id}", "user_id": f"{user_id}", "status": "success"}), 200


@app.route('/api/resource', methods=['GET'])
def access_resource():
    user_id = request.args.get('user_id', 'default_user')

    if not rate_limiter.request_user_present(user_id):
        return jsonify({"message": f"Please set a limit first for user: {user_id}", "user_id": f"{user_id}", "status": "error"}), 400
    
    request_allowed, request_wait_time = rate_limiter.allow_request(user_id)

    if request_allowed:
        return jsonify({"message": f"Request allowed for user: {user_id}", "user_id": f"{user_id}", "status": "success"}), 200
    else:
        return jsonify({"message": "Rate limit exceeded", "time_remaining": request_wait_time, "user_id": f"{user_id}", "status": "error"}), 429


# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)