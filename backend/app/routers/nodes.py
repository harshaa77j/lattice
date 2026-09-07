from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Node
from app.schemas import NodeRegister, NodeResponse
from app.services.node_service import (
    register_node,
    update_heartbeat
)


router = APIRouter(
    prefix="/nodes",
    tags=["Nodes"]
)


@router.post(
    "/register",
    response_model=NodeResponse
)
def register_node_endpoint(
    node_data: NodeRegister,
    db: Session = Depends(get_db)
):
    return register_node(
        db,
        node_data
    )


@router.post(
    "/{node_id}/heartbeat",
    response_model=NodeResponse
)
def heartbeat(
    node_id: str,
    db: Session = Depends(get_db)
):
    node = update_heartbeat(
        db,
        node_id
    )

    if not node:
        raise HTTPException(
            status_code=404,
            detail="Node not found"
        )

    return node


@router.get(
    "",
    response_model=list[NodeResponse]
)
def get_nodes(
    db: Session = Depends(get_db)
):
    return (
        db.query(Node)
        .order_by(Node.created_at.asc())
        .all()
    )