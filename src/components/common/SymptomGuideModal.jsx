import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Stethoscope, 
  ArrowUpRight, 
  MessageCircle, 
  ShieldCheck, 
  Activity,
  HeartPulse,
  Leaf
} from 'lucide-react';

const SYMPTOM_DATA = [
  {
    category: "Digestion & Acidity",
    icon: "🫄",
    symptoms: ["Gas & Bloating", "Acidity & GERD", "Indigestion", "Constipation", "Sour Burping"],
    remedies: [
      {
        name: "Nux Vomica 200CH",
        form: "Globules / Dilution",
        keynote: "Indigestion, heartburn, and sour belching from sedentary habits, coffee, spicy foods, or late-night dinners.",
        dosage: "4 pills at night before sleep for 7–10 days.",
        searchQuery: "Nux Vomica"
      },
      {
        name: "Carbo Vegetabilis 30C",
        form: "Globules",
        keynote: "Severe upper abdominal bloating and excessive gas distress; temporary relief from belching or fresh cool air.",
        dosage: "4 pills twice daily before meals.",
        searchQuery: "Carbo Veg"
      },
      {
        name: "Lycopodium 200CH",
        form: "Globules / Dilution",
        keynote: "Lower abdominal gas with hunger cravings; complaints predictably worsen between 4:00 PM and 8:00 PM.",
        dosage: "4 pills once daily in the morning.",
        searchQuery: "Lycopodium"
      }
    ]
  },
  {
    category: "Joint, Knee & Muscle Pain",
    icon: "🦵",
    symptoms: ["Knee Stiffness", "Arthritis", "Backache", "Muscle Sprains", "Sciatica"],
    remedies: [
      {
        name: "Rhus Toxicodendron 200CH",
        form: "Globules / Dilution",
        keynote: "Joint and tendon stiffness that is painful on first movement but improves with continuous mild walking and warm applications.",
        dosage: "4 pills twice daily after food for 15 days.",
        searchQuery: "Rhus Tox"
      },
      {
        name: "Bryonia Alba 30C",
        form: "Globules",
        keynote: "Sharp stitching joint pains that worsen with the slightest bodily movement; relieved by lying still on painful side.",
        dosage: "4 pills twice daily.",
        searchQuery: "Bryonia"
      },
      {
        name: "Arnica Montana 200CH",
        form: "Liquid Drops / Globules",
        keynote: "General muscular soreness, bruised sensation, trauma, sprains, or post-strenuous physical exercise.",
        dosage: "4 pills twice daily or 3 drops in water.",
        searchQuery: "Arnica Montana"
      }
    ]
  },
  {
    category: "Hair Fall & Scalp Care",
    icon: "💇",
    symptoms: ["Excessive Hair Loss", "Dandruff & Itch", "Premature Graying", "Thinning Hair"],
    remedies: [
      {
        name: "Arnica Hair Care Forte",
        form: "External Herbal Tonic",
        keynote: "Nourishes dormant hair roots, stimulates active micro-circulation of scalp, and arrests post-illness telogen effluvium.",
        dosage: "Gently massage into scalp roots 3 nights a week.",
        searchQuery: "Arnica Hair"
      },
      {
        name: "Silicea 6X (Biochemic)",
        form: "Biochemic Tablets",
        keynote: "Strengthens brittle, lackluster hair shafts and nourishes collagen synthesis for strong follicles and nails.",
        dosage: "4 tablets chewed twice daily with warm water.",
        searchQuery: "Silicea"
      },
      {
        name: "Wiesbaden 30C",
        form: "Globules",
        keynote: "Renowned classical remedy specifically known to accelerate rapid new hair regrowth and darken graying strands.",
        dosage: "4 pills twice daily for 30 days.",
        searchQuery: "Wiesbaden"
      }
    ]
  },
  {
    category: "Cold, Cough & Sinus",
    icon: "🤧",
    symptoms: ["Running Nose", "Dry Cough", "Sinus Headache", "Throat Soreness", "Sneezing"],
    remedies: [
      {
        name: "Aconitum Napellus 30C",
        form: "Globules",
        keynote: "Sudden violent onset of sneezing, chills, or fever within hours after exposure to cold air conditioning or dry chilly wind.",
        dosage: "4 pills every 3 hours during acute onset.",
        searchQuery: "Aconite"
      },
      {
        name: "Allium Cepa 30C",
        form: "Globules",
        keynote: "Profuse watery acrid nasal discharge that irritates upper lip, accompanied by non-irritating tears from eyes.",
        dosage: "4 pills twice daily.",
        searchQuery: "Allium Cepa"
      },
      {
        name: "Belladonna 200CH",
        form: "Globules",
        keynote: "Throbbing congestive headache, feverish heat, flushed red face, and dry painful swallowing in throat.",
        dosage: "4 pills twice daily.",
        searchQuery: "Belladonna"
      }
    ]
  },
  {
    category: "Stress, Sleep & Mental Fatigue",
    icon: "🧘",
    symptoms: ["Insomnia", "Work Exhaustion", "Exam Anxiety", "Restlessness", "Headache"],
    remedies: [
      {
        name: "Kali Phosphoricum 6X",
        form: "Biochemic Tablets",
        keynote: "The premier homeopathic nerve tonic for brain fog, workplace burnout, exam stress, and nervous headaches.",
        dosage: "4 tablets chewed morning and evening.",
        searchQuery: "Kali Phos"
      },
      {
        name: "Passiflora Incarnata Q",
        form: "Mother Tincture Drops",
        keynote: "Gentle herbal sedative that calms an overactive nervous system and induces tranquil, natural restorative sleep.",
        dosage: "15 drops in 1/4th cup of lukewarm water at bedtime.",
        searchQuery: "Passiflora"
      }
    ]
  },
  {
    category: "Skin & Complexion",
    icon: "🌸",
    symptoms: ["Acne & Pimples", "Eczema / Itching", "Dark Spots", "Psoriasis", "Skin Allergy"],
    remedies: [
      {
        name: "Berberis Aquifolium Q",
        form: "Mother Tincture Drops",
        keynote: "Renowned natural blood purifier that clears stubborn facial acne, scars, dark blemishes, and boosts glowing skin complexion.",
        dosage: "10 drops in 1/4th cup water twice daily after meals.",
        searchQuery: "Berberis Aquifolium"
      },
      {
        name: "Sulphur 30C",
        form: "Globules",
        keynote: "Dry, scaly, itchy skin conditions aggravated by bathing and warmth of bed; great constitutional cleanser.",
        dosage: "4 pills once daily in the morning on empty stomach.",
        searchQuery: "Sulphur"
      }
    ]
  }
];

