import json
import time
import redis as redislib
from shared.models import JobOutcome
from scheduler.reward import compute_reward

redis = redislib.Redis(host='localhost', port=6379, decode_responses=True)
def record_outcome(outcome: JobOutcome) -> float:
    reward = compute_reward(outcome)
    payload = {
        "job_id":                         outcome.job_id,
        "assigned_nodes":                 outcome.assigned_nodes,
        "actual_hrs":                     outcome.actual_hrs,
        "estimated_hrs":                  outcome.estimated_hrs,
        "dropout_count":                  outcome.dropout_count,
        "accuracy_gap":                   outcome.accuracy_gap,
        "high_reliability_nodes_skipped": outcome.high_reliability_nodes_skipped,
        "completed":                      outcome.completed,
        "reward":                         reward,
        "recorded_at":                    time.time(),
    }
    redis.set(f"outcome:{outcome.job_id}", json.dumps(payload))
    redis.rpush("reward_log", json.dumps(payload))
    print(f"[reward_collector] job={outcome.job_id}  reward={reward:.3f}")
    return reward

def get_outcome(job_id: str) -> dict | None:
    raw = redis.get(f"outcome:{job_id}")
    return json.loads(raw) if raw else None

def get_recent_rewards(n: int = 50) -> list[dict]:
    raw_entries = redis.lrange("reward_log", -n, -1)
    return [json.loads(e) for e in raw_entries]

def get_average_reward(n: int = 50) -> float:
    recent = get_recent_rewards(n)
    if not recent:
        return 0.0
    return sum(r['reward'] for r in recent) / len(recent)