import torch

from federated.aggregator import fedavg


def train_node(global_weights, node_number):
    """
    Simulates a node receiving the global model,
    training locally, and returning updated weights.
    """

    updated_weights = {}

    for key, value in global_weights.items():

        # Fake local training
        updated_weights[key] = value.clone() + node_number

    return updated_weights


def run_training_round(global_weights, round_number):

    print(f"\n--- Training Round {round_number} ---")

    print("Sending global model to nodes...")

    node_weights = []

    for node_number in range(1, 4):

        updated_weights = train_node(
            global_weights,
            node_number
        )

        node_weights.append(updated_weights)

        print(f"Node {node_number} finished training.")

    print(f"\nCollected weights from {len(node_weights)} nodes.")

    new_global_weights = fedavg(node_weights)

    print("Updated global weights:")
    print(new_global_weights)

    return new_global_weights


def run_training(num_rounds=3):

    # Starting global model
    global_weights = {
        "layer.weight": torch.tensor([0.0, 0.0, 0.0])
    }

    print("Starting federated training...")

    for round_number in range(1, num_rounds + 1):

        global_weights = run_training_round(
            global_weights,
            round_number
        )

    print("\nTraining complete.")

    print("Final global weights:")
    print(global_weights)


if __name__ == "__main__":
    run_training()