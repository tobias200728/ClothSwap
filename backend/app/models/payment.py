from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class PaymentMethodEnum(str, Enum):
    paypal = "paypal"
    apple_pay = "apple_pay"
    mastercard = "mastercard"
    visa = "visa"


class PaymentProcess(BaseModel):
    plan_id: str
    payment_method: PaymentMethodEnum
    card_name: Optional[str] = None
    card_number: Optional[str] = None
    card_expiry: Optional[str] = None
    card_cvc: Optional[str] = None


class PaymentResponse(BaseModel):
    success: bool
    message: str
    plan_id: Optional[str] = None


class PlanResponse(BaseModel):
    id: str
    name: str
    price: float
    period: str
    perks: List[str]
    icon: str
    color: str
    is_popular: bool = False
