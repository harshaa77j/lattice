import torch
import torch.nn as nn

from federated.aggregator import fedavg


# A tiny fake neural network
class SimpleModel(nn.Module):
    def __init__(self):
        super().__init__()

        self.layer = nn.Linear(2, 1)


# Create three models
node1_model = SimpleModel()
node2_model = SimpleModel()
node3_model = SimpleModel()


# Give each model different weights
with torch.no_grad():

    node1_model.layer.weight.fill_(1.0)
    node1_model.layer.bias.fill_(1.0)

    node2_model.layer.weight.fill_(3.0)
    node2_model.layer.bias.fill_(3.0)

    node3_model.layer.weight.fill_(5.0)
    node3_model.layer.bias.fill_(5.0)


# Get each model's state_dict
weights_list = [
    node1_model.state_dict(),
    node2_model.state_dict(),
    node3_model.state_dict()
]


# Run Federated Averaging
averaged_weights = fedavg(weights_list)


print("Averaged weights:")

for key, value in averaged_weights.items():
    print(key, value)