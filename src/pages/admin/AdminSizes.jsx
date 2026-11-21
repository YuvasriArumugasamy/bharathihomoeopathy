import React, { useEffect, useState } from 'react';
import { Plus, Ruler, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { sizeOptionService } from '../../services/sizeOptionService';

export const AdminSizes = () => {
  const { showToast } = useToast();
  const [sizes, setSizes] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSizes = async () => {
    setLoading(true);
    try {
      setSizes(await sizeOptionService.getAdminSizes());
    } catch (error) {
      showToast(`Could not load sizes: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSizes(); }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    setSaving(true);
    try {
      const created = await sizeOptionService.createSize(cleanName);
      setSizes(previous => [...previous, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      showToast(`Size “${created.name}” added.`, 'success');
    } catch (error) {
      showToast(error.message || 'Could not add size.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (size) => {
    try {
      await sizeOptionService.deleteSize(size._id);
      setSizes(previous => previous.filter(item => item._id !== size._id));
      showToast(`Size “${size.name}” removed from available options. Existing products keep their saved size.`, 'success');
    } catch (error) {
      showToast(error.message || 'Could not remove size.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Ruler className="w-5 h-5" /></span>
          <div>
            <h1 className="text-xl font-black text-slate-900">Product Sizes</h1>
            <p className="text-sm text-slate-500">Add shared size options here, then assign them to products.</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Example: 30 ml"
          aria-label="New product size"
          className="flex-1 min-w-0 p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-400"
        />
        <button type="submit" disabled={saving || !name.trim()} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-50">
          <Plus className="w-4 h-4" /> {saving ? 'Adding…' : 'Add Size'}
        </button>
      </form>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-slate-900 mb-4">Available options ({sizes.length})</h2>
        {loading ? <p className="text-sm text-slate-500">Loading sizes…</p> : sizes.length === 0 ? (
          <p className="text-sm text-slate-500">No sizes yet. Add a size above to use it in the product form.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sizes.map(size => (
              <li key={size._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <span className="font-semibold text-slate-800">{size.name}</span>
                <button type="button" onClick={() => handleDelete(size)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold" aria-label={`Delete ${size.name}`}>
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminSizes;
