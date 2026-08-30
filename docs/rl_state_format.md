# RL State Format Spec

## Overview

The scheduler's observation is a flat vector of **77 dimensions**:

```
[ node_0 features (7) ][ node_1 features (7) ] ... [ node_9 features (7) ][ job features (6) ][ episode_progress (1) ]
     0-6                    7-13                        63-69                  70-75                76
```

- **N = 10 node slots.** If fewer than 10 nodes are online/eligible, remaining slots are zero-padded. This matches the action space (`MultiBinary(10)`), so state slot `i` and action slot `i` always refer to the same node.
- N is a config constant, not architecture — bump it later when the node pool grows. (Note: if the network scales into the hundreds of nodes, a flat per-node vector stops making sense and this should be revisited — e.g. top-K candidate filtering or a graph/attention-based policy instead.)
- Nodes are sorted by `node_id` each step so slot assignment is stable within an episode (avoids the agent learning spurious position-based patterns).

## Per-node features (7 × 10 = 70 dims)

Selected from `NodeProfile`. A field is included only if it plausibly affects *which node should get a job chunk*.

| # | Feature | Source field | Normalization | Why included |
|---|---|---|---|---|
| 1 | `cpu_score` | `cpu_score` | already 0-1 | core compute capacity |
| 2 | `gpu_available` | `gpu_available` | 0/1 | filters GPU-requiring jobs |
| 3 | `gpu_vram_gb` | `gpu_vram_gb` | /32 (clip 0-1) | GPU jobs need enough VRAM |
| 4 | `reliability_30d` | `reliability_30d` | already 0-1 | direct dropout predictor |
| 5 | `trust_score` | `trust_score` | /100 | matches job's `min_trust_tier` filter |
| 6 | `dropout_hour_risk` | `dropout_hour_risk` | already 0-1 | time-of-day dropout signal |
| 7 | `session_age_hrs` | `session_age_hrs` | /24 (clip 0-1) | proxy for "likely to stay online" |

**Excluded from `NodeProfile`:** `node_id`, `institution` (identifiers, not numeric signal), `last_heartbeat` (used to *filter* eligible nodes before building the state, not as a raw feature — a raw unix timestamp carries no learnable signal), `ram_gb` (only meaningful relative to the job's `ram_required_gb`; not included as a raw value — see open question below), `trust_tier` (redundant with `trust_score`, which is already continuous).

## Job features (6 dims)

Selected from `JobRequest`. A field is included only if it affects node suitability or the reward the agent will receive.

| # | Feature | Source field | Normalization | Why included |
|---|---|---|---|---|
| 71 | `ram_required_gb` | `ram_required_gb` | /64 (clip 0-1) | hard eligibility constraint vs. node RAM |
| 72 | `model_size_mb` | `model_size_mb` | /5000 (clip 0-1) | drives transfer time → affects speed reward |
| 73 | `dataset_size_gb` | `dataset_size_gb` | /100 (clip 0-1) | transfer/IO cost, esp. for federated jobs |
| 74 | `min_trust_tier` | `min_trust_tier` | GOLD=1.0, SILVER=0.66, BRONZE=0.33 | hard filter the agent should learn to respect |
| 75 | `is_federated` | `is_federated` | 0/1 | changes whether `accuracy_gap` is meaningful |
| 76 | `compute_load` | `epochs * batch_size` | log-scaled, clip 0-1 | proxy for total compute time |

**Excluded from `JobRequest`:** `job_id`, `researcher_id`, `model_file_path`, `dataset_path` (identifiers), `learning_rate` (affects training quality, not which node runs it), `submitted_at` (not tracked yet — revisit if queue wait time becomes a feature).

## Global feature (1 dim)

| # | Feature | Definition | Why included |
|---|---|---|---|
| 77 | `episode_progress` | `current_timestep / max_timesteps` | lets policy learn urgency near episode end |

## Open questions (for later)

1. `ram_gb - ram_required_gb` (headroom) might be a more useful per-node feature than raw `ram_required_gb` alone in the job block — open to combining these into a derived per-node "fits" signal instead.
2. Node sort order (by `node_id`) is a placeholder — fine for now, but worth revisiting if we want slot assignment to reflect something meaningful (e.g. sort by reliability).
3. Normalization caps (e.g. `/64` for RAM, `/5000` for model size) are rough guesses — should be revisited once we have real data distributions from actual nodes/jobs.

