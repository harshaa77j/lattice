"""
CONTEXT.md section 4: this file used to compare build_obs() against
env._build_obs(), which just calls build_obs() itself — that assertion could
never fail. The actual drift risk is between a NodeProfile assembled from a
live Redis heartbeat (Person B's scheduler/registry.py::build_node_profile)
and one this simulator invents directly. This file compares those two
construction paths, with Redis and trust.py mocked out so it runs with no
live services.
"""
import json
import time
from unittest.mock import MagicMock, patch

import numpy as np
import pytest

from shared.models import JobRequest, NodeProfile
from scheduler import registry
from scheduler.obs_builder import build_obs, OBS_DIM


def make_test_job():
    return JobRequest(
        job_id="parity_test",
        researcher_id="test",
        model_file_path="test.pt",
        dataset_path="test.csv",
        epochs=10,
        batch_size=32,
        learning_rate=0.001,
        ram_required_gb=8.0,
        min_trust_tier="gold",
        is_federated=False,
        model_size_mb=100.0,
        dataset_size_gb=1.0,
        submitted_at=time.time()
    )


def make_test_nodes():
    return [NodeProfile(
        node_id=f"node_{i}",
        ram_gb=16.0,
        cpu_score=0.8,
        gpu_available=True,
        gpu_vram_gb=8.0,
        reliability_30d=0.9,
        trust_score=85,
        trust_tier="gold",
        session_age_hrs=2.0,
        dropout_hour_risk=0.1,
        last_heartbeat=time.time()
    ) for i in range(3)]


# The subset of fields a real node heartbeat carries, per
# registry.register_heartbeat() / build_node_profile(). Shared between the
# two profile-construction helpers below so any obs difference reflects the
# construction path, not different input values.
HEARTBEAT_VALUES = {
    "ram_gb": 16.0,
    "cpu_score": 0.8,
    "gpu_available": True,
    "reliability_30d": 0.9,
    "session_age_hrs": 2.0,
    "dropout_hour_risk": 0.1,
    "last_heartbeat": time.time(),
}
HEARTBEAT_TRUST_SCORE = 85


def build_profile_via_redis_path(node_id: str = "node_redis") -> NodeProfile:
    """
    Exercises Person B's real code path — registry.build_node_profile() —
    against a fake heartbeat, with redis.get() and trust.get_trust_score()
    mocked so no live Redis is needed.
    """
    fake_redis = MagicMock()
    fake_redis.get.return_value = json.dumps(HEARTBEAT_VALUES)
    with patch.object(registry, "redis", fake_redis), \
         patch.object(registry, "get_trust_score", return_value=HEARTBEAT_TRUST_SCORE):
        return registry.build_node_profile(node_id)


def build_profile_via_simulator(node_id: str = "node_redis") -> NodeProfile:
    """
    The equivalent NodeProfile as the simulator would invent, using the same
    underlying values as HEARTBEAT_VALUES/HEARTBEAT_TRUST_SCORE — fields the
    real heartbeat path doesn't carry (gpu_vram_gb, trust_tier) are filled in
    directly, the way _sample_nodes() does.
    """
    return NodeProfile(
        node_id=node_id,
        ram_gb=HEARTBEAT_VALUES["ram_gb"],
        cpu_score=HEARTBEAT_VALUES["cpu_score"],
        gpu_available=HEARTBEAT_VALUES["gpu_available"],
        gpu_vram_gb=8.0,
        reliability_30d=HEARTBEAT_VALUES["reliability_30d"],
        trust_score=HEARTBEAT_TRUST_SCORE,
        trust_tier="gold",
        session_age_hrs=HEARTBEAT_VALUES["session_age_hrs"],
        dropout_hour_risk=HEARTBEAT_VALUES["dropout_hour_risk"],
        last_heartbeat=HEARTBEAT_VALUES["last_heartbeat"],
    )


def test_obs_shape():
    job = make_test_job()
    nodes = make_test_nodes()
    obs = build_obs(job, nodes).vector
    assert obs.shape == (OBS_DIM,), \
        f"Wrong shape: {obs.shape}, expected ({OBS_DIM},)"
    assert obs.dtype == np.float32
    assert obs.min() >= 0.0
    assert obs.max() <= 1.0
    print(f"PASS: obs shape {obs.shape}, "
          f"min={obs.min():.3f}, max={obs.max():.3f}")


@pytest.mark.xfail(
    reason="CONTEXT.md §4: registry.py omits gpu_vram_gb/trust_tier, "
           "owned by Person B, tracked in #decisions-log",
    strict=False,
)
def test_redis_heartbeat_matches_simulator_node():
    """
    Real parity test: a NodeProfile built from a live Redis heartbeat
    (registry.build_node_profile) vs one the simulator invents, given the
    same underlying values, must produce the same observation vector.
    """
    job = make_test_job()
    redis_node = build_profile_via_redis_path()
    sim_node = build_profile_via_simulator()

    obs_redis = build_obs(job, [redis_node]).vector
    obs_sim = build_obs(job, [sim_node]).vector

    assert np.allclose(obs_redis, obs_sim), (
        "FAIL: NodeProfile built from a Redis heartbeat produces a different "
        "obs vector than one the simulator invents from the same underlying "
        "values — drift between the two NodeProfile construction paths."
    )
    print("PASS: Redis-heartbeat path and simulator path agree on obs")


def test_deterministic():
    """Same input must always produce same output."""
    job = make_test_job()
    nodes = make_test_nodes()
    obs1 = build_obs(job, nodes).vector
    obs2 = build_obs(job, nodes).vector
    assert np.allclose(obs1, obs2), \
        "FAIL: build_obs() is not deterministic"
    print("PASS: build_obs() is deterministic")


if __name__ == "__main__":
    # @pytest.mark.xfail only takes effect under pytest's runner — calling
    # the function directly here still raises, so it's guarded to keep this
    # script's behavior consistent with `pytest tests/test_obs_parity.py`.
    # Run under pytest to get proper XFAIL/XPASS reporting.
    test_obs_shape()
    try:
        test_redis_heartbeat_matches_simulator_node()
    except Exception as e:
        print(f"XFAIL (expected, see marker reason): {type(e).__name__}: {e}")
    else:
        print("XPASS: redis/simulator parity held — has Person B's bug been fixed?")
    test_deterministic()
    print("\nParity test run complete.")
    print("Person B: run this against your policy.py._build_obs()")
    print("and assert np.allclose(your_obs, build_obs(job, nodes).vector)")
