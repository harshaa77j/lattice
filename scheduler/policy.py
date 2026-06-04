from shared.models import JobRequest, NodeProfile
from typing import List
_USE_RL = False

def select_nodes(job: JobRequest,
                 available_nodes: List[NodeProfile]) -> List[str]:
    if _USE_RL:
        return _rl_select(job, available_nodes)
    return _heuristic_select(job, available_nodes)

def _heuristic_select(job: JobRequest,
                      nodes: List[NodeProfile]) -> List[str]:
    eligible = [
        n for n in nodes
        if n.ram_gb >= job.ram_required_gb
        and n.trust_score >= job.min_trust_tier
    ]
    eligible.sort(key=lambda n: n.reliability_30d, reverse=True)
    return [n.node_id for n in eligible[:5]]

def _rl_select(job: JobRequest,
               nodes: List[NodeProfile]) -> List[str]:
    from scheduler.rl_loader import load_policy, build_obs #type: ignore
    policy = load_policy()
    obs = build_obs(job, nodes)
    action = policy.compute_single_action(obs)
    return [nodes[i].node_id for i, a in enumerate(action) if a == 1]