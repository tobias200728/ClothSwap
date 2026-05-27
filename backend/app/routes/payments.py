from fastapi import APIRouter, HTTPException, Depends

from app.models.payment import PaymentProcess, PaymentResponse
from app.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/payments", tags=["Zahlungen"])

VALID_PLANS = {"free", "basic", "premium"}


@router.post("/process", response_model=PaymentResponse)
async def process_payment(
    data: PaymentProcess,
    current_user: dict = Depends(get_current_user),
):
    if data.plan_id not in VALID_PLANS:
        raise HTTPException(status_code=400, detail="Ungültiger Plan")

    if data.plan_id == "free":
        db.users[current_user["id"]]["plan"] = "free"
        return PaymentResponse(success=True, message="Auf kostenlosen Plan gewechselt", plan_id="free")

    # Validate card details for card payments
    if data.payment_method in ("mastercard", "visa"):
        if not data.card_number or not data.card_expiry or not data.card_cvc or not data.card_name:
            raise HTTPException(status_code=400, detail="Kartendetails unvollständig")

        card_digits = data.card_number.replace(" ", "")
        if len(card_digits) != 16 or not card_digits.isdigit():
            raise HTTPException(status_code=400, detail="Ungültige Kartennummer")

        if len(data.card_cvc) not in (3, 4) or not data.card_cvc.isdigit():
            raise HTTPException(status_code=400, detail="Ungültiger CVC")

    db.users[current_user["id"]]["plan"] = data.plan_id

    plan_names = {"basic": "Basic", "premium": "Premium"}
    return PaymentResponse(
        success=True,
        message=f"{plan_names[data.plan_id]}-Abo erfolgreich aktiviert",
        plan_id=data.plan_id,
    )
