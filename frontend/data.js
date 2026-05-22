// mock data for the ClothSwap app matching the provided UI screenshots

export const INITIAL_SWIPE_ITEMS = [
  {
    id: 'swipe_1',
    title: 'Vintage Lederjacke',
    size: 'M',
    brand: "Levi's",
    condition: 'Sehr gut',
    owner: 'Anna M.',
    location: 'Kreuzberg',
    distance: '2 km',
    avatarColor: '#ba68c8',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'swipe_2',
    title: 'Klassische Bomberjacke',
    size: 'L',
    brand: 'Zara',
    condition: 'Sehr gut',
    owner: 'Lisa K.',
    location: 'Neukölln',
    distance: '3.5 km',
    avatarColor: '#ec407a',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'swipe_3',
    title: 'Casual Sneaker',
    size: '42',
    brand: 'Nike',
    condition: 'Gut',
    owner: 'Tom S.',
    location: 'Mitte',
    distance: '1.2 km',
    avatarColor: '#ba68c8',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'swipe_4',
    title: 'Wollpullover',
    size: 'S',
    brand: 'H&M',
    condition: 'Hervorragend',
    owner: 'Maria P.',
    location: 'Prenzlauer Berg',
    distance: '4 km',
    avatarColor: '#e040fb',
    image: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'swipe_5',
    title: 'Sommerkleid',
    size: '36',
    brand: 'Mango',
    condition: 'Wie neu',
    owner: 'Lisa K.',
    location: 'Neukölln',
    distance: '3.5 km',
    avatarColor: '#ec407a',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
  }
];

export const INITIAL_FAVORITES = [
  {
    id: 'swipe_1',
    title: 'Vintage Lederjacke',
    size: 'M',
    brand: "Levi's",
    condition: 'Sehr gut',
    owner: 'Anna M.',
    location: 'Kreuzberg',
    distance: '2 km',
    avatarColor: '#ba68c8',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'swipe_2',
    title: 'Klassische Bomberjacke',
    size: 'L',
    brand: 'Zara',
    condition: 'Sehr gut',
    owner: 'Lisa K.',
    location: 'Neukölln',
    distance: '3.5 km',
    avatarColor: '#ec407a',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
  }
];

export const INITIAL_CHATS = [
  {
    id: 'chat_1',
    name: 'Anna M.',
    item: 'Lederjacke',
    avatarColor: '#ba68c8',
    unreadCount: 2,
    lastMessage: 'Ja, die Jacke ist noch verfügbar!',
    time: '10:30',
    messages: [
      { id: 'm1', sender: 'them', text: 'Hi! Hast du Interesse an der Lederjacke?', time: '10:15' },
      { id: 'm2', sender: 'me', text: 'Hallo! Ja, sieht cool aus. Kann man da noch was am Tausch machen?', time: '10:20' },
      { id: 'm3', sender: 'them', text: 'Klar, bin offen für Angebote. Was bietest du?', time: '10:25' },
      { id: 'm4', sender: 'them', text: 'Ja, die Jacke ist noch verfügbar!', time: '10:30' }
    ]
  },
  {
    id: 'chat_2',
    name: 'Lisa K.',
    item: 'Sommerkleid',
    avatarColor: '#ec407a',
    unreadCount: 0,
    lastMessage: 'Wann können wir tauschen?',
    time: 'Gestern',
    messages: [
      { id: 'm1', sender: 'them', text: 'Hallo! Gefällt dir das Sommerkleid?', time: 'Gestern' },
      { id: 'm2', sender: 'me', text: 'Ja sehr! Gefällt dir mein gelber Hoodie?', time: 'Gestern' },
      { id: 'm3', sender: 'them', text: 'Wann können wir tauschen?', time: 'Gestern' }
    ]
  },
  {
    id: 'chat_3',
    name: 'Tom S.',
    item: 'Sneakers',
    avatarColor: '#ba68c8',
    unreadCount: 0,
    lastMessage: 'Super, passt mir perfekt!',
    time: 'Gestern',
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey, die Sneakers sind Größe 42.', time: 'Gestern' },
      { id: 'm2', sender: 'me', text: 'Perfekt, das ist genau meine Größe.', time: 'Gestern' },
      { id: 'm3', sender: 'them', text: 'Super, passt mir perfekt!', time: 'Gestern' }
    ]
  },
  {
    id: 'chat_4',
    name: 'Maria P.',
    item: 'Pullover',
    avatarColor: '#e040fb',
    unreadCount: 1,
    lastMessage: 'Hast du ein Foto?',
    time: 'Mo',
    messages: [
      { id: 'm1', sender: 'me', text: 'Hi Maria, tauscht du den Pullover?', time: 'Mo' },
      { id: 'm2', sender: 'them', text: 'Hast du ein Foto?', time: 'Mo' }
    ]
  }
];

export const INITIAL_USER_ITEMS = [
  {
    id: 'user_1',
    title: 'Winterjacke',
    size: 'L',
    status: 'Verfügbar', // Verfügbar, Reserviert, Getauscht
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'user_2',
    title: 'T-Shirt',
    size: 'M',
    status: 'Reserviert',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'user_3',
    title: 'Hoodie',
    size: 'L',
    status: 'Getauscht',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'user_4',
    title: 'Cap',
    size: 'One Size',
    status: 'Verfügbar',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
  }
];
