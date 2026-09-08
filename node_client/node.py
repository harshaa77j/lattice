import time
import ray
from distributed.checkpoint import save_checkpoint, load_checkpoint
from distributed.fault_tolerance import simulate_dropout
from node_client.dataset import split_dataset
from node_client.trainer import train_model
from federated.aggregator import fedavg
from shared.models import JobOutcome
from scheduler.reward_collector import record_outcome


ray.init()


@ray.remote
def volunteer_node(node_id, dataset, weights=None):
    return train_model(
        dataset,
        initial_weights=weights,
        node_id=node_id
    )


def run_federated_training(num_rounds=3, job_id="demo_job", estimated_hrs=1.0):

    # Split MNIST between 2 volunteer nodes
    node_datasets = split_dataset(num_nodes=2)

    checkpoint = load_checkpoint()

    if checkpoint is not None:
        global_weights = checkpoint["weights"]
        start_round = checkpoint["round"] + 1
        print(f"Resuming from round {checkpoint['round']}")
    else:
        global_weights = None
        start_round = 1

    round_losses = []
    start_time = time.time()
    active_nodes = [1, 2]
    dropout_count = 0
    for round_number in range(start_round, num_rounds + 1):

        print(f"\n--- Training Round {round_number} ---")
        if round_number == 2 and 2 in active_nodes:
            active_nodes, dropped = simulate_dropout(active_nodes, 2)
            dropout_count += dropped
        
        futures = []

        for node_id in active_nodes:
            futures.append(
                volunteer_node.remote(
                    node_id,
                    node_datasets[node_id - 1],
                    global_weights
                )
            )
        results = ray.get(futures)

        # Separate weights and losses
        node_weights = [result[0] for result in results]
        node_losses = [result[1] for result in results]

        average_loss = sum(node_losses) / len(node_losses)
        round_losses.append(average_loss)
        print(f"Average federated loss: {average_loss:.4f}")

        global_weights = fedavg(node_weights)

        print("FedAvg completed.")
        save_checkpoint(global_weights, round_number)
    elapsed_hours = (time.time() - start_time) / 3600
    print(f"Total training time: {elapsed_hours:.4f} hours")
    outcome = JobOutcome(
    job_id=job_id,
    assigned_nodes=["node_1", "node_2"],
    actual_hrs=elapsed_hours,
    estimated_hrs=estimated_hrs,
    dropout_count=dropout_count,
    accuracy_gap=0.0,
    high_reliability_nodes_skipped=0,
    completed=True
    )

    record_outcome(outcome)
    print("Round losses:", round_losses)
    print("\nFederated training complete.")

    return global_weights, round_losses


if __name__ == "__main__":

    final_weights, round_losses = run_federated_training()

    print("\nFinal global weights:")

    for key, value in final_weights.items():
        print(key, value)