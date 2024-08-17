import time

from user import User
from weather import Weather


sandeep = User("Sandeep")
weather_api = Weather()

for i in range(100):
    weather_api.show(sandeep)
    time.sleep(1)
