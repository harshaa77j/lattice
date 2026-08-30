from scheduler.obs_builder import build_obs  

_policy_cache = None
def load_policy(checkpoint_path: str = "checkpoints/latest"):
    global _policy_cache
    if _policy_cache is None:
        # TODO: wire up to whatever RL library trains the policy (e.g. RLlib,
        # stable-baselines3). Placeholder until training pipeline exists.
        raise NotImplementedError(
            "load_policy() not wired up yet — _USE_RL must stay False in "
            "policy.py until a trained checkpoint exists."
        )
    return _policy_cache