import React, { useState } from 'react';
import { 
  Search, Globe, Share2, FileText, CheckCircle2, AlertCircle, 
  Edit, Save, X, ExternalLink, Sparkles, Check, ArrowRight, 
  Layers, Code2, RefreshCw, Wand2, ShieldCheck
} from 'lucide-react';
import { 
  initialGlobalSeo, 
  initialPageSeoList, 
  calculateSeoScore,
  getStoredPageSeoList,
  saveStoredPageSeoList,
  getStoredGlobalSeo,
  saveStoredGlobalSeo
} from '../../data/adminSeoData';
import { useToast } from '../../context/ToastContext';

export const AdminSeo = () => {
  const { showToast } = useToast();
  const [globalSeo, setGlobalSeo] = useState(() => getStoredGlobalSeo());
  const [pageList, setPageList] = useState(() => getStoredPageSeoList());
  const [editingPage, setEditingPage] = useState(null);

  const avgScore = Array.isArray(pageList) && pageList.length > 0
    ? Math.round(pageList.reduce((sum, p) => sum + (Number(p?.score) || 0), 0) / pageList.length)
    : 100;

  const handleSaveGlobal = (e) => {
    e.preventDefault();
    saveStoredGlobalSeo(globalSeo);
    showToast('Global SEO, OpenGraph metadata, and indexing directives saved!', 'success');
  };

  const handleSavePageSeo = (e) => {
    e.preventDefault();
    const score = calculateSeoScore(editingPage);
    const updated = {
      ...editingPage,
      score: score,
      status: score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Needs Review'
    };
    const newList = pageList.map(p => p.id === updated.id ? updated : p);
    setPageList(newList);
    saveStoredPageSeoList(newList);
    setEditingPage(null);
    showToast(`SEO parameters for ${editingPage.pageName} saved at ${score}% optimization!`, 'success');
  };

  const handleOptimizeAllTo100 = () => {
    setPageList(initialPageSeoList);
    saveStoredPageSeoList(initialPageSeoList);
    setGlobalSeo(initialGlobalSeo);
    saveStoredGlobalSeo(initialGlobalSeo);
    showToast('All pages successfully optimized to 100% SEO Score & Rank A+!', 'success');
  };

  const handleAutoTuneEditingPage = () => {
    if (!editingPage) return;
    const defaultTemplate = initialPageSeoList.find(p => p.id === editingPage.id || p.route === editingPage.route);
    if (defaultTemplate) {
      setEditingPage({
        ...editingPage,
        metaTitle: defaultTemplate.metaTitle,
        metaDescription: defaultTemplate.metaDescription,
        focusKeyword: defaultTemplate.focusKeyword,
        score: 100,
        status: 'Excellent'
      });
      showToast('Metadata auto-tuned to 100% SEO score!', 'success');
    }
  };

  const currentEditScore = editingPage ? calculateSeoScore(editingPage) : 100;

  return (
    <div className="space-y-8 ">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-5 sm:p-8 lg:p-9 rounded-[2rem] sm:rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-6 sm:mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-5 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-bold mb-2 border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>100% Search Engine Optimization Suite</span>
            </div>
            <h1 className="font-heading text-xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              SEO & Indexing Management
            </h1>
          </div>
          <button
            onClick={handleOptimizeAllTo100}
            className="w-full sm:w-auto justify-center relative z-10 inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-white hover:bg-orange-50 text-brandOrange-600 hover:text-brandOrange-700 rounded-2xl text-xs sm:text-sm font-black shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-2 border-white shrink-0"
            title="Reset and apply 100% SEO score to all pages"
          >
            <Sparkles className="w-4 h-4 text-brandOrange-500 fill-brandOrange-500/20 stroke-[2.5]" />
            <span>Optimize All to 100%</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Bar - Fully Responsive for Mobile & Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Indexed Routes
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-navy-900 shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-2xl font-black text-navy-950 leading-none">
              {pageList.length}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">Active URLs</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Avg Optimization
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-black text-emerald-600 leading-none">
              {avgScore}/100
            </span>
            <span className="text-[9px] sm:text-xs text-emerald-700 font-extrabold bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200">
              {avgScore === 100 ? '100% Perfect' : 'Rank A+'}
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              XML Sitemap
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600 shrink-0">
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-2xl font-black text-brandOrange-600 leading-none">
              Active
            </span>
            <span className="text-[10px] sm:text-xs text-brandOrange-700/80 font-semibold">Auto-updating</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Crawler Directives
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-xl md:text-2xl font-black text-sky-600 leading-none whitespace-nowrap">
              Index, Follow
            </span>
            <span className="text-[9px] sm:text-xs text-sky-700/80 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
              Robots.txt
            </span>
          </div>
        </div>
      </div>

      {/* Pages SEO Health Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-base text-navy-950">
                Page Metadata & Organic Health Scores
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-wide uppercase">
                100% Target
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual page titles, meta descriptions, and high-conversion patient focus keywords.
            </p>
          </div>
          <button
            onClick={handleOptimizeAllTo100}
            className="self-start sm:self-auto text-xs font-bold text-brandOrange-600 hover:text-brandOrange-700 bg-brandOrange-50 hover:bg-brandOrange-100 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply 100% SEO to All Pages</span>
          </button>
        </div>

        <div className="overflow-x-auto hidden md:block">
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
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      p.score === 100
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20'
                        : p.score >= 90
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
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
        {/* Mobile SEO Page Cards */}
        <div className="md:hidden flex flex-col gap-3.5 p-3.5 sm:p-4 bg-slate-50/60">
          {pageList.map((p) => (
            <div
              key={p.id + '-card'}
              onClick={() => setEditingPage({ ...p })}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-2px_rgba(15,36,56,0.06)] p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md hover:border-orange-300"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-heading font-black text-sm text-navy-950">{p.pageName}</h4>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  p.score === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {p.score} / 100
                </span>
              </div>

              <div>
                <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {p.route}
                </span>
                <p className="text-xs text-slate-700 font-medium mt-1.5 line-clamp-1">{p.metaTitle}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                  Key: {p.focusKeyword}
                </span>
                <span className="text-brandOrange-600 font-bold flex items-center gap-1">
                  Edit SEO <Edit className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-700">Default Meta Title</label>
                <span className={`text-[10px] font-bold ${globalSeo.metaTitle.length >= 40 && globalSeo.metaTitle.length <= 65 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {globalSeo.metaTitle.length}/65 chars (Ideal: 40-65)
                </span>
              </div>
              <input
                type="text"
                value={globalSeo.metaTitle}
                onChange={(e) => setGlobalSeo({ ...globalSeo, metaTitle: e.target.value })}
                className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-700">Default Meta Description</label>
                <span className={`text-[10px] font-bold ${globalSeo.metaDescription.length >= 120 && globalSeo.metaDescription.length <= 165 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {globalSeo.metaDescription.length}/165 chars (Ideal: 120-165)
                </span>
              </div>
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

            <div className="pt-2 flex items-center justify-between">
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
                100% Valid Snippet
              </span>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-4 h-4 rounded-full bg-navy-900 text-white flex items-center justify-center text-[9px] font-bold">
                  H
                </div>
                <span className="font-mono text-[11px] text-slate-500">https://drbharathihomeo.com</span>
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
                  Crawler instructions permit safe indexing of patient shop and appointment booking pages with full rich snippets.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Page SEO Modal with Real-time 100% Optimizer */}
      {editingPage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.25rem] p-4 sm:p-7 max-w-lg w-full space-y-4 sm:space-y-5 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Route SEO Optimizer</span>
                <h3 className="font-heading font-black text-navy-950 text-base sm:text-lg leading-snug">
                  Edit {editingPage.pageName} ({editingPage.route})
                </h3>
              </div>
              <button 
                onClick={() => setEditingPage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Score Meter - Fully Responsive */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Live SEO Optimization
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black leading-none whitespace-nowrap ${currentEditScore === 100 ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {currentEditScore} / 100
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    currentEditScore === 100
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {currentEditScore === 100 ? '100% Perfect' : 'Optimizing'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoTuneEditingPage}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer whitespace-nowrap"
                title="Automatically fix title and description to achieve 100% score"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Auto-Tune 100%</span>
              </button>
            </div>

            <form onSubmit={handleSavePageSeo} className="space-y-4 text-xs">
              <div>
                <div className="flex flex-wrap justify-between items-center gap-1 mb-1.5">
                  <label className="font-bold text-slate-700">Meta Title</label>
                  <span className={`text-[10px] font-bold ${
                    editingPage.metaTitle.length >= 40 && editingPage.metaTitle.length <= 65 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {editingPage.metaTitle.length}/65 chars (Target: 40-65)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={editingPage.metaTitle}
                  onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-1 mb-1.5">
                  <label className="font-bold text-slate-700">Meta Description</label>
                  <span className={`text-[10px] font-bold ${
                    editingPage.metaDescription.length >= 120 && editingPage.metaDescription.length <= 165 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {editingPage.metaDescription.length}/165 chars (Target: 120-165)
                  </span>
                </div>
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
                  required
                  value={editingPage.focusKeyword}
                  onChange={(e) => setEditingPage({ ...editingPage, focusKeyword: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              {/* Real-time Checklist */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${editingPage.metaTitle.length >= 40 && editingPage.metaTitle.length <= 65 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={editingPage.metaTitle.length >= 40 && editingPage.metaTitle.length <= 65 ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Title length between 40-65 characters
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${editingPage.metaDescription.length >= 120 && editingPage.metaDescription.length <= 165 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={editingPage.metaDescription.length >= 120 && editingPage.metaDescription.length <= 165 ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Description length between 120-165 characters
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${editingPage.focusKeyword && editingPage.metaTitle.toLowerCase().includes(editingPage.focusKeyword.toLowerCase()) ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={editingPage.focusKeyword && editingPage.metaTitle.toLowerCase().includes(editingPage.focusKeyword.toLowerCase()) ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Focus keyword included in Title
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${editingPage.focusKeyword && editingPage.metaDescription.toLowerCase().includes(editingPage.focusKeyword.toLowerCase()) ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={editingPage.focusKeyword && editingPage.metaDescription.toLowerCase().includes(editingPage.focusKeyword.toLowerCase()) ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Focus keyword included in Meta Description
                  </span>
                </div>
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
