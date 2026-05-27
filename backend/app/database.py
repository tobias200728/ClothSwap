from datetime import datetime
import uuid
import hashlib
import os


def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000).hex()
    return f"{salt}${hashed}"


def verify_password(password: str, stored: str) -> bool:
    salt, hashed = stored.split("$", 1)
    check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000).hex()
    return check == hashed


class Database:
    def __init__(self):
        self.users: dict = {}
        self.items: dict = {}
        self.likes: dict = {}      # {user_id: [item_id, ...]}
        self.dislikes: dict = {}   # {user_id: [item_id, ...]}
        self.chats: dict = {}
        self._seed()

    def _seed(self):
        # --- Seed Users ---
        demo_id = "user-demo"
        seed_users = [
            {
                "id": demo_id,
                "email": "demo@clothswap.de",
                "username": "Max Mustermann",
                "password_hash": hash_password("demo123"),
                "location": "Wien",
                "plan": "free",
                "avatar_color": "#FF6B6B",
                "profile_image": None,
            },
            {
                "id": "user-anna",
                "email": "anna@clothswap.de",
                "username": "Anna Schmidt",
                "password_hash": hash_password("anna123"),
                "location": "Graz",
                "plan": "premium",
                "avatar_color": "#4ECDC4",
                "profile_image": None,
            },
            {
                "id": "user-tom",
                "email": "tom@clothswap.de",
                "username": "Tom Wagner",
                "password_hash": hash_password("tom123"),
                "location": "Salzburg",
                "plan": "free",
                "avatar_color": "#45B7D1",
                "profile_image": None,
            },
            {
                "id": "user-lisa",
                "email": "lisa@clothswap.de",
                "username": "Lisa Müller",
                "password_hash": hash_password("lisa123"),
                "location": "Innsbruck",
                "plan": "basic",
                "avatar_color": "#96CEB4",
                "profile_image": None,
            },
            {
                "id": "user-michael",
                "email": "michael@clothswap.de",
                "username": "Michael Bauer",
                "password_hash": hash_password("michael123"),
                "location": "Linz",
                "plan": "free",
                "avatar_color": "#FFEAA7",
                "profile_image": None,
            },
        ]
        for u in seed_users:
            self.users[u["id"]] = u
            self.likes[u["id"]] = []
            self.dislikes[u["id"]] = []

        # --- Seed Items (from other users, visible to demo user) ---
        swipe_items = [
            {
                "id": "item-1",
                "title": "Vintage Levi's Jacke",
                "size": "XL",
                "brand": "Levi's",
                "condition": "Sehr Gut",
                "owner_id": "user-anna",
                "owner_name": "Anna Schmidt",
                "location": "Graz",
                "distance": "2 km",
                "avatar_color": "#4ECDC4",
                "image": None,
                "status": "Verfügbar",
            },
            {
                "id": "item-2",
                "title": "Sommer Kleid",
                "size": "S",
                "brand": "Zara",
                "condition": "Wie Neu",
                "owner_id": "user-tom",
                "owner_name": "Tom Wagner",
                "location": "Salzburg",
                "distance": "5 km",
                "avatar_color": "#45B7D1",
                "image": None,
                "status": "Verfügbar",
            },
            {
                "id": "item-3",
                "title": "Woll Pullover",
                "size": "M",
                "brand": "H&M",
                "condition": "Gut",
                "owner_id": "user-lisa",
                "owner_name": "Lisa Müller",
                "location": "Innsbruck",
                "distance": "8 km",
                "avatar_color": "#96CEB4",
                "image": None,
                "status": "Verfügbar",
            },
            {
                "id": "item-4",
                "title": "Nike Air Force 1",
                "size": "42",
                "brand": "Nike",
                "condition": "Gut",
                "owner_id": "user-michael",
                "owner_name": "Michael Bauer",
                "location": "Linz",
                "distance": "12 km",
                "avatar_color": "#FFEAA7",
                "image": None,
                "status": "Verfügbar",
            },
            {
                "id": "item-5",
                "title": "Oversized Hoodie",
                "size": "L",
                "brand": "Adidas",
                "condition": "Wie Neu",
                "owner_id": "user-anna",
                "owner_name": "Anna Schmidt",
                "location": "Graz",
                "distance": "2 km",
                "avatar_color": "#4ECDC4",
                "image": None,
                "status": "Verfügbar",
            },
        ]

        # Demo user's own items
        own_items = [
            {
                "id": "item-own-1",
                "title": "Blaue Jeans",
                "size": "32",
                "brand": "Levi's",
                "condition": "Gut",
                "owner_id": demo_id,
                "owner_name": "Max Mustermann",
                "location": "Wien",
                "distance": None,
                "avatar_color": "#FF6B6B",
                "image": None,
                "status": "Verfügbar",
            },
            {
                "id": "item-own-2",
                "title": "Weißes T-Shirt",
                "size": "M",
                "brand": "Uniqlo",
                "condition": "Wie Neu",
                "owner_id": demo_id,
                "owner_name": "Max Mustermann",
                "location": "Wien",
                "distance": None,
                "avatar_color": "#FF6B6B",
                "image": None,
                "status": "Reserviert",
            },
            {
                "id": "item-own-3",
                "title": "Schwarze Sneakers",
                "size": "43",
                "brand": "Puma",
                "condition": "Gut",
                "owner_id": demo_id,
                "owner_name": "Max Mustermann",
                "location": "Wien",
                "distance": None,
                "avatar_color": "#FF6B6B",
                "image": None,
                "status": "Getauscht",
            },
        ]

        for item in swipe_items + own_items:
            self.items[item["id"]] = item

        # --- Seed Likes (demo user liked item-1 and item-3) ---
        self.likes[demo_id] = ["item-1", "item-3"]

        # --- Seed Chats ---
        now = datetime.now()

        def fmt_time(minutes_ago: int) -> str:
            return f"{(now.hour - minutes_ago // 60) % 24:02d}:{now.minute:02d}"

        chat1_id = "chat-1"
        chat2_id = "chat-2"
        chat3_id = "chat-3"

        self.chats[chat1_id] = {
            "id": chat1_id,
            "participant_ids": [demo_id, "user-anna"],
            "participant_info": {
                demo_id: {"name": "Max Mustermann", "avatar_color": "#FF6B6B"},
                "user-anna": {"name": "Anna Schmidt", "avatar_color": "#4ECDC4"},
            },
            "item_id": "item-1",
            "item_title": "Vintage Levi's Jacke",
            "unread_count": 2,
            "last_message": "Ist die Jacke noch verfügbar?",
            "time": "14:30",
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": demo_id,
                    "text": "Hallo! Ich interessiere mich für deine Jacke.",
                    "time": "14:15",
                },
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": "user-anna",
                    "text": "Hi! Ja, sie ist noch verfügbar.",
                    "time": "14:20",
                },
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": demo_id,
                    "text": "Ist die Jacke noch verfügbar?",
                    "time": "14:30",
                },
            ],
        }

        self.chats[chat2_id] = {
            "id": chat2_id,
            "participant_ids": [demo_id, "user-tom"],
            "participant_info": {
                demo_id: {"name": "Max Mustermann", "avatar_color": "#FF6B6B"},
                "user-tom": {"name": "Tom Wagner", "avatar_color": "#45B7D1"},
            },
            "item_id": "item-2",
            "item_title": "Sommer Kleid",
            "unread_count": 0,
            "last_message": "Super, dann bis morgen!",
            "time": "12:00",
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": "user-tom",
                    "text": "Hey, magst du das Kleid tauschen?",
                    "time": "11:45",
                },
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": demo_id,
                    "text": "Klar! Wann passt dir?",
                    "time": "11:55",
                },
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": "user-tom",
                    "text": "Super, dann bis morgen!",
                    "time": "12:00",
                },
            ],
        }

        self.chats[chat3_id] = {
            "id": chat3_id,
            "participant_ids": [demo_id, "user-lisa"],
            "participant_info": {
                demo_id: {"name": "Max Mustermann", "avatar_color": "#FF6B6B"},
                "user-lisa": {"name": "Lisa Müller", "avatar_color": "#96CEB4"},
            },
            "item_id": "item-3",
            "item_title": "Woll Pullover",
            "unread_count": 1,
            "last_message": "Welche Größe trägst du?",
            "time": "Gestern",
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": "user-lisa",
                    "text": "Welche Größe trägst du?",
                    "time": "Gestern",
                },
            ],
        }


db = Database()
