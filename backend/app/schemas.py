from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NodeRegister(BaseModel):
    id: str
    name: str
    hostname: str
    cpu_cores: int
    ram_gb: int


class NodeResponse(BaseModel):
    id: str
    name: str
    hostname: str
    status: str
    cpu_cores: int
    ram_gb: int
    reliability: int
    active_lease: bool
    last_heartbeat: datetime

    model_config = ConfigDict(
        from_attributes=True
    )