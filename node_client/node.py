import ray
from trainer import train_model

ray.init()

@ray.remote
def volunteer_node(node_id, weights=None):
    return train_model(weights, node_id)

futures = [
    volunteer_node.remote(1),
    volunteer_node.remote(2),
    volunteer_node.remote(3)
]

results = ray.get(futures)

for i, weights in enumerate(results, start=1):
    print(f"\nNode {i} returned:")

    for key in weights:
        print(key, weights[key].shape)
        
print("\nCollected weights from", len(results), "nodes.")