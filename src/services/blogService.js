import { initialAdminBlogs } from '../data/adminBlogData';
import { api } from '../utils/api';

const BLOGS_STORAGE_KEY = 'admin_blogs_store';

export const getStoredBlogs = () => {
  try {
    const raw = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Could not read blogs from storage:", err.message);
  }
  try {
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(initialAdminBlogs));
  } catch {
    // Ignore quota error
  }
  return initialAdminBlogs;
};

export const saveStoredBlogs = (blogs) => {
  try {
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
  } catch (err) {
    console.warn("Could not save blogs to storage:", err.message);
  }
};

export const blogService = {
  getAdminBlogs: async () => {
    try {
      const res = await api.get('/blogs');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveStoredBlogs(res.data);
        return res.data;
      }
    } catch {
      // Fallback to local storage
    }
    return getStoredBlogs();
  },

  getPublishedBlogs: async () => {
    const all = await blogService.getAdminBlogs();
    return all.filter(b => b.status === 'Published');
  },

  createBlog: async (blogData) => {
    const newBlog = {
      ...blogData,
      id: blogData.id || 'blog-' + Date.now(),
      views: blogData.views || 0,
      status: blogData.status || 'Published',
      publishDate: blogData.publishDate || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    };
    const current = getStoredBlogs();
    const updated = [newBlog, ...current];
    saveStoredBlogs(updated);

    try {
      await api.post('/blogs', newBlog);
    } catch {
      // Local storage already updated
    }
    return newBlog;
  },

  updateBlog: async (id, updatedData) => {
    const current = getStoredBlogs();
    const updated = current.map(b => b.id === id ? { ...b, ...updatedData, updatedAt: new Date().toISOString() } : b);
    saveStoredBlogs(updated);

    try {
      await api.put(`/blogs/${id}`, updatedData);
    } catch {
      // Local storage fallback
    }
    return { success: true };
  },

  deleteBlog: async (id) => {
    const current = getStoredBlogs();
    const updated = current.filter(b => b.id !== id);
    saveStoredBlogs(updated);

    try {
      await api.delete(`/blogs/${id}`);
    } catch {
      // Local storage fallback
    }
    return { success: true };
  }
};

export default blogService;
