from datetime import datetime, timedelta
import random

times = []
repeats = 2
samples = 10000000

for i in range(0,repeats):
    start = datetime.now()
    for j in range(0,samples):
        random.random()
    end = datetime.now()
    dt = (end - start).total_seconds() * 1000
    times.append(dt)

rand_fn_dt_ms = sum(times)/(repeats*samples)
print("Mean time per iteration (ms): ", rand_fn_dt_ms)