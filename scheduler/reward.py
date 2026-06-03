from shared.models import JobOutcome

def compute_reward(outcome: JobOutcome) -> float:

    if outcome.estimated_hrs > 0:
        speed = 1.0 - (outcome.actual_hrs / outcome.estimated_hrs)
    else:
        speed = 0.0

    dropout = -0.3 * outcome.dropout_count

    accuracy = 0.5 if outcome.accuracy_gap < 0.03 else 0.0

    idle_penalty = -0.1 * outcome.high_reliability_nodes_skipped

    reward = speed + dropout + accuracy + idle_penalty

    if not outcome.completed:
        reward -= 1.0

    return reward

if __name__ == "__main__":

    good_job = JobOutcome(
        job_id="test_001",
        assigned_nodes=["node_a", "node_b"],
        actual_hrs=2.0,
        estimated_hrs=3.0,   
        dropout_count=0,
        accuracy_gap=0.02, 
        high_reliability_nodes_skipped=0,
        completed=True
    )

    bad_job = JobOutcome(
        job_id="test_002",
        assigned_nodes=["node_c"],
        actual_hrs=5.0,
        estimated_hrs=3.0,   
        dropout_count=2,   
        accuracy_gap=0.08,
        high_reliability_nodes_skipped=3,
        completed=True
    )

    print(f"Good job reward: {compute_reward(good_job):.3f}")

    print(f"Bad job reward:  {compute_reward(bad_job):.3f}")
    