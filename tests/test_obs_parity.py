import numpy as np
import time
from shared.models import JobRequest, NodeProfile
from scheduler.obs_builder import build_obs, OBS_DIM
from scheduler.environment import SchedulingEnv

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

def test_obs_shape():
    job = make_test_job()
    nodes = make_test_nodes()
    obs = build_obs(job, nodes, episode_progress=0.5)
    assert obs.shape == (OBS_DIM,), \
        f"Wrong shape: {obs.shape}, expected ({OBS_DIM},)"
    assert obs.dtype == np.float32
    assert obs.min() >= 0.0
    assert obs.max() <= 1.0
    print(f"PASS: obs shape {obs.shape}, "
          f"min={obs.min():.3f}, max={obs.max():.3f}")

def test_env_obs_matches_builder():
    """
    Critical parity test.
    Environment._build_obs() must match build_obs() directly.
    """
    env = SchedulingEnv()
    env.reset()

    job = env._job
    nodes = env._nodes
    progress = env.current_timestep / env.max_timesteps

    obs_from_env = env._build_obs()
    obs_from_builder = build_obs(job, nodes,
                                  episode_progress=progress)

    assert np.allclose(obs_from_env, obs_from_builder), \
        "FAIL: env._build_obs() != build_obs() — drift detected"
    print("PASS: environment and builder produce identical observations")

def test_deterministic():
    """Same input must always produce same output."""
    job = make_test_job()
    nodes = make_test_nodes()
    obs1 = build_obs(job, nodes, episode_progress=0.3)
    obs2 = build_obs(job, nodes, episode_progress=0.3)
    assert np.allclose(obs1, obs2), \
        "FAIL: build_obs() is not deterministic"
    print("PASS: build_obs() is deterministic")

if __name__ == "__main__":
    test_obs_shape()
    test_env_obs_matches_builder()
    test_deterministic()
    print("\nAll parity tests passed.")
    print("Person B: run this against your policy.py._build_obs()")
    print("and assert np.allclose(your_obs, build_obs(job, nodes))")