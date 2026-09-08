def simulate_dropout(active_nodes, dropped_node=None):
    if dropped_node is not None and dropped_node in active_nodes:
        active_nodes = [
            node for node in active_nodes
            if node != dropped_node
        ]

        print(f"Node {dropped_node} dropped out.")
        print(f"Active nodes: {active_nodes}")

        dropout_count = 1

    else:
        print(f"Node {dropped_node} was not active.")

        dropout_count = 0

    return active_nodes, dropout_count


if __name__ == "__main__":
    active_nodes = [1, 2]

    active_nodes, dropout_count = simulate_dropout(
        active_nodes,
        dropped_node=2
    )

    print("Dropout count:", dropout_count)