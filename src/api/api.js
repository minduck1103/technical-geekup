import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const AVATAR_URL = 'https://ui-avatars.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const IMAGE_SERVICES = [
  (id, large) => {
    const width = large ? 600 : 150;
    const height = large ? 400 : 150;
    return `https://source.unsplash.com/random/${width}x${height}?sig=${id}`;
  },
  
  (id, large) => {
    const width = large ? 600 : 150;
    const height = large ? 400 : 150;
    return `https://picsum.photos/id/${(id % 50) + 1}/${width}/${height}`;
  },
  
  (id, large) => {
    const width = large ? 600 : 150;
    const height = large ? 400 : 150;
    return `https://picsum.photos/${width}/${height}?random=${id}`;
  },
  
  (id, large) => {
    const width = large ? 600 : 150;
    const height = large ? 400 : 150;
    return `https://via.placeholder.com/${width}x${height}/${getRandomColor(id)}/${getTextColor(id)}?text=Image+${id}`;
  },
  
  (id, large) => {
    const width = large ? 600 : 150;
    const height = large ? 400 : 150;
    return `https://placebear.com/${width}/${height}?image=${id % 20}`;
  },
  
  (id, large) => {
    const width = large ? 600 : 150;
    const height = large ? 400 : 150;
    return `https://placekitten.com/${width}/${height}?image=${id % 16}`;
  }
];

export const getImageUrls = (id, large = false) => {
  return IMAGE_SERVICES.map(service => service(id, large));
};

// Function to get random color based on id
const getRandomColor = (id) => {
  const colors = [
    'f44336', '2196F3', '4CAF50', 'FFC107', '9C27B0',
    'FF5722', '795548', '607D8B', 'E91E63', '03A9F4'
  ];
  return colors[id % colors.length];
};

const getTextColor = (id) => {
  return ['f44336', '2196F3', '9C27B0', 'FF5722', '795548', 'E91E63'].includes(getRandomColor(id)) 
    ? 'FFFFFF' 
    : '000000';
};

export const getAlbums = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/albums?_page=${page}&_limit=${limit}`);
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count'] || '100'),
    };
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

export const getAlbumById = async (id) => {
  try {
    const response = await api.get(`/albums/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching album ${id}:`, error);
    throw error;
  }
};

export const getAlbumsByUserId = async (userId) => {
  try {
    const response = await api.get(`/albums?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching albums for user ${userId}:`, error);
    throw error;
  }
};

export const getPhotosByAlbumId = async (albumId) => {
  try {
    const response = await api.get(`/photos?albumId=${albumId}`);
    
    const enhancedPhotos = response.data.map(photo => ({
      ...photo,
      thumbnailUrls: getImageUrls(photo.id, false),
      imageUrls: getImageUrls(photo.id, true),
      color: getRandomColor(photo.id),
      textColor: getTextColor(photo.id)
    }));
    
    return enhancedPhotos;
  } catch (error) {
    console.error(`Error fetching photos for album ${albumId}:`, error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Avatar generation
export const getAvatarUrl = (name, size = 100) => {
  return `${AVATAR_URL}/?name=${encodeURIComponent(name)}&size=${size}&background=random`;
};

export default api; 