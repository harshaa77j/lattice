from datetime import datetime

from sqlalchemy.orm import Session

from app.models import Node
from app.schemas import NodeRegister


def register_node(
    db: Session,
    node_data: NodeRegister
):
    existing_node = (
        db.query(Node)
        .filter(Node.id == node_data.id)
        .first()
    )

    if existing_node:
        existing_node.name = node_data.name
        existing_node.hostname = node_data.hostname
        existing_node.cpu_cores = node_data.cpu_cores
        existing_node.ram_gb = node_data.ram_gb
        existing_node.status = "ONLINE"
        existing_node.last_heartbeat = datetime.utcnow()

        db.commit()
        db.refresh(existing_node)

        return existing_node

    node = Node(
        id=node_data.id,
        name=node_data.name,
        hostname=node_data.hostname,
        cpu_cores=node_data.cpu_cores,
        ram_gb=node_data.ram_gb,
        status="ONLINE",
        last_heartbeat=datetime.utcnow()
    )

    db.add(node)
    db.commit()
    db.refresh(node)

    return node

def update_heartbeat(
    db: Session,
    node_id: str
):
    node = (
        db.query(Node)
        .filter(Node.id == node_id)
        .first()
    )

    if not node:
        return None

    node.status = "ONLINE"
    node.last_heartbeat = datetime.utcnow()

    db.commit()
    db.refresh(node)

    return node