from dataclasses import dataclass, field
from typing import Optional,List

@dataclass
class NodeProfile:
    node_id:            str
    ram_gb:             float 
    cpu_score:          float #0-1
    gpu_available:      bool
    gpu_vram_gb:        float
    reliability_30d:    float #completed/total jobs
    trust_score:        int #0-100
    trust_tier:         str #gold/silver/bronxe
    session_age_hrs:    float
    dropout_hour_risk:  float #0-1
    last_heartbeat:     float
    instituition:       Optional[str]=None
    
@dataclass
class JobRequest:
    job_id:              str
    researcher_id:       str
    model_file_path:     str
    dataset_path:        str
    epochs:              int
    batch_size:          int
    learning_rate:       float
    ram_required_gb:     float    
    min_trust_tier:      str      
    is_federated:        bool
    model_size_mb:       float    # estimated from model architecture
    dataset_size_gb:     float
    submitted_at:        float    # unix timestamp

@dataclass
class JobOutcome:
    job_id:              str
    assigned_nodes:      List[str]
    actual_hrs:          float    
    estimated_hrs:       float    # what scheduler predicted
    dropout_count:       int      # nodes that dropped mid-job
    accuracy_gap:        float    # federated vs centralised accuracy diff
    high_reliability_nodes_skipped: int  
    completed:           bool   
    