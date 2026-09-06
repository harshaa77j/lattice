# CONTEXT.md — Lattice, Person A (RL Environment Engineer)

Read this before touching any code in this repo.

---

## 1. What this project is

A volunteer compute platform for Indian academic ML researchers. Researchers submit
PyTorch training jobs; volunteer laptops and lab machines train locally and return
model weights; FedAvg merges them.

The novel contribution is **RL for job scheduling on volunteer nodes** — heterogeneous,
unreliable, untrusted machines with dropout behaviour that datacenter schedulers
(Decima et al.) do not model.

Four people. I am **Person A**, the RL environment engineer. I work entirely offline
in simulation and hand one artefact to Person B: a trained policy checkpoint.

---

## 2. File ownership — do not cross these lines

| Path | Owner |
|---|---|
| `scheduler/environment.py` | me |
| `scheduler/obs_builder.py` | me |
| `scheduler/train_ppo.py` | me |
| `scheduler/trained_policy/` | me (B loads from it) |
| `scheduler/rl_loader.py` | me |
| `federated/aggregator.py` | me |
| `shared/models.py` | **shared** — Discord `#decisions-log` before changing |
| `scheduler/reward.py` | **shared** — coefficients frozen, do not tune |
| `docs/rl_state_format.md` | **shared** |
| `scheduler/policy.py` | Person B |
| `scheduler/trust.py` | Person B |
| `scheduler/registry.py` | Person B |
| `scheduler/reward_collector.py` | Person B |
| `distributed/` | Role 2 |
| `platform/` | Role 4 |

Any change to `shared/models.py` or `obs_builder.py` breaks Person B's live system
silently. Post before changing, never after.

---

## 3. Decisions — all settled

### 3.1 Episode structure — single-step

One job, one scheduling decision, one reward, episode ends. The next episode is a
fresh, unrelated job.

Multi-step (a queue where each decision changes the node pool for the next) is the
interesting alternative and is **explicitly out of scope**: it needs a queue model
and node-occupancy tracking that do not exist, and the reward function scores a
finished job, not a partial state. Revisit after Review 1 if at all.

Consequence: `episode_progress` is a constant and is **removed**. It was the only
feature describing simulator bookkeeping rather than the job or the nodes.

### 3.2 Observation vector — 76 dimensions

```
10 node slots × 7 node features  = 70
6 job features                   =  6
                                 -----
OBS_DIM                          = 76
```

- Node slots zero-padded to 10, **sorted by `node_id`**
- All values normalised to [0, 1], dtype float32
- `build_obs(job, nodes)` — the `episode_progress` parameter is **gone**. This
  changes the signature and therefore Person B's call site in `policy.py`, and the
  assertion in `tests/test_obs_parity.py`. Both need updating together.

**`dropout_hour_risk` stays as node feature [5].** It is computed **server-side**
in `build_node_profile()` from the current hour — the heartbeat does **not** carry
it. One formula, one place, shared between me and Person B. Role 4 has no work from
this. (Valid because all nodes are in one timezone; would need the node's local hour
otherwise.)

### 3.3 Data allocation — a fixed environment rule, not an agent choice

Chunk size is proportional to `cpu_score`, so all selected nodes finish a round at
roughly the same time. The action space is MultiBinary — the agent chooses *which*
nodes, never *how much* data. State this explicitly in the paper.

Consequences accepted:
- Makespan scales with the **sum** of selected speeds, not the slowest node
- Adding a slow node is not a throughput cost; it only costs dropout risk and comms
- FedAvg weights by data volume, so faster nodes dominate the averaged model

### 3.4 Job duration

- `actual_hrs` — derived from compute load ÷ summed `cpu_score` of selected nodes,
  inflated by dropouts and by per-node communication cost
- **Communication cost grows with node count.** This is the only counterweight to
  the idle penalty (see §3.7) and must be large enough to actually compete, or the
  agent learns "select everything"
- `estimated_hrs` — **must not depend on which nodes were selected.** Fixed
  reference: how long this job would take on one median-speed node. If the estimate
  moves with the choice, the speed term becomes blind to node quality and can never
  be positive

### 3.5 Dropout model

- Rolled **per hour of job duration**, not once at job start, so longer jobs are
  genuinely riskier
- Risk rises with low `reliability_30d`, with `session_age_hrs` (battery drain, owner
  wants their machine back), and with `dropout_hour_risk`
- All rolls happen **inside** `_simulate_outcome`. The agent observes once, at
  scheduling time, and cannot react. This is a one-shot bet on a node set, not an
  adaptive controller — say so in the paper

