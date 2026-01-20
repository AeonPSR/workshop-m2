"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Common nationalities (sorted alphabetically)
const NATIONALITIES = [
  { code: "DZ", name: "Algérie" },
  { code: "DE", name: "Allemagne" },
  { code: "GB-ENG", name: "Angleterre" },
  { code: "AO", name: "Angola" },
  { code: "AR", name: "Argentine" },
  { code: "AM", name: "Arménie" },
  { code: "BE", name: "Belgique" },
  { code: "BJ", name: "Bénin" },
  { code: "BR", name: "Brésil" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CM", name: "Cameroun" },
  { code: "CV", name: "Cap-Vert" },
  { code: "CF", name: "Centrafrique" },
  { code: "CL", name: "Chili" },
  { code: "CO", name: "Colombie" },
  { code: "KM", name: "Comores" },
  { code: "CG", name: "Congo" },
  { code: "KR", name: "Corée du Sud" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatie" },
  { code: "DK", name: "Danemark" },
  { code: "EG", name: "Égypte" },
  { code: "GB-SCT", name: "Écosse" },
  { code: "ES", name: "Espagne" },
  { code: "US", name: "États-Unis" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Grèce" },
  { code: "GN", name: "Guinée" },
  { code: "GQ", name: "Guinée équatoriale" },
  { code: "GW", name: "Guinée-Bissau" },
  { code: "HT", name: "Haïti" },
  { code: "NL", name: "Pays-Bas" },
  { code: "HU", name: "Hongrie" },
  { code: "GB-NIR", name: "Irlande du Nord" },
  { code: "IE", name: "Irlande" },
  { code: "IT", name: "Italie" },
  { code: "JP", name: "Japon" },
  { code: "LB", name: "Liban" },
  { code: "LR", name: "Liberia" },
  { code: "LU", name: "Luxembourg" },
  { code: "MK", name: "Macédoine du Nord" },
  { code: "MG", name: "Madagascar" },
  { code: "ML", name: "Mali" },
  { code: "MA", name: "Maroc" },
  { code: "MR", name: "Mauritanie" },
  { code: "MX", name: "Mexique" },
  { code: "ME", name: "Monténégro" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norvège" },
  { code: "NZ", name: "Nouvelle-Zélande" },
  { code: "UG", name: "Ouganda" },
  { code: "GB-WLS", name: "Pays de Galles" },
  { code: "PL", name: "Pologne" },
  { code: "PT", name: "Portugal" },
  { code: "CD", name: "RD Congo" },
  { code: "RO", name: "Roumanie" },
  { code: "RU", name: "Russie" },
  { code: "RW", name: "Rwanda" },
  { code: "SN", name: "Sénégal" },
  { code: "RS", name: "Serbie" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SK", name: "Slovaquie" },
  { code: "SI", name: "Slovénie" },
  { code: "SD", name: "Soudan" },
  { code: "SE", name: "Suède" },
  { code: "CH", name: "Suisse" },
  { code: "TD", name: "Tchad" },
  { code: "CZ", name: "Tchéquie" },
  { code: "TG", name: "Togo" },
  { code: "TN", name: "Tunisie" },
  { code: "TR", name: "Turquie" },
  { code: "UA", name: "Ukraine" },
  { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" },
  { code: "ZM", name: "Zambie" },
  { code: "ZW", name: "Zimbabwe" },
];

const POSITIONS_433 = [
  { value: "GB", label: "Gardien de but" },
  { value: "AG", label: "Arrière gauche" },
  { value: "DCG", label: "Défenseur central gauche" },
  { value: "DCD", label: "Défenseur central droit" },
  { value: "AD", label: "Arrière droit" },
  { value: "MD", label: "Milieu défensif" },
  { value: "MCG", label: "Milieu central gauche" },
  { value: "MCD", label: "Milieu central droit" },
  { value: "AIG", label: "Ailier gauche" },
  { value: "AC", label: "Avant-centre" },
  { value: "AID", label: "Ailier droit" },
];

const POSITIONS_352 = [
  { value: "GB", label: "Gardien de but" },
  { value: "DCG", label: "Défenseur central gauche" },
  { value: "DCA", label: "Défenseur central axe" },
  { value: "DCD", label: "Défenseur central droit" },
  { value: "PG", label: "Piston gauche" },
  { value: "PD", label: "Piston droit" },
  { value: "MD", label: "Milieu défensif" },
  { value: "MCG", label: "Milieu central gauche" },
  { value: "MCD", label: "Milieu central droit" },
  { value: "ATG", label: "Attaquant gauche" },
  { value: "ATD", label: "Attaquant droit" },
];

const CV_COLORS = [
  { name: "Azure profond", value: "#1E5EFF" },
  { name: "Terracotta", value: "#C46A4A" },
  { name: "Olive", value: "#5B6B3A" },
  { name: "Navy", value: "#0F2A43" },
  { name: "Sable", value: "#D6C6A8" },
  { name: "Bordeaux", value: "#7A1E3A" },
];

const STEPS = [
  { id: 1, name: "Identité" },
  { id: 2, name: "Poste" },
  { id: 3, name: "Profil" },
  { id: 4, name: "Carrière" },
  { id: 5, name: "Formation" },
  { id: 6, name: "Contact" },
];

export default function PlayerForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Identity
    firstName: "",
    lastName: "",
    photo: null as File | null,
    photoPreview: "",
    
    // Step 2 - Position
    composition: "4-3-3" as "4-3-3" | "3-5-2",
    mainPosition: "",
    secondaryPosition: "",
    
    // Step 3 - Profile
    nationalities: ["FR"] as string[],
    birthDate: "",
    preferredFoot: "",
    height: "",
    weight: "",
    vma: "",
    envergure: "",
    shareLink: "",
    qualities: [""] as string[],
    email: "",
    phone: "",
    cvColor: "#1E5EFF",
    
    // Step 4 - Career (simplified for now)
    seasons: [] as Array<{
      year: string;
      club: string;
      category: string;
      matches: string;
      goals: string;
      assists: string;
    }>,
    
    // Step 5 - Formation & Trials
    formations: [] as Array<{
      year: string;
      title: string;
      details: string;
    }>,
    trials: [] as Array<{
      club: string;
      year: string;
    }>,
    
    // Step 6 - Contact
    agentEmail: "",
    agentPhone: "",
    videoUrl: "",
    transfermarktUrl: "",
    notes: "",
  });

  const [isNationalityModalOpen, setIsNationalityModalOpen] = useState(false);
  const [editingNationalityIndex, setEditingNationalityIndex] = useState(0);

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("photo", file);
      updateFormData("photoPreview", URL.createObjectURL(file));
    }
  };

  const updateNationality = (index: number, value: string) => {
    const newNationalities = [...formData.nationalities];
    newNationalities[index] = value;
    updateFormData("nationalities", newNationalities);
  };

  const addNationality = () => {
    if (formData.nationalities.length < 3) {
      updateFormData("nationalities", [...formData.nationalities, ""]);
    }
  };

  const removeNationality = (index: number) => {
    if (formData.nationalities.length > 1) {
      updateFormData("nationalities", formData.nationalities.filter((_, i) => i !== index));
    }
  };

  const updateQuality = (index: number, value: string) => {
    const newQualities = [...formData.qualities];
    newQualities[index] = value;
    updateFormData("qualities", newQualities);
  };

  const addQuality = () => {
    if (formData.qualities.length < 6) {
      updateFormData("qualities", [...formData.qualities, ""]);
    }
  };

  const removeQuality = (index: number) => {
    if (formData.qualities.length > 1) {
      updateFormData("qualities", formData.qualities.filter((_, i) => i !== index));
    }
  };

  const addSeason = () => {
    if (formData.seasons.length < 5) {
      updateFormData("seasons", [
        ...formData.seasons,
        { year: "", club: "", category: "", matches: "", goals: "", assists: "" }
      ]);
    }
  };

  const updateSeason = (index: number, field: string, value: string) => {
    const newSeasons = [...formData.seasons];
    newSeasons[index] = { ...newSeasons[index], [field]: value };
    updateFormData("seasons", newSeasons);
  };

  const removeSeason = (index: number) => {
    updateFormData("seasons", formData.seasons.filter((_, i) => i !== index));
  };

  const addFormation = () => {
    updateFormData("formations", [
      ...formData.formations,
      { year: "", title: "", details: "" }
    ]);
  };

  const updateFormation = (index: number, field: string, value: string) => {
    const newFormations = [...formData.formations];
    newFormations[index] = { ...newFormations[index], [field]: value };
    updateFormData("formations", newFormations);
  };

  const removeFormation = (index: number) => {
    updateFormData("formations", formData.formations.filter((_, i) => i !== index));
  };

  const addTrial = () => {
    updateFormData("trials", [
      ...formData.trials,
      { club: "", year: "" }
    ]);
  };

  const updateTrial = (index: number, field: string, value: string) => {
    const newTrials = [...formData.trials];
    newTrials[index] = { ...newTrials[index], [field]: value };
    updateFormData("trials", newTrials);
  };

  const removeTrial = (index: number) => {
    updateFormData("trials", formData.trials.filter((_, i) => i !== index));
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const getNationality = (code: string) => NATIONALITIES.find(n => n.code === code);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-6">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer hover:scale-110 ${
                      step.id <= currentStep
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}
                  >
                    {step.id}
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-1 mx-1 ${
                        step.id < currentStep ? "bg-purple-600" : "bg-gray-200"
                      }`}
                    />
                )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 font-medium">
              {STEPS[currentStep - 1].name}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Identité</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                      {formData.photoPreview ? (
                        <img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl text-gray-400">👤</span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors text-sm"
                      >
                        Choisir une photo
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Format carré recommandé</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nom"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nationalité(s) *
                    </label>
                    {formData.nationalities.length < 3 && (
                      <button
                        type="button"
                        onClick={addNationality}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                      >
                        <span className="text-lg">+</span> Ajouter
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {formData.nationalities.map((natCode, index) => {
                      const nation = getNationality(natCode);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNationalityIndex(index);
                              setIsNationalityModalOpen(true);
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-purple-400 transition-colors"
                          >
                            {nation ? (
                              <span>{nation.name}</span>
                            ) : (
                              <span className="text-gray-400">Sélectionner une nationalité</span>
                            )}
                            <span className="text-gray-400">▼</span>
                          </button>
                          {formData.nationalities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeNationality(index)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Step 2: Poste */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Poste</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Composition à afficher *
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        updateFormData("composition", "4-3-3");
                        updateFormData("mainPosition", "");
                        updateFormData("secondaryPosition", "");
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.composition === "4-3-3"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      4-3-3
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateFormData("composition", "3-5-2");
                        updateFormData("mainPosition", "");
                        updateFormData("secondaryPosition", "");
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.composition === "3-5-2"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      3-5-2
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste principal *
                  </label>
                  <select
                    value={formData.mainPosition}
                    onChange={(e) => updateFormData("mainPosition", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    {(formData.composition === "4-3-3" ? POSITIONS_433 : POSITIONS_352).map((pos) => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>

                {!formData.secondaryPosition && formData.mainPosition && (
                  <button
                    type="button"
                    onClick={() => updateFormData("secondaryPosition", "_show")}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                  >
                    <span className="text-lg">+</span> Ajouter un poste secondaire
                  </button>
                )}

                {(formData.secondaryPosition || formData.secondaryPosition === "_show") && formData.secondaryPosition !== "" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Poste secondaire
                      </label>
                      <button
                        type="button"
                        onClick={() => updateFormData("secondaryPosition", "")}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                    <select
                      value={formData.secondaryPosition === "_show" ? "" : formData.secondaryPosition}
                      onChange={(e) => updateFormData("secondaryPosition", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {(formData.composition === "4-3-3" ? POSITIONS_433 : POSITIONS_352)
                        .filter(pos => pos.value !== formData.mainPosition)
                        .map((pos) => (
                          <option key={pos.value} value={pos.value}>{pos.label}</option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Pitch Visualization */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Visualisation
                  </label>
                  <div className="flex justify-center">
                    <div className="relative w-64 h-80 bg-green-600 rounded-lg border-4 border-white shadow-lg overflow-hidden">
                      {/* Field markings */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/50 rounded-full" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 border-2 border-white/50 border-t-0" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 border-2 border-white/50 border-b-0" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 border-2 border-white/50 border-t-0" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-5 border-2 border-white/50 border-b-0" />

                      {/* 4-3-3 Formation dots */}
                      {formData.composition === "4-3-3" && (
                        <>
                          {/* Goalkeeper */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "GB" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "GB" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "4%", left: "50%" }} title="Gardien de but" />
                          {/* Defense */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "AG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "18%", left: "15%" }} title="Arrière gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "DCG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "38%" }} title="Défenseur central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "DCD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "62%" }} title="Défenseur central droit" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "AD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "18%", left: "85%" }} title="Arrière droit" />
                          {/* Midfield */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "MD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "38%", left: "50%" }} title="Milieu défensif" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "MCG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "30%" }} title="Milieu central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "MCD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "70%" }} title="Milieu central droit" />
                          {/* Attack */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AIG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "AIG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "18%" }} title="Ailier gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AC" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "AC" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "78%", left: "50%" }} title="Avant-centre" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AID" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "AID" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "82%" }} title="Ailier droit" />
                        </>
                      )}

                      {/* 3-5-2 Formation dots */}
                      {formData.composition === "3-5-2" && (
                        <>
                          {/* Goalkeeper */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "GB" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "GB" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "4%", left: "50%" }} title="Gardien de but" />
                          {/* Defense */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "DCG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "25%" }} title="Défenseur central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCA" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "DCA" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "12%", left: "50%" }} title="Défenseur central axe" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "DCD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "75%" }} title="Défenseur central droit" />
                          {/* Midfield */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "PG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "PG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "40%", left: "10%" }} title="Piston gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "PD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "PD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "40%", left: "90%" }} title="Piston droit" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "MD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "32%", left: "50%" }} title="Milieu défensif" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "MCG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "35%" }} title="Milieu central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "MCD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "65%" }} title="Milieu central droit" />
                          {/* Attack */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "ATG" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "ATG" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "35%" }} title="Attaquant gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "ATD" ? "bg-purple-500 ring-2 ring-white scale-125" : formData.secondaryPosition === "ATD" ? "bg-purple-300 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "65%" }} title="Attaquant droit" />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500 ring-2 ring-white" />
                      <span>Principal</span>
                    </div>
                    {formData.secondaryPosition && formData.secondaryPosition !== "_show" && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-300 ring-2 ring-white" />
                        <span>Secondaire</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Profil */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Profil sportif</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateFormData("birthDate", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pied fort *
                    </label>
                    <select
                      value={formData.preferredFoot}
                      onChange={(e) => updateFormData("preferredFoot", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Droit">Droit</option>
                      <option value="Gauche">Gauche</option>
                      <option value="Ambidextre">Ambidextre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille (cm) *
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => updateFormData("height", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="180"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VMA (km/h)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vma}
                      onChange={(e) => updateFormData("vma", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="18.5"
                    />
                  </div>
                </div>

                {/* Envergure - only for goalkeepers */}
                {(formData.mainPosition === "GB" || formData.secondaryPosition === "GB") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envergure (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.envergure}
                      onChange={(e) => updateFormData("envergure", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="193"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien à partager
                  </label>
                  <input
                    type="url"
                    value={formData.shareLink}
                    onChange={(e) => updateFormData("shareLink", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Vidéo, portfolio..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Qualités
                    </label>
                    {formData.qualities.length < 6 && (
                      <button
                        type="button"
                        onClick={addQuality}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                      >
                        <span className="text-lg">+</span> Ajouter
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {formData.qualities.map((quality, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={32}
                          value={quality}
                          onChange={(e) => updateQuality(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder=""
                        />
                        {formData.qualities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuality(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {formData.qualities.some(q => q) && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Aperçu des qualités :</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.qualities.filter(q => q).map((q, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-sm text-white"
                          style={{ backgroundColor: formData.cvColor }}
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-3">Agent sportif (optionnel)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email agent
                        </label>
                        <input
                          type="email"
                          value={formData.agentEmail}
                          onChange={(e) => updateFormData("agentEmail", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="agent@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone agent
                        </label>
                        <input
                          type="tel"
                          value={formData.agentPhone}
                          onChange={(e) => updateFormData("agentPhone", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Career */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Carrière</h2>
                  {formData.seasons.length < 5 && (
                    <button
                      type="button"
                      onClick={addSeason}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      + Ajouter une saison
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600">Maximum 5 saisons</p>

                {formData.seasons.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucune saison ajoutée</p>
                    <button
                      type="button"
                      onClick={addSeason}
                      className="mt-2 text-purple-600 hover:underline"
                    >
                      Ajouter votre première saison
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.seasons.map((season, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-700">Saison {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeSeason(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Supprimer
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={season.year}
                            onChange={(e) => updateSeason(index, "year", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Saison (ex: 2024/2025)"
                          />
                          <input
                            type="text"
                            value={season.club}
                            onChange={(e) => updateSeason(index, "club", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Club"
                          />
                          <input
                            type="text"
                            value={season.category}
                            onChange={(e) => updateSeason(index, "category", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Catégorie (ex: U19)"
                          />
                          <input
                            type="number"
                            value={season.matches}
                            onChange={(e) => updateSeason(index, "matches", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Matchs"
                          />
                          <input
                            type="number"
                            value={season.goals}
                            onChange={(e) => updateSeason(index, "goals", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Buts"
                          />
                          <input
                            type="number"
                            value={season.assists}
                            onChange={(e) => updateSeason(index, "assists", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Passes D."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Formation & Trials */}
            {currentStep === 5 && (
              <div className="space-y-8">
                {/* Formations */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Formations</h2>
                    <button
                      type="button"
                      onClick={addFormation}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>

                  {formData.formations.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune formation ajoutée</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.formations.map((formation, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-end mb-2">
                            <button
                              type="button"
                              onClick={() => removeFormation(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={formation.year}
                              onChange={(e) => updateFormation(index, "year", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Année ou période"
                            />
                            <input
                              type="text"
                              value={formation.title}
                              onChange={(e) => updateFormation(index, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Titre (ex: Sélection régionale AURA)"
                            />
                            <textarea
                              value={formation.details}
                              onChange={(e) => updateFormation(index, "details", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                              placeholder="Détails (optionnel)"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trials */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Essais / Marques d&apos;intérêt</h2>
                    <button
                      type="button"
                      onClick={addTrial}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>

                  {formData.trials.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucun essai ajouté</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.trials.map((trial, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={trial.club}
                            onChange={(e) => updateTrial(index, "club", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Club"
                          />
                          <input
                            type="text"
                            maxLength={4}
                            value={trial.year}
                            onChange={(e) => updateTrial(index, "year", e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Année"
                          />
                          <button
                            type="button"
                            onClick={() => removeTrial(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Contact */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Contact</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur du CV *
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {CV_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => updateFormData("cvColor", color.value)}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${
                          formData.cvColor === color.value
                            ? "border-gray-800 scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Agent sportif (optionnel)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email agent
                      </label>
                      <input
                        type="email"
                        value={formData.agentEmail}
                        onChange={(e) => updateFormData("agentEmail", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="agent@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone agent
                      </label>
                      <input
                        type="tel"
                        value={formData.agentPhone}
                        onChange={(e) => updateFormData("agentPhone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Liens (optionnels)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lien vidéo sportive
                      </label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => updateFormData("videoUrl", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profil Transfermarkt
                      </label>
                      <input
                        type="url"
                        value={formData.transfermarktUrl}
                        onChange={(e) => updateFormData("transfermarktUrl", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://transfermarkt.fr/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes, commentaires (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Informations complémentaires, situation particulière, objectifs..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Précédent
              </button>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-medium hover:opacity-90 transition-all"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-medium hover:opacity-90 transition-all"
                >
                  Soumettre mon CV
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Nationality Modal */}
      {isNationalityModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Sélectionner une nationalité</h3>
              <button
                onClick={() => setIsNationalityModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] space-y-1">
              {NATIONALITIES.map((nation) => (
                <button
                  key={nation.code}
                  type="button"
                  onClick={() => {
                    updateNationality(editingNationalityIndex, nation.code);
                    setIsNationalityModalOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    formData.nationalities[editingNationalityIndex] === nation.code
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">{nation.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
