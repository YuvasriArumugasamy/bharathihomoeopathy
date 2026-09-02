import React, { useState } from 'react';
import { Search, Globe, Share2, FileText, CheckCircle2, AlertCircle, Edit, Save } from 'lucide-react';
import { initialGlobalSeo, initialPageSeoList } from '../../data/adminSeoData';
import { useToast } from '../../context/ToastContext';

export const AdminSeo = () => {
  const { showToast } = useToast();
  const [globalSeo, setGlobalSeo] = useState(initialGlobalSeo);
  const [pageList, setPageList] = useState(initialPageSeoList);
  const [editingPage, setEditingPage] = useState(null);

  const handleSaveGlobal = (e) => {
    e.preventDefault();
    showToast('Global SEO & OpenGraph settings updated!', 'success');
  };

  const handleSavePageSeo = (e) => {
    e.preventDefault();
    setPageList(prev => prev.map(p => p.id === editingPage.id ? editingPage : p));
    setEditingPage(null);
    showToast('Page SEO parameters updated!', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Search Engine Optimization</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">SEO Management</h1>
          <p className="text-xs text-slate-500">Configure search meta tags, Google snippet previews, XML sitemaps, and robots.txt rules.</p>
        </div>
      </div>

      {/* Pages SEO List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-navy-900 uppercase tracking-wider">Page Meta Tags & Health Scores</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <th className="py-3 px-4 font-bold">Page</th>
                <th className="py-3 px-4 font-bold">Route</th>
                <th className="py-3 px-4 font-bold">Meta Title</th>
                <th className="py-3 px-4 font-bold">Focus Keyword</th>
                <th className="py-3 px-4 font-bold">SEO Score</th>
                <th className="py-3 px-4 font-bold text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-navy-900">{p.pageName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{p.route}</td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate">{p.metaTitle}</td>
                  <td className="py-3 px-4 text-slate-600 font-semibold">{p.focusKeyword}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                      {p.score} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingPage(p)}
                      className="p-1.5 text-slate-400 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Metadata & Live Google Search Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-navy-900 uppercase tracking-wider">Global Search Metadata</h3>

          <form onSubmit={handleSaveGlobal} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Global Meta Title</label>
              <input
                type="text"
                value={globalSeo.metaTitle}
                onChange={(e) => setGlobalSeo({ ...globalSeo, metaTitle: e.target.value })}
                className="w-full p-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                value={globalSeo.metaDescription}
                onChange={(e) => setGlobalSeo({ ...globalSeo, metaDescription: e.target.value })}
                className="w-full p-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Keywords</label>
              <input
                type="text"
                value={globalSeo.keywords}
                onChange={(e) => setGlobalSeo({ ...globalSeo, keywords: e.target.value })}
                className="w-full p-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-bold rounded-xl shadow-sm"
            >
              Save Global SEO
            </button>
          </form>
        </div>

        {/* Live Snippet Preview */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-navy-900 uppercase tracking-wider">Live Google Snippet Preview</h3>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono block">https://drbharathihomeocare.com</span>
            <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
              {globalSeo.metaTitle}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {globalSeo.metaDescription}
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sitemap & Robots Ready</span>
            </span>
            <p className="text-[11px] text-emerald-700">Dynamic sitemap XML is enabled for search engine crawler indexing.</p>
          </div>
        </div>

      </div>

      {/* Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-navy-900 text-sm">Edit SEO for {editingPage.pageName}</h3>

            <form onSubmit={handleSavePageSeo} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  required
                  value={editingPage.metaTitle}
                  onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingPage.metaDescription}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Focus Keyword</label>
                <input
                  type="text"
                  value={editingPage.focusKeyword}
                  onChange={(e) => setEditingPage({ ...editingPage, focusKeyword: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingPage(null)} className="flex-1 py-2 bg-slate-100 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-brandOrange-500 text-white font-bold rounded-xl">Save SEO</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
