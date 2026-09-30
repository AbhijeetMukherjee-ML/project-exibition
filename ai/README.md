# AI Layer

This directory contains all AI/ML-related code, models, and training data.
It is intentionally isolated from the Node.js backend.

## Directory Structure

```
ai/
├── models/          # Trained model files (.pkl, .pt, .onnx, etc.)
├── training_data/   # Datasets used for model training
└── scripts/         # Python scripts for training, evaluation, and inference
```

## Integration

The backend communicates with the AI layer through a defined API/service boundary.
That interface will be implemented separately — do not add direct imports here yet.

## Setup

Create a Python virtual environment before installing dependencies:

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

> A `requirements.txt` will be added when AI dependencies are defined.
