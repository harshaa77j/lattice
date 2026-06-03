Reward Function (scheduler/reward.py)

This module implements the reward function used by the scheduler.

The reward is designed to encourage:

Faster-than-expected job completion
Low dropout rates
High model accuracy
Efficient use of reliable nodes

The reward is computed from:

Speed Component

Rewards jobs that finish faster than predicted.

speed = 1 - (actual_hrs / estimated_hrs)
Dropout Penalty

Penalizes node failures during training.

dropout_penalty = -0.3 * dropout_count
Accuracy Bonus

Provides a bonus when the federated accuracy gap remains below 3%.

accuracy_bonus = 0.5
Idle Resource Penalty

Penalizes situations where highly reliable nodes were available but not selected.

idle_penalty = -0.1 * high_reliability_nodes_skipped
Completion Penalty

Applies an additional penalty if the job fails to complete.

reward -= 1.0