import time
from collections import deque


class SimpleRateLimiter:
    def __init__(self) -> None:
        self.request_times = {}
        self.limit = 5  # max requests per interval
        self.interval = 60  # interval (in sec)
    

    def set_limit(self, user_id, limit, period):
        self.limit = limit
        self.interval = period

        if user_id not in self.request_times:
            self.request_times[user_id] = deque()


    def allow_request(self, user_id):
        current_time = int(time.time())

        timestamps = self.request_times[user_id]

        while len(timestamps) and current_time - timestamps[0] > self.interval:
            print(f"{current_time, timestamps[0]}")
            timestamps.popleft()

        if len(timestamps) >= self.limit:
            return False
        
        timestamps.append(current_time)
        return True
