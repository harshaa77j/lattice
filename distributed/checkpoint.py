import torch
import os


def save_checkpoint(weights, round_number, path="checkpoints/global_model.pt"):
    os.makedirs(os.path.dirname(path), exist_ok=True)

    checkpoint = {
        "round": round_number,
        "weights": weights
    }

    torch.save(checkpoint, path)

    print(f"Checkpoint saved after round {round_number}.")


def load_checkpoint(path="checkpoints/global_model.pt"):
    if not os.path.exists(path):
        return None

    checkpoint = torch.load(path)

    print(f"Checkpoint loaded from round {checkpoint['round']}.")

    return checkpoint

if __name__ == "__main__":
    checkpoint = load_checkpoint()

    if checkpoint is not None:
        print("Checkpoint loaded successfully.")
        print("Saved round:", checkpoint["round"])