Shared Data Models (shared/models.py)

This module defines the common data structures used across the project.

These dataclasses act as the contract between different system components and must remain synchronized across all modules.

NodeProfile:
Represents a volunteer node and its capabilities. Attributes include:-

Node identifier
RAM capacity
CPU benchmark score
GPU availability and VRAM
Historical reliability
Trust score and trust tier
Session age
Estimated dropout risk
Last heartbeat timestamp
Optional institution affiliation

JobRequest:
Represents a machine learning training job submitted by a researcher.Attributes include:-

Job metadata
Model and dataset locations
Hyperparameters
Resource requirements
Trust requirements
Federated learning flag
Model and dataset size estimates
Submission timestamp

JobOutcome:
Represents the result of a completed training job.Attributes include:-
Assigned nodes
Actual vs predicted execution time
Number of node dropouts
Accuracy difference compared to centralized training
Reliability waste metric
Completion status