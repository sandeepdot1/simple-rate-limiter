import time
from collections import deque


class SimpleRateLimiter:
    def __init__(self) -> None:
        self.request_times = {}
        self.limit = 5  # max requests per interval
        self.interval = 60  # interval (in sec)
    
    def request_user_present(self, user_id):
        return (user_id in self.request_times)

    def set_limit(self, user_id, limit, period):
        self.limit = limit
        self.interval = period

        if not self.request_user_present(user_id):
            self.request_times[user_id] = deque()


    def allow_request(self, user_id):
        current_time = int(time.time())

        timestamps = self.request_times[user_id]
        
        curr_time_diff = 0
        if len(timestamps):
            curr_time_diff = current_time - timestamps[0]
        
        while len(timestamps) and curr_time_diff > self.interval:
            timestamps.popleft()

        if len(timestamps) >= self.limit:
            return False, self.interval - curr_time_diff
        
        timestamps.append(current_time)
        return True, self.interval - curr_time_diff