### 3.6 What a dropout costs

- Surviving nodes **partially** absorb the dropped node's chunk. Work already in
  flight when the node vanished is lost, so `accuracy_gap` **degrades a little per
  dropout** — continuous, not a cliff
- `completed = False` **only when every node drops**
- Rationale: if redistribution were total, `accuracy_gap` would never vary, the
  `+0.5` accuracy bonus would fire on every job, and one of four reward components
  would be dead

### 3.7 Reward — frozen, shared with Person B

```
speed − 0.3×dropouts + 0.5×accuracy_bonus − 0.1×idle_penalty − 1.0 if not completed
```

`idle_penalty` charges for **skipping** reliable nodes, pushing toward using more.
Comms cost pushes toward using fewer. Both pressures must exist or the agent
degenerates. Coefficients are not tunable — the only lever I control is the comms
cost inside the duration model.

---

## 4. Known bugs — owners assigned, do not fix unilaterally

| Bug | File | Owner |
|---|---|---|
| `n.trust_score >= job.min_trust_tier` compares int to str | `scheduler/policy.py` | Person B |
| `trust.py` returns `'Gold'`, rest of codebase uses lowercase | `scheduler/trust.py` | Person B |
| `build_node_profile()` omits `gpu_vram_gb` and `trust_tier` (both required) | `scheduler/registry.py` | B + Role 4 |
| **Node ordering mismatch** | `obs_builder.py` + `policy.py` | **me** |

The ordering bug is the dangerous one. `build_obs` sorts nodes by `node_id` and
truncates to 10; `_rl_select` indexes the **unsorted** list. Slot 3 of the
observation is not node 3 of B's list. No error, no crash, wrong nodes forever.
Fix: `build_obs` returns the ordering it used, so B cannot index a list it did not
receive.

Also unresolved: `TRUST_TIER_MAP.get(..., 0.0)` means an unknown tier string reads as
*less strict than bronze*. Prefer raising a KeyError over a silent permissive
default.

`tests/test_obs_parity.py` currently proves nothing — it compares `build_obs()`
against an `env._build_obs()` that just calls it. The real drift risk is between a
NodeProfile assembled from a live Redis heartbeat and one my simulator invents.
Rewrite it to compare those two paths.

---

## 5. Build order

1. Update `obs_builder.py` to 76 dims, drop the `episode_progress` parameter, post
   the final spec to `#decisions-log`
2. Fix node ordering
3. `_sample_nodes()` — 3–10 nodes with genuinely varied reliability and cpu_score
4. `_sample_job()` — varied size and trust requirement
5. `_simulate_dropout(node, hours_in)` — implements §3.5
6. `_simulate_outcome(action)` — implements §3.4 and §3.6
7. `reset()` / `step()`, Box(0,1,76) obs space, MultiBinary(10) action space,
   `max_timesteps = 1`, zero-action guard (`if action.sum() == 0: action[0] = 1`)
8. Sanity checks (§6)
9. `train_ppo.py` with stable-baselines3, short run, then long run
10. Implement `load_policy()` in `rl_loader.py` so B can load the checkpoint
11. A/B: N jobs heuristic vs N jobs RL on the same workload

---

## 6. Sanity checks before any training

1. 100 random steps, no crash
2. Rewards vary — print min, max, mean
3. **The important one:** fix one situation. Feed it a deliberately good action
   (the reliable, fast nodes) and a deliberately bad one (flaky, slow), many times
   each. Good must average clearly higher.

If check 3 fails, PPO cannot learn and no hyperparameter will fix it. A flat reward
curve is almost always this, not the optimiser.

**Every field of `JobOutcome` must depend on `action`.** Any field that is a plain
random draw is noise added to my own reward signal.

---

## 7. Notes for an AI assistant working in this repo

Do help with: the mechanical bug fixes, `_sample_job()` / `_sample_nodes()`
boilerplate, install and environment issues, plotting, debugging Ray and
stable-baselines3 errors, test scaffolding.

Do **not** silently decide: the dropout model, the duration model, the completion
rule, or anything in §3. Those are the research contribution — the reason this is a
new problem rather than Decima with a different dataset. If a change would alter
them, say so and stop.

Do not edit files owned by Person B, Role 2, or Role 4 (§2). Propose the change
instead so it can be posted to Discord.

Do not put invented numbers anywhere near a slide or the paper. The planning doc's
example comparison table (26% faster, 47% fewer dropouts) is placeholder data.
Reviewers have already flagged unsupported numbers on this project once. Every
figure shown must come from a run that actually happened, labelled as simulation.