import torch
import torch.nn as nn
from torch.utils.data import DataLoader

from node_client.model import MNISTModel


def train_model(dataset, initial_weights=None, node_id=1, epochs=1):

    model = MNISTModel()

    if initial_weights is not None:
        model.load_state_dict(initial_weights)

    loss_fn = nn.CrossEntropyLoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

    dataloader = DataLoader(
        dataset,
        batch_size=64,
        shuffle=True
    )

    total_loss = 0.0
    total_batches = 0

    model.train()

    for epoch in range(epochs):
        for images, labels in dataloader:

            predictions = model(images)
            loss = loss_fn(predictions, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            total_batches += 1

    average_loss = total_loss / total_batches

    print(
        f"Node {node_id} finished training. "
        f"Average loss: {average_loss:.4f}"
    )

    return model.state_dict(), average_loss