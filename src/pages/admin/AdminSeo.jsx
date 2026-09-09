import React, { useState } from 'react';
import { 
  Search, Globe, Share2, FileText, CheckCircle2, AlertCircle, 
  Edit, Save, X, ExternalLink, Sparkles, Check, ArrowRight, 
  Layers, Code2, RefreshCw
} from 'lucide-react';
import { initialGlobalSeo, initialPageSeoList } from '../../data/adminSeoData';
import { useToast } from '../../context/ToastContext';

export const AdminSeo = () => {
  const { showToast } = useToast();
  const [globalSeo, setGlobalSeo] = useState(initialGlobalSeo);
  const [pageList, setPageList] = useState(initialPageSeoList);
  const [editingPage, setEditingPage] = useState(null);

  const avgScore = Math.round(pageList.reduce((sum, p) => sum + p.score, 0) / pageList.length);

  const handleSaveGlobal = (e) => {
    e.preventDefault();
    showToast('Global SEO, OpenGraph metadata, and indexing directives saved!', 'success');
  };

  const handleSavePageSeo = (e) => {
    e.preventDefault();
    setPageList(prev => prev.map(p => p.id === editingPage.id ? editingPage : p));
    setEditingPage(null);
    showToast(`SEO parameters for ${editingPage.pageName} successfully updated!`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 p-7 sm:p-9 rounded-[2.25rem] border border-slate-800 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandOrange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandOrange-500/20 border border-brandOrange-400/30 text-brandOrange-300 text-xs font-black tracking-widest uppercase">
              <Globe className="w-3.5 h-3.5 text-brandOrange-400" />
              Search Engine Optimization
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              SEO & Indexing Management
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-normal leading-relaxed">
              Supercharge organic Google search visibility, customize OpenGraph social previews, and verify meta keywords.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-black">
                {avgScore}%
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Health Score</span>
                <span className="text-xs font-bold text-white">Excellent Standing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indexed Routes</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{pageList.length}</span>
            <span className="text-xs text-slate-400 font-semibold">Active URLs</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Optimization</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{avgScore}/100</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Rank A+</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">XML Sitemap</span>
            <div className="w-9 h-9 rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brandOrange-600">Active</span>
            <span className="text-xs text-brandOrange-700/80 font-semibold">Auto-updating</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crawler Directives</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-600">Index, Follow</span>
            <span className="text-xs text-sky-700/80 font-semibold">Robots.txt</span>
          </div>
        </div>
      </div>

      {/* Pages SEO Health Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-navy-950">
              Page Metadata & Organic Health Scores
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual page titles, meta descriptions, and focused patient search keywords.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Page Name</th>
                <th className="py-4 px-5">Target Route</th>
                <th className="py-4 px-5">Meta Title Header</th>
                <th className="py-4 px-5">Focus Keyword</th>
                <th className="py-4 px-5">SEO Health</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-4 px-6 font-heading font-black text-sm text-navy-950 group-hover:text-brandOrange-600 transition-colors">
                    {p.pageName}
                  </td>
                  <td className="py-4 px-5 font-mono text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                    {p.route}
                  </td>
                  <td className="py-4 px-5 text-slate-700 max-w-xs truncate font-medium">
                    {p.metaTitle}
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 font-bold text-navy-900 text-[11px] border border-slate-200/60">
                      {p.focusKeyword}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-500/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {p.score} / 100
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setEditingPage({ ...p })}
                      className="p-2 text-slate-400 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-xl transition-all"
                      title="Edit Metadata"
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

      {/* Global Metadata & Live Google Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Global Metadata Form */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-sm p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Site-wide Defaults</span>
            <h3 className="font-heading font-black text-navy-950 text-lg">Global Meta Directives</h3>
          </div>

          <form onSubmit={handleSaveGlobal} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Default Meta Title <span className="text-[10px] text-slate-400 font-normal">({globalSeo.metaTitle.length}/60 chars)</span>
              </label>
              <input
                type="text"
                value={globalSeo.metaTitle}
                onChange={(e) => setGlobalSeo({ ...globalSeo, metaTitle: e.target.value })}
                className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Default Meta Description <span className="text-[10px] text-slate-400 font-normal">({globalSeo.metaDescription.length}/160 chars)</span>
              </label>
              <textarea
                rows={3}
                value={globalSeo.metaDescription}
                onChange={(e) => setGlobalSeo({ ...globalSeo, metaDescription: e.target.value })}
                className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Primary Focus Keywords</label>
              <input
                type="text"
                value={globalSeo.keywords}
                onChange={(e) => setGlobalSeo({ ...globalSeo, keywords: e.target.value })}
                className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Global SEO</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Search Engine Preview */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Google SERP Preview Card */}
          <div className="bg-white/95 backdrop-blur-sm p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Google SERP Preview</span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid Snippet
              </span>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-4 h-4 rounded-full bg-navy-900 text-white flex items-center justify-center text-[9px] font-bold">
                  H
                </div>
                <span className="font-mono text-[11px] text-slate-500">https://drbharathihomeocare.com</span>
              </div>
              <h4 className="text-base font-medium text-blue-700 hover:underline cursor-pointer leading-tight">
                {globalSeo.metaTitle}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                {globalSeo.metaDescription}
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black">Dynamic Sitemap & Indexing Directives Active</span>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Crawler instructions permit safe indexing of patient shop and appointment booking pages.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Page SEO Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.25rem] p-7 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Route SEO Optimizer</span>
                <h3 className="font-heading font-black text-navy-950 text-lg">
                  Edit {editingPage.pageName} ({editingPage.route})
                </h3>
              </div>
              <button 
                onClick={() => setEditingPage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePageSeo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  required
                  value={editingPage.metaTitle}
                  onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Meta Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingPage.metaDescription}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Focus Search Keyword</label>
                <input
                  type="text"
                  value={editingPage.focusKeyword}
                  onChange={(e) => setEditingPage({ ...editingPage, focusKeyword: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all"
                >
                  Save Route SEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
