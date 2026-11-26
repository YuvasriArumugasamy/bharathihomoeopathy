import React, { useEffect, useState } from 'react';
import { Check, Pencil, Plus, Ruler, Trash2, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { sizeOptionService } from '../../services/sizeOptionService';

export const AdminSizes = () => {
  const { showToast } = useToast();
  const [sizes, setSizes] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      await sizeOptionService.deleteSize(pendingDelete._id);
      setSizes(previous => previous.filter(item => item._id !== pendingDelete._id));
      showToast(`Size “${pendingDelete.name}” removed from available options. Existing products keep their saved size.`, 'success');
      setPendingDelete(null);
    } catch (error) {
      showToast(error.message || 'Could not remove size.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const startEditing = (size) => {
    setEditingId(size._id);
    setEditName(size.name);
  };

  const handleUpdate = async (event, size) => {
    event.preventDefault();
    const cleanName = editName.trim();
    if (!cleanName) return;
    setSaving(true);
    try {
      const updated = await sizeOptionService.updateSize(size._id, cleanName);
      setSizes(previous => previous.map(item => item._id === size._id ? updated : item).sort((a, b) => a.name.localeCompare(b.name)));
      setEditingId(null);
      setEditName('');
      showToast(`Size updated to “${updated.name}”.`, 'success');
    } catch (error) {
      showToast(error.message || 'Could not update size.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Ruler className="w-5 h-5" /></span>
          <div>
            <h1 className="text-xl font-black text-slate-900">Medicine Strength &amp; Pack Size</h1>
            <p className="text-sm text-slate-500">Add medicine potencies and pack sizes, then assign them to products.</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Example: 30C, 30 ml, 10 g"
          aria-label="New medicine strength or pack size"
          className="flex-1 min-w-0 p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-orange-400"
        />
        <button type="submit" disabled={saving || !name.trim()} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-50">
          <Plus className="w-4 h-4" /> {saving ? 'Adding…' : 'Add Option'}
        </button>
      </form>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-slate-900 mb-4">Available strengths &amp; pack sizes ({sizes.length})</h2>
        {loading ? <p className="text-sm text-slate-500">Loading options…</p> : sizes.length === 0 ? (
          <p className="text-sm text-slate-500">No options yet. Add a strength or pack size above to use it in the product form.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sizes.map(size => (
              <li key={size._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                {editingId === size._id ? (
                  <form onSubmit={event => handleUpdate(event, size)} className="flex flex-1 items-center gap-2">
                    <input autoFocus value={editName} onChange={event => setEditName(event.target.value)} aria-label={`Edit ${size.name}`} className="flex-1 min-w-0 p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-orange-400" />
                    <button type="submit" disabled={saving || !editName.trim()} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 text-xs font-bold disabled:opacity-50" aria-label="Save size"><Check className="w-3.5 h-3.5" /> Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-bold" aria-label="Cancel editing"><X className="w-3.5 h-3.5" /> Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className="font-semibold text-slate-800">{size.name}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => startEditing(size)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-50 text-xs font-bold" aria-label={`Edit ${size.name}`}>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button type="button" onClick={() => setPendingDelete(size)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold" aria-label={`Delete ${size.name}`}>
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={event => {
            if (event.target === event.currentTarget && !deleting) setPendingDelete(null);
          }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="delete-size-title" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h2 id="delete-size-title" className="text-base font-black text-slate-900">Remove this size option?</h2>
                <p className="mt-1 text-sm text-slate-600">
                  “{pendingDelete.name}” will be removed from the available size options. Existing products keep their saved size.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" disabled={deleting} onClick={() => setPendingDelete(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50">
                <Trash2 className="h-4 w-4" /> {deleting ? 'Removing…' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSizes;