export const SymptomGuideModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(SYMPTOM_DATA[0].category);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open_symptom_guide', handleOpen);
    return () => window.removeEventListener('open_symptom_guide', handleOpen);
  }, []);

  if (!isOpen) return null;

  const filteredCategories = SYMPTOM_DATA.map(cat => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return cat;

    const matchesCategory = cat.category.toLowerCase().includes(term);
    const matchingSymptoms = cat.symptoms.filter(s => s.toLowerCase().includes(term));
    const matchingRemedies = cat.remedies.filter(r => 
      r.name.toLowerCase().includes(term) ||
      r.keynote.toLowerCase().includes(term)
    );

    if (matchesCategory || matchingSymptoms.length > 0 || matchingRemedies.length > 0) {
      return {
        ...cat,
        remedies: matchingRemedies.length > 0 ? matchingRemedies : cat.remedies
      };
    }
    return null;
  }).filter(Boolean);

  const activeCategoryData = filteredCategories.find(c => c.category === selectedCategory) || filteredCategories[0];

  const handleNavigateToShop = (query) => {
    setIsOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const handleDoctorWhatsApp = (remedyName, category) => {
    const text = `Hello Dr. Bharathi,\nI am looking at the Homeopathic Symptom Guide for *${category}* (interested in *${remedyName}*).\nCould I consult with you regarding my specific symptoms?`;
    window.open(`https://wa.me/919025854711?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-navy-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Top Header Bar */}
        <div className="bg-gradient-to-r from-[#072538] via-[#0d4567] to-[#072538] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Classical Homeopathic Reference
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Symptom & Classical Remedy Guide
            </h2>
            <p className="text-xs text-slate-300">
              Curated by Dr. Bharathi (B.H.M.S, M.D.) for quick clinical reference
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 sm:static w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Quick Filter Input */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by symptom or remedy (e.g. knee pain, gas, hair fall, cough, nux vomica...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brandOrange-500 shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Body Layout: Left Categories List, Right Remedies Grid */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Categories Sidebar */}
          <div className="w-full md:w-72 bg-slate-50/70 border-r border-slate-200 p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1.5 shrink-0">
            {filteredCategories.map((cat) => {
              const isActive = activeCategoryData?.category === cat.category;
              return (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between shrink-0 md:shrink text-xs font-extrabold ${
                    isActive
                      ? 'bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white shadow-md shadow-brandOrange-500/20'
                      : 'text-slate-700 hover:bg-white hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.category}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {cat.remedies.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-white">
            {activeCategoryData ? (
              <>
                {/* Active Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                      <span>{activeCategoryData.icon}</span>
                      <span>{activeCategoryData.category}</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeCategoryData.symptoms.map((s, idx) => (
                        <span key={idx} className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Remedies List */}
                <div className="space-y-4">
                  {activeCategoryData.remedies.map((remedy, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 hover:border-brandOrange-300 transition-colors shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-600 block">
                            {remedy.form}
                          </span>
                          <h4 className="font-black text-base text-navy-950">
                            {remedy.name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleNavigateToShop(remedy.searchQuery)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brandOrange-50 hover:bg-brandOrange-100 text-brandOrange-700 text-xs font-black rounded-xl border border-brandOrange-200/60 transition-all cursor-pointer"
                          >
                            <span>Search in Store</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDoctorWhatsApp(remedy.name, activeCategoryData.category)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black rounded-xl border border-emerald-200/60 transition-all cursor-pointer"
                            title="Ask Dr. Bharathi about this remedy"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Ask Doctor</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1.5">
                        <p className="leading-relaxed">
                          <strong className="text-slate-900">Keynote Symptoms: </strong>
                          {remedy.keynote}
                        </p>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
                          <span className="font-extrabold text-brandOrange-600 uppercase text-[10px] shrink-0">General Dosage:</span>
                          <span>{remedy.dosage}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Classical Homeopathy Medical Disclaimer Banner */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold">Individualized Constitutional Healing Note</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Homeopathy treats the individual patient, not merely the disease name. While these classical remedies are widely verified, chronic or recurring ailments respond best to constitutional case taking with Dr. Bharathi.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <p className="font-bold text-sm">No symptoms or remedies found matching "{searchTerm}"</p>
                <p className="text-xs">Try searching for "joint", "gas", "cough", "skin", or "hair".</p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-[11px]">
            Need personal guidance? Dr. Bharathi is available for in-clinic and online video consultations.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/book-appointment');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-[#0b344d] to-[#124d70] hover:from-[#08283b] text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-amber-300" />
              <span>Book Doctor Consultation</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SymptomGuideModal;
