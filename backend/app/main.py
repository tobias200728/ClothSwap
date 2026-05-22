from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="ClothSwap API",
    description="A FastAPI backend starter for ClothSwap.",
    version="0.1.0",
)

class Item(BaseModel):
    id: int
    name: str
    description: str | None = None

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to ClothSwap FastAPI backend"}

@app.get("/items/{item_id}", response_model=Item, tags=["Items"])
def read_item(item_id: int):
    return {"id": item_id, "name": f"Item {item_id}", "description": "A sample item from the ClothSwap API."}

@app.post("/items", response_model=Item, tags=["Items"])
def create_item(item: Item):
    return item
