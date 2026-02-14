const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

function getToken() {
  return localStorage.getItem('accessToken');
}

export async function api(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function hotelsByCity(city) {
  return api(`/hotels?city=${encodeURIComponent(city)}`);
}

export function hotelById(id) {
  return api(`/hotels/${id}`);
}

export function hotelReviews(id) {
  return api(`/hotels/${id}/reviews`);
}

export function createHotelReview(id, body) {
  return api(`/hotels/${id}/reviews`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function restaurantsByCity(city) {
  return api(`/restaurants?city=${encodeURIComponent(city)}`);
}

export function restaurantById(id) {
  return api(`/restaurants/${id}`);
}

export function localPostsByCity(city) {
  return api(`/local-posts?city=${encodeURIComponent(city)}`);
}

export function upvotePost(id) {
  return api(`/local-posts/${id}/upvote`, {
    method: 'POST',
  });
}

export function createLocalPost(body) {
  return api('/local-posts', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function login(email, password) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(name, email, password, role = 'tourist') {
  return api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

export function getMe() {
  return api('/auth/me');
}
