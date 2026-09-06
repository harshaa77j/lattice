"""
scheduler/environment.py

Day 5 skeleton: SchedulingEnv with observation_space, action_space,
_sample_job(), _sample_nodes(), and _build_obs() — the last of which just
wraps the shared build_obs() from obs_builder.py so training-side and
inference-side (policy.py / rl_loader.py) observations can never drift apart.
"""
import random
import time
from typing import List, Tuple

import gymnasium as gym
import numpy as np
from gymnasium import spaces

from shared.models import JobRequest, NodeProfile, JobOutcome
from scheduler.obs_builder import build_obs, OBS_DIM, N_NODES
from scheduler.reward import compute_reward

TRUST_TIERS = ["gold", "silver", "bronze"]


class SchedulingEnv(gym.Env):
    """
    Single-job-per-step scheduling environment.

    Each step: agent sees state (job + up to N_NODES candidate nodes),
    picks a binary vector of which nodes get the job, environment "runs"
    the job (currently faked — see _fake_outcome), reward is computed,
    a new job + node set is sampled for the next step.
    """

    def __init__(self, max_timesteps: int = 100):
        super().__init__()
        self.max_timesteps = max_timesteps
        self.current_timestep = 0

        self.observation_space = spaces.Box(
            low=0.0, high=1.0, shape=(OBS_DIM,), dtype=np.float32
        )
        self.action_space = spaces.MultiBinary(N_NODES)

        self._job: JobRequest | None = None
        self._nodes: List[NodeProfile] = []
        # Ordering build_obs() actually used (sorted by node_id, truncated to
        # N_NODES). action[i] must be mapped against this, never against
        # self._nodes[i] — self._nodes is unsorted and untruncated, so
        # indexing it directly reproduces the obs/action mismatch bug that
        # BuiltObs exists to prevent (CONTEXT.md section 4).
        self._obs_ordering: List[NodeProfile] = []

    def reset(self, *, seed=None, options=None) -> Tuple[np.ndarray, dict]:
        super().reset(seed=seed)
        self.current_timestep = 0
        self._job = self._sample_job()
        self._nodes = self._sample_nodes()
        return self._build_obs(), {}

    def step(self, action: np.ndarray) -> Tuple[np.ndarray, float, bool, bool, dict]:
        # Map against self._obs_ordering, not self._nodes: self._nodes is
        # unsorted/untruncated, so action[i] would point at the wrong node.
        assigned_nodes = [
            n.node_id for i, n in enumerate(self._obs_ordering) if i < len(action) and action[i] == 1
        ]

        outcome = self._fake_outcome(self._job, assigned_nodes)
        reward = compute_reward(outcome)

        self.current_timestep += 1
        terminated = self.current_timestep >= self.max_timesteps

        self._job = self._sample_job()
        self._nodes = self._sample_nodes()
        obs = self._build_obs()

        return obs, reward, terminated, False, {"outcome": outcome}

    def _build_obs(self) -> np.ndarray:
        """
        Thin wrapper around the shared build_obs() — do not reimplement the
        vector-building logic here. This is the method Person B's parity
        test calls as `a_env._build_obs()`.

        Returns the bare vector (Gymnasium requires obs to be just the
        array) but stashes the node ordering build_obs() used on
        self._obs_ordering, since step() needs it to map action[i] back to
        the right node.
        """
        built = build_obs(self._job, self._nodes)
        self._obs_ordering = built.nodes
        return built.vector

    def _sample_job(self) -> JobRequest:
        """Fake job for testing before real job data exists."""
        return JobRequest(
            job_id=f"job_{random.randint(1000, 9999)}",
            researcher_id="researcher_test",
            model_file_path="models/test.pt",
            dataset_path="data/test.csv",
            epochs=random.randint(1, 20),
            batch_size=random.choice([16, 32, 64, 128]),
            learning_rate=0.001,
            ram_required_gb=round(random.uniform(2, 32), 1),
            min_trust_tier=random.choice(TRUST_TIERS),
            is_federated=random.choice([True, False]),
            model_size_mb=round(random.uniform(50, 4000), 1),
            dataset_size_gb=round(random.uniform(0.1, 50), 2),
            submitted_at=time.time(),
        )

    def _sample_nodes(self) -> List[NodeProfile]:
        """Fake nodes for testing before real Redis heartbeat data exists."""
        n = random.randint(1, N_NODES)
        nodes = []
        for i in range(n):
            nodes.append(NodeProfile(
                node_id=f"node_{i}",
                ram_gb=round(random.uniform(4, 64), 1),
                cpu_score=round(random.uniform(0, 1), 2),
                gpu_available=random.choice([True, False]),
                gpu_vram_gb=round(random.uniform(0, 24), 1),
                reliability_30d=round(random.uniform(0, 1), 2),
                trust_score=random.randint(0, 100),
                trust_tier=random.choice(["Gold", "Silver", "Bronze"]),
                session_age_hrs=round(random.uniform(0, 48), 1),
                dropout_hour_risk=round(random.uniform(0, 1), 2),
                last_heartbeat=time.time(),
            ))
        return nodes

    def _fake_outcome(self, job: JobRequest, assigned_nodes: List[str]) -> JobOutcome:
        """
        Fakes what would normally come from reward_collector.py / real job
        execution. Placeholder until the env is wired to real training runs.
        """
        estimated_hrs = max(job.model_size_mb / 500.0, 0.5)
        dropout_count = sum(1 for _ in assigned_nodes if random.random() < 0.1)
        return JobOutcome(
            job_id=job.job_id,
            assigned_nodes=assigned_nodes,
            actual_hrs=estimated_hrs * random.uniform(0.7, 1.5),
            estimated_hrs=estimated_hrs,
            dropout_count=dropout_count,
            accuracy_gap=round(random.uniform(0, 0.1), 3),
            high_reliability_nodes_skipped=random.randint(0, 2),
            completed=len(assigned_nodes) > 0,
        )


if __name__ == "__main__":
    env = SchedulingEnv()
    obs, _ = env.reset()
    print(f"obs shape: {obs.shape}")
    action = env.action_space.sample()
    obs, reward, terminated, truncated, info = env.step(action)
    print(f"reward: {reward:.3f}")