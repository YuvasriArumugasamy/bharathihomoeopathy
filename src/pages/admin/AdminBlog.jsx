import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Search, X, Check } from 'lucide-react';
import { initialAdminBlogs } from '../../data/adminBlogData';
import { useToast } from '../../context/ToastContext';
import { slugify } from '../../utils/slugify';

export const AdminBlog = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState(initialAdminBlogs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Homeopathy',
    shortDescription: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    status: 'Published'
  });

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Homeopathy',
      shortDescription: '',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      status: 'Published'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBlog(b);
    setFormData({ ...b });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingBlog) {
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...formData, slug: slugify(formData.title) } : b));
      showToast('Article updated successfully!', 'success');
    } else {
      const newPost = {
        ...formData,
        id: 'blog-' + Date.now(),
        slug: slugify(formData.title),
        author: 'Dr. Bharathi Care Team',
        publishDate: new Date().toISOString().slice(0, 10),
        views: 0,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setBlogs(prev => [newPost, ...prev]);
      showToast('New article published to wellness journal!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    showToast('Article removed', 'info');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Educational Articles</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Blog & Journal Management</h1>
          <p className="text-xs text-slate-500">Publish wellness guides, seasonal health articles, and clinic updates.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-xs font-bold shadow-md transition-smooth"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-50">
                <img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <span className="px-2 py-0.5 bg-brandOrange-50 text-brandOrange-600 font-bold text-[10px] rounded-full uppercase">
                {b.category}
              </span>
              <h3 className="font-bold text-sm text-navy-900 line-clamp-2">{b.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{b.shortDescription}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{b.publishDate}</span>
              <div className="flex gap-1.5">
                <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-slate-400 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-navy-900 text-sm">{editingBlog ? 'Edit Article' : 'New Article'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  <option value="Homeopathy">Homeopathy</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Healthy Living">Healthy Living</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Clinic Updates">Clinic Updates</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content Body</label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-brandOrange-500 text-white font-bold rounded-xl">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
