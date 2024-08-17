import time
from collections import deque


class Weather:
    def __init__(self) -> None:
        self.request_times = {}

    def show(self, user):
        if not self.check_limit(user):
            print("API RESPONSE: Currrent weather is 23C")
    
    def check_limit(self, user):
        time_s = int(time.time())
        user_id = user.user_id

        if user_id not in self.request_times:
            self.request_times[user_id] = deque()

        timestamps = self.request_times[user_id]

        while len(timestamps) and time_s - timestamps[0] > 60:
            print(f"{time_s, timestamps[0]}")
            timestamps.popleft()

        if len(timestamps) >= 5:
            print(f"API RESPONSE: Rate limit exceeded. {user.name} Try again in {60 - (time_s - timestamps[0])} seconds.")
            return True
        
        timestamps.append(time_s)
        return False