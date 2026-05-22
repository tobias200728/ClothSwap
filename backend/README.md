# ClothSwap Backend

This is a starter FastAPI backend for ClothSwap.

## Setup

1. Create a virtual environment:

   python -m venv .venv

2. Activate it:

   .\.venv\Scripts\Activate.ps1

3. Install dependencies:

   pip install -r requirements.txt

4. Run the app:

   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Endpoints

- `GET /` — root welcome message
- `GET /items/{item_id}` — example item
- `POST /items` — create item payload
