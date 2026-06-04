import json
import time
import redis as redislib
from shared.models import NodeProfile
from scheduler.trust import get_trust_score
redis = redislib.Redis(host='localhost', port=6379, decode_responses=True)
HEARTBEAT_TTL_SECONDS = 60
def register_heartbeat(node_id: str, data: dict) -> None:
    data['last_heartbeat'] = time.time()
    redis.set(f'heartbeat:{node_id}', json.dumps(data))

def build_node_profile(node_id: str) -> NodeProfile | None:
    raw = redis.get(f'heartbeat:{node_id}')
    if not raw:
        return None
    data = json.loads(raw)
    return NodeProfile(
        node_id=node_id,
        ram_gb=data['ram_gb'],
        cpu_score=data['cpu_score'],
        gpu_available=data.get('gpu_available', False),
        reliability_30d=data['reliability_30d'],
        trust_score=get_trust_score(node_id),
        session_age_hrs=data['session_age_hrs'],
        dropout_hour_risk=data['dropout_hour_risk'],
        last_heartbeat=data['last_heartbeat'],
    )

def get_available_nodes() -> list[NodeProfile]:
    now = time.time()
    keys = redis.keys('heartbeat:*')
    nodes = []
    for key in keys:
        node_id = key.split(':', 1)[1]
        profile = build_node_profile(node_id)
        if profile is None:
            continue
        if (now - profile.last_heartbeat) <= HEARTBEAT_TTL_SECONDS:
            nodes.append(profile)
    return nodes