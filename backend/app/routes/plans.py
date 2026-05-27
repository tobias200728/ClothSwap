from fastapi import APIRouter, Depends
from typing import List

from app.models.payment import PlanResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/plans", tags=["Abonnements"])

PLANS = [
    PlanResponse(
        id="free",
        name="Free",
        price=0.0,
        period="kostenlos",
        perks=[
            "5 Swipes pro Tag",
            "3 aktive Kleidungsstücke",
            "Basis-Chat",
        ],
        icon="leaf-outline",
        color="#96CEB4",
        is_popular=False,
    ),
    PlanResponse(
        id="basic",
        name="Basic",
        price=4.99,
        period="pro Monat",
        perks=[
            "50 Swipes pro Tag",
            "15 aktive Kleidungsstücke",
            "Unbegrenzter Chat",
            "Keine Werbung",
        ],
        icon="star-outline",
        color="#45B7D1",
        is_popular=False,
    ),
    PlanResponse(
        id="premium",
        name="Premium",
        price=9.99,
        period="pro Monat",
        perks=[
            "Unbegrenzte Swipes",
            "Unbegrenzte Kleidungsstücke",
            "Priority-Support",
            "Keine Werbung",
            "Profil-Boost",
            "Erweiterte Filter",
        ],
        icon="diamond-outline",
        color="#FF6B6B",
        is_popular=True,
    ),
]


@router.get("", response_model=List[PlanResponse])
async def get_plans(current_user: dict = Depends(get_current_user)):
    return PLANS
