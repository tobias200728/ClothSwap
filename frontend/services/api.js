import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { getToken } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

async function request(method, path, body = null) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let detail = `HTTP ${response.status}`;
    try {
      const err = JSON.parse(text);
      detail = err.detail || err.message || detail;
    } catch (_) {}
    throw new Error(detail);
  }

  if (response.status === 204) return null;
  return response.json();
}

// Map backend snake_case item → frontend camelCase
function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title,
    size: item.size,
    brand: item.brand,
    condition: item.condition,
    description: item.description || '',
    owner: item.owner_name,
    owner_id: item.owner_id,
    ownerImage: item.owner_profile_image || null,
    location: item.location,
    distance: item.distance || '',
    avatarColor: item.avatar_color,
    image: item.image,
    status: item.status,
  };
}

// Map backend chat + messages → frontend format
function normalizeChat(chat, currentUserId) {
  return {
    id: chat.id,
    name: chat.name,
    item: chat.item,
    avatarColor: chat.avatar_color,
    unreadCount: chat.unread_count,
    lastMessage: chat.last_message,
    time: chat.time,
    otherUserId: chat.other_user_id || null,
    otherImage: chat.other_profile_image || null,
    messages: (chat.messages || []).map((msg) => ({
      id: msg.id,
      sender: msg.sender_id === currentUserId ? 'me' : 'them',
      text: msg.text,
      time: msg.time,
    })),
  };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  const data = await request('POST', '/auth/login', { email, password });
  return {
    token: data.access_token,
    user: {
      id: data.user.id,
      name: data.user.username,
      email: data.user.email,
      location: data.user.location,
      plan: data.user.plan,
      avatarColor: data.user.avatar_color,
      image: data.user.profile_image,
    },
  };
}

export async function register(email, password, username) {
  const data = await request('POST', '/auth/register', { email, password, username });
  return {
    token: data.access_token,
    user: {
      id: data.user.id,
      name: data.user.username,
      email: data.user.email,
      location: data.user.location,
      plan: data.user.plan,
      avatarColor: data.user.avatar_color,
      image: data.user.profile_image,
    },
  };
}

// ── Items ─────────────────────────────────────────────────────────────────────

export async function getSwipeFeed() {
  const items = await request('GET', '/items');
  return items.map(normalizeItem);
}

export async function getMyItems() {
  const items = await request('GET', '/items/mine');
  return items.map(normalizeItem);
}

export async function createItem(data) {
  const item = await request('POST', '/items', {
    title: data.title,
    size: data.size,
    brand: data.brand || '',
    condition: data.condition || 'Gut',
    description: data.description || '',
    image: data.image || null,
  });
  return normalizeItem(item);
}

export async function uploadImage(uri) {
  const token = await getToken();
  const fileName = uri.split('/').pop() || 'image.jpg';
  const ext = fileName.split('.').pop().toLowerCase() || 'jpg';

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });

  const response = await fetch(`${API_URL}/items/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64,
      filename: fileName,
      content_type: `image/${ext}`,
    }),
  });

  if (!response.ok) throw new Error('Bild-Upload fehlgeschlagen');
  const result = await response.json();
  return result.url;
}

export async function getUserItems(userId) {
  const items = await request('GET', `/items/by-user/${userId}`);
  return items.map(normalizeItem);
}

export async function updateItem(itemId, data) {
  const item = await request('PATCH', `/items/${itemId}`, data);
  return normalizeItem(item);
}

export const deleteItem = (itemId) => request('DELETE', `/items/${itemId}`);

export const likeItem = (itemId) => request('POST', `/items/${itemId}/like`);
export const dislikeItem = (itemId) => request('POST', `/items/${itemId}/dislike`);

// ── Favorites ─────────────────────────────────────────────────────────────────

export async function getFavorites() {
  const items = await request('GET', '/favorites');
  return items.map(normalizeItem);
}

export const removeFavorite = (itemId) => request('DELETE', `/favorites/${itemId}`);

// ── Chats ─────────────────────────────────────────────────────────────────────

export async function getChats(currentUserId) {
  const chats = await request('GET', '/chats');
  return chats.map((c) => normalizeChat(c, currentUserId));
}

export async function getChatWithMessages(chatId, currentUserId) {
  const chat = await request('GET', `/chats/${chatId}`);
  return normalizeChat(chat, currentUserId);
}

export async function createChat(recipientId, itemId, initialMessage) {
  const data = await request('POST', '/chats', {
    recipient_id: recipientId,
    item_id: itemId,
    initial_message: initialMessage,
  });
  return data;
}

export const sendMessage = (chatId, text) =>
  request('POST', `/chats/${chatId}/messages`, { text });

export const markChatAsRead = (chatId) => request('PUT', `/chats/${chatId}/read`);

// ── User ──────────────────────────────────────────────────────────────────────

export async function getProfile() {
  const user = await request('GET', '/user/profile');
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    location: user.location,
    plan: user.plan,
    avatarColor: user.avatar_color,
    image: user.profile_image,
  };
}

export async function updateProfile(data) {
  const user = await request('PUT', '/user/profile', {
    username: data.name,
    location: data.location,
    profile_image: data.image,
  });
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    location: user.location,
    plan: user.plan,
    avatarColor: user.avatar_color,
    image: user.profile_image,
  };
}

// ── Plans & Payments ──────────────────────────────────────────────────────────

export const getPlans = () => request('GET', '/plans');

export const processPayment = (planId, paymentMethod, cardData = {}) =>
  request('POST', '/payments/process', {
    plan_id: planId,
    payment_method: paymentMethod,
    ...cardData,
  });
