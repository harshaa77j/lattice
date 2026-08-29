import torch


def fedavg(weights_list):
    """
    Takes model weights from multiple nodes and
    returns their average.
    """

    averaged_weights = {}

    for key in weights_list[0].keys():

        averaged_weights[key] = torch.zeros_like(
            weights_list[0][key]
        )

        for weights in weights_list:
            averaged_weights[key] += weights[key]

        averaged_weights[key] /= len(weights_list)

    return averaged_weights