import os
import socket
import time
import uuid

import psutil
import requests
from dotenv import load_dotenv


load_dotenv()


COORDINATOR_URL = os.getenv(
    "COORDINATOR_URL",
    "http://127.0.0.1:8000"
)

NODE_NAME = os.getenv(
    "NODE_NAME",
    "Lattice Node"
)

HEARTBEAT_INTERVAL = 10


def get_node_id():
    hostname = socket.gethostname()

    return str(
        uuid.uuid5(
            uuid.NAMESPACE_DNS,
            hostname
        )
    )


def get_node_data():
    return {
        "id": get_node_id(),
        "name": NODE_NAME,
        "hostname": socket.gethostname(),
        "cpu_cores": psutil.cpu_count(
            logical=True
        ),
        "ram_gb": round(
            psutil.virtual_memory().total / (1024 ** 3)
        )
    }


def register_node():
    node_data = get_node_data()

    response = requests.post(
        f"{COORDINATOR_URL}/nodes/register",
        json=node_data,
        timeout=10
    )

    response.raise_for_status()

    print(
        f"Registered: {node_data['name']}"
    )

    return node_data["id"]


def send_heartbeat(node_id):
    response = requests.post(
        f"{COORDINATOR_URL}/nodes/{node_id}/heartbeat",
        timeout=10
    )

    response.raise_for_status()

    print(
        f"Heartbeat sent: {node_id}"
    )


def main():
    print("Starting Lattice Node Client")

    print(
        f"Coordinator: {COORDINATOR_URL}"
    )

    node_id = register_node()

    while True:
        try:
            send_heartbeat(node_id)
        except requests.RequestException as error:
            print(
                f"Heartbeat failed: {error}"
            )

        time.sleep(
            HEARTBEAT_INTERVAL
        )


if __name__ == "__main__":
    main()