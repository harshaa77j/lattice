from shared.models import JobRequest, NodeProfile
from typing import List

_USE_RL = False

TIER_THRESHOLDS = {
    'gold':   85,
    'silver': 65,
    'bronze': 40,
}

def _resolve_trust_threshold(min_trust_tier: str) -> int:
    return TIER_THRESHOLDS.get(min_trust_tier.lower(), 40)


def select_nodes(job: JobRequest,
                 available_nodes: List[NodeProfile]) -> dict:
    if _USE_RL:
        return _rl_select(job, available_nodes)
    return _heuristic_select(job, available_nodes)


def _heuristic_select(job: JobRequest,
                      nodes: List[NodeProfile]) -> dict:
    threshold = _resolve_trust_threshold(job.min_trust_tier)

    chosen = []
    skipped = []

    for n in nodes:
        if n.ram_gb < job.ram_required_gb:
            skipped.append({
                "node_id": n.node_id,
                "reason": f"insufficient RAM ({n.ram_gb}GB < {job.ram_required_gb}GB)"
            })
        elif n.trust_score < threshold:
            skipped.append({
                "node_id": n.node_id,
                "reason": f"trust too low ({n.trust_score} < {threshold}, tier={n.trust_tier})"
            })
        else:
            chosen.append(n)

    chosen.sort(key=lambda n: n.reliability_30d, reverse=True)
    chosen = chosen[:5]

    return {
        "chosen": [n.node_id for n in chosen],
        "skipped": skipped,
        "log": [
            f"chose {n.node_id} (trust={n.trust_score}, tier={n.trust_tier}, reliability={n.reliability_30d})"
            for n in chosen
        ]
    }


def _rl_select(job: JobRequest,
               nodes: List[NodeProfile]) -> dict:
    from scheduler.rl_loader import load_policy, build_obs  # type: ignore
    policy = load_policy()
    obs = build_obs(job, nodes)
    action = policy.compute_single_action(obs)
    chosen_ids = [nodes[i].node_id for i, a in enumerate(action) if a == 1]
    return {
        "chosen": chosen_ids,
        "skipped": [],
        "log": [f"RL policy selected {nid}" for nid in chosen_ids]
    }