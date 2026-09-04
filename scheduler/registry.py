import json
import time
import redis as redislib
from shared.models import NodeProfile
from scheduler.trust import get_trust_score, get_tier

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
        ram_gb=data.get('ram_gb', 0.0),
        cpu_score=data.get('cpu_score', 0.0),
        gpu_available=data.get('gpu_available', False),
        gpu_vram_gb=data.get('gpu_vram_gb', 0.0),        # added
        reliability_30d=data.get('reliability_30d', 0.5),
        trust_score=get_trust_score(node_id),
        trust_tier=get_tier(node_id),                     # added
        session_age_hrs=data.get('session_age_hrs', 0.0),
        dropout_hour_risk=data.get('dropout_hour_risk', 0.0),
        last_heartbeat=data['last_heartbeat'],
        institution=data.get('institution', None),        # added
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