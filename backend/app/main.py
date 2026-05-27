from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, items, favorites, chats, user, payments, plans

app = FastAPI(
    title="ClothSwap API",
    description="Backend für die ClothSwap Kleidertausch-App",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(favorites.router)
app.include_router(chats.router)
app.include_router(user.router)
app.include_router(payments.router)
app.include_router(plans.router)


@app.get("/", tags=["Root"])
def root():
    return {"message": "ClothSwap API läuft", "docs": "/docs"}
