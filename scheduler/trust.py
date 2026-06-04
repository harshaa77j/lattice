import redis as redislib
redis = redislib.Redis(host='localhost', port=6379, decode_responses=True)

TRUST_TIERS = {
    'Gold':   85,
    'Silver': 65,
    'Bronze': 40,
}

TRUST_DELTAS = {
    'epoch_complete':    +3,
    'job_complete':      +5,
    'mid_epoch_dropout': -7,
    'gradient_spike':    -10,
}

DEFAULT_SCORE = 50

def get_trust_score(node_id: str) -> int:
    raw = redis.get(f'trust:{node_id}')
    return int(raw) if raw else DEFAULT_SCORE

def update_trust(node_id: str, event: str) -> int:
    if event not in TRUST_DELTAS:
        raise ValueError(f"Unknown trust event: '{event}'. "
                         f"Valid events: {list(TRUST_DELTAS.keys())}")
    score = get_trust_score(node_id)
    score = max(0, min(100, score + TRUST_DELTAS[event]))
    redis.set(f'trust:{node_id}', score)
    return score

def get_tier(node_id: str) -> str:
    score = get_trust_score(node_id)
    for tier, threshold in sorted(TRUST_TIERS.items(), key=lambda x: -x[1]):
        if score >= threshold:
            return tier
    return 'Suspended'
def reset_trust(node_id: str) -> None:
    redis.set(f'trust:{node_id}', DEFAULT_SCORE)