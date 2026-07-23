"""
The 77-dim RL observation vector is built here.
If the spec doc changes, this is the only file that needs to change.
"""

from typing import List
import numpy as np
from shared.models import JobRequest, NodeProfile

N_NODES = 10
NODE_FEATURES = 7
JOB_FEATURES = 6
OBS_DIM = N_NODES * NODE_FEATURES + JOB_FEATURES + 1  # 77
TRUST_TIER_MAP = {"gold": 1.0, "silver": 0.66, "bronze": 0.33}

def _node_features(node: NodeProfile) -> List[float]:
    #normalization
    return [
        node.cpu_score,                                  
        1.0 if node.gpu_available else 0.0,
        min(node.gpu_vram_gb / 32.0, 1.0),
        node.reliability_30d,                             
        node.trust_score / 100.0,
        node.dropout_hour_risk,                           
        min(node.session_age_hrs / 24.0, 1.0),
    ]

def _job_features(job: JobRequest) -> List[float]:
    #6 job features, normalized to ~[0, 1]
    tier = TRUST_TIER_MAP.get(job.min_trust_tier.lower(), 0.0)
    compute_load = np.log1p(job.epochs * job.batch_size) / np.log1p(10_000)
    return [
        min(job.ram_required_gb / 64.0, 1.0),
        min(job.model_size_mb / 5000.0, 1.0),
        min(job.dataset_size_gb / 100.0, 1.0),
        tier,
        1.0 if job.is_federated else 0.0,
        min(compute_load, 1.0),
    ]

def build_obs(
    job: JobRequest,
    nodes: List[NodeProfile],
    episode_progress: float = 0.0,
) -> np.ndarray:

    #Build the 77-dim observation vector for a (job, nodes) pair.
    sorted_nodes = sorted(nodes, key=lambda n: n.node_id)[:N_NODES]

    obs: List[float] = []
    for i in range(N_NODES):
        if i < len(sorted_nodes):
            obs.extend(_node_features(sorted_nodes[i]))
        else:
            obs.extend([0.0] * NODE_FEATURES)

    obs.extend(_job_features(job))
    obs.append(min(max(episode_progress, 0.0), 1.0))
    result = np.array(obs, dtype=np.float32)
    assert result.shape == (OBS_DIM,), f"expected {OBS_DIM}-dim obs, got {result.shape}"
    return result