import ray

from node_client.trainer import train_model
from federated.aggregator import fedavg


ray.init()


@ray.remote
def volunteer_node(node_id, weights=None):
    return train_model(weights, node_id)


def run_federated_training(num_rounds=3):

    global_weights = None

    for round_number in range(1, num_rounds + 1):

        print(f"\n--- Training Round {round_number} ---")

        futures = [
            volunteer_node.remote(1, global_weights),
            volunteer_node.remote(2, global_weights),
            volunteer_node.remote(3, global_weights)
        ]

        results = ray.get(futures)

        print(f"Collected weights from {len(results)} nodes.")

        global_weights = fedavg(results)

        print("FedAvg completed.")

    print("\nFederated training complete.")

    return global_weights


if __name__ == "__main__":

    final_weights = run_federated_training()

    print("\nFinal global weights:")

    for key, value in final_weights.items():
        print(key, value)