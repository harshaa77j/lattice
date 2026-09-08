from torchvision import datasets, transforms
from torch.utils.data import random_split


transform = transforms.ToTensor()


def get_mnist_dataset():
    train_dataset = datasets.MNIST(
        root="./data",
        train=True,
        download=True,
        transform=transform
    )

    test_dataset = datasets.MNIST(
        root="./data",
        train=False,
        download=True,
        transform=transform
    )

    return train_dataset, test_dataset


def split_dataset(num_nodes=2):
    train_dataset, _ = get_mnist_dataset()

    total_size = len(train_dataset)
    chunk_size = total_size // num_nodes

    lengths = [chunk_size] * num_nodes

    # Give any remaining images to the last node
    lengths[-1] += total_size - sum(lengths)

    node_datasets = random_split(train_dataset, lengths)

    return node_datasets