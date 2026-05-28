-- ClothSwap Supabase Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com → SQL Editor)

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  location TEXT DEFAULT 'Wien',
  plan TEXT DEFAULT 'free',
  avatar_color TEXT DEFAULT '#FF6B6B',
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  size TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  condition TEXT NOT NULL DEFAULT 'Gut',
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Wien',
  distance TEXT,
  avatar_color TEXT DEFAULT '#4ECDC4',
  image TEXT,
  status TEXT DEFAULT 'Verfügbar',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS dislikes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  item_title TEXT NOT NULL DEFAULT '',
  last_message TEXT DEFAULT '',
  time TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_participants (
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#4ECDC4',
  unread_count INT DEFAULT 0,
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage bucket for item images (run separately or create via Supabase dashboard)
-- 1. Go to Storage → Create bucket → Name: "item-images" → Public: true
-- 2. Under Policies, allow public reads and authenticated uploads
