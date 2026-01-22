"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDemoMode } from "@/context/DemoModeContext"; // ⚠️ DEMO MODE - REMOVE FOR PRODUCTION
import { getThumbnailURL } from "@/lib/utils/methods";
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
  { name: "Azure profond", value: "#1E5EFF", file: "bleu" },
  { name: "Terracotta", value: "#C46A4A", file: "orange" },
  { name: "Olive", value: "#5B6B3A", file: "vert" },
  { name: "Navy", value: "#0F2A43", file: "bleu fonce" },
  { name: "Sable", value: "#D6C6A8", file: "beige" },
  { name: "Bordeaux", value: "#7A1E3A", file: "rouge" },
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
  const router = useRouter();
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
    internationals: [""] as string[],
    shareLink: "",
    qualities: [""] as string[],
    email: "",
    phone: "",
    cvColor: "#1E5EFF",
    
    // Step 4 - Career
    seasons: [] as Array<{
      year: string;
      isSplit: boolean;
      isCurrent: boolean;
      // Full season data
      club: string;
      division: string;
      category: string;
      matches: string;
      goals: string;
      assists: string;
      cleanSheets: string;
      avgPlayingTime: string;
      comments: string[];
      // Split season data
      firstHalf: {
        club: string;
        division: string;
        category: string;
        matches: string;
        goals: string;
        assists: string;
        cleanSheets: string;
        avgPlayingTime: string;
        comments: string[];
      };
      secondHalf: {
        club: string;
        division: string;
        category: string;
        matches: string;
        goals: string;
        assists: string;
        cleanSheets: string;
        avgPlayingTime: string;
        comments: string[];
      };
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
    transfermarktUrl: "",
    notes: "",
  });

  const [isNationalityModalOpen, setIsNationalityModalOpen] = useState(false);
  const [editingNationalityIndex, setEditingNationalityIndex] = useState(0);
  const [isInternationalModalOpen, setIsInternationalModalOpen] = useState(false);
  const [editingInternationalIndex, setEditingInternationalIndex] = useState(0);
  const [activeHalfTab, setActiveHalfTab] = useState<Record<number, "first" | "second">>({});

  /* ============================================================================
     ██████╗ ███████╗███╗   ███╗ ██████╗     ███╗   ███╗ ██████╗ ██████╗ ███████╗
     ██╔══██╗██╔════╝████╗ ████║██╔═══██╗    ████╗ ████║██╔═══██╗██╔══██╗██╔════╝
     ██║  ██║█████╗  ██╔████╔██║██║   ██║    ██╔████╔██║██║   ██║██║  ██║█████╗  
     ██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║    ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  
     ██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝    ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗
     ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝     ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
     
  ============================================================================ */
  const { registerPrefillCallback } = useDemoMode();

  const DEMO_PREFILL_DATA = {
    firstName: "Kylian",
    lastName: "Mbappé",
    photo: null as File | null,
    internationals: ["FR"] as string[],
    photoPreview: "/DEMO-mbappe.jpg", // ⚠️ DEMO - Image in public folder
    composition: "4-3-3" as "4-3-3" | "3-5-2",
    mainPosition: "AIG",
    secondaryPosition: "AC",
    nationalities: ["FR", "CM"] as string[],
    birthDate: "1998-12-20",
    preferredFoot: "Droit",
    height: "178",
    weight: "73",
    vma: "22.5",
    envergure: "180",
    shareLink: "https://www.youtube.com/watch?v=GYiyIacyTUc", // ⚠️ DEMO
    qualities: ["Vitesse", "Dribble", "Finition"] as string[],
    email: "kylian.mbappe@example.com",
    phone: "+33 6 12 34 56 78",
    cvColor: "#0F2A43",
    seasons: [
      {
        year: "2023-2024",
        isSplit: false,
        isCurrent: true,
        club: "Paris Saint-Germain",
        division: "Ligue 1",
        category: "Sénior",
        matches: "29",
        goals: "27",
        assists: "7",
        cleanSheets: "0",
        avgPlayingTime: "85",
        comments: ["Meilleur buteur du championnat", "Capitaine de l'équipe"],
        firstHalf: { club: "", division: "", category: "", matches: "", goals: "", assists: "", cleanSheets: "", avgPlayingTime: "", comments: [] },
        secondHalf: { club: "", division: "", category: "", matches: "", goals: "", assists: "", cleanSheets: "", avgPlayingTime: "", comments: [] },
      },
      {
        year: "2022-2023",
        isSplit: false,
        isCurrent: false,
        club: "Paris Saint-Germain",
        division: "Ligue 1",
        category: "Sénior",
        matches: "34",
        goals: "29",
        assists: "5",
        cleanSheets: "0",
        avgPlayingTime: "87",
        comments: ["Champion de France"],
        firstHalf: { club: "", division: "", category: "", matches: "", goals: "", assists: "", cleanSheets: "", avgPlayingTime: "", comments: [] },
        secondHalf: { club: "", division: "", category: "", matches: "", goals: "", assists: "", cleanSheets: "", avgPlayingTime: "", comments: [] },
      },
    ],
    formations: [
      { year: "2013-2017", title: "Centre de Formation AS Monaco", details: "Formation complète au poste d'attaquant" },
      { year: "2011-2013", title: "INF Clairefontaine", details: "Pôle Espoirs" },
    ],
    trials: [
      { club: "Real Madrid", year: "2012" },
      { club: "Chelsea FC", year: "2012" },
    ],
    agentEmail: "agent@example.com",
    agentPhone: "+33 1 23 45 67 89",
    transfermarktUrl: "https://www.transfermarkt.com/kylian-mbappe/profil/spieler/342229",
    notes: "Joueur exceptionnel avec un potentiel de classe mondiale.",
  };

  const handleDemoPrefill = () => {
    setFormData(DEMO_PREFILL_DATA);
    setCurrentStep(1);
  };

  useEffect(() => {
    registerPrefillCallback(handleDemoPrefill);
    return () => registerPrefillCallback(null);
  }, [registerPrefillCallback]);
  /* ============================================================================
     END OF DEMO MODE CODE - REMOVE THIS ENTIRE SECTION FOR PRODUCTION
  ============================================================================ */





  

   const submitForm = async () => {
  try {
    // Préparer le body
    const body = {

        
        cv_color: formData.cvColor,
       composition_to_display: formData.composition,
        comments: formData.notes,
        playerData: {
        internationals : formData.internationals.join(','),
        player_image : formData.photoPreview,
        nationality1: formData.nationalities[0],
        nationality2 : formData.nationalities[1],
        nationality3 : formData.nationalities[2],
        firstname: formData.firstName,
        lastname: formData.lastName,
        date_of_birth: formData.birthDate,
        preferred_foot: formData.preferredFoot,
        height: Number(formData.height) || null,
        weight: Number(formData.weight) || null,
        primary_position: formData.mainPosition,
        secondary_position: formData.secondaryPosition,
        vma: Number(formData.vma) || null,
        qualities: formData.qualities.join(','),
        email: formData.email,
        phone: formData.phone,
        email_agent: formData.agentEmail,
        phone_agent: formData.agentPhone,
        transfermark_url: formData.transfermarktUrl,
      },
seasons: formData.seasons.map(s => {
  const isSplit = s.isSplit ? 1 : 0;
  
  return {
    duration: s.year || null,
    current_season: s.isCurrent ? 1 : 0,
    is_split: isSplit,
    clubSeasons: isSplit === 1
      ? [
          // PREMIÈRE MOITIÉ (half_number: 1 dans le back)
          {
            name: s.firstHalf.club || null,
            category: s.firstHalf.category || null,
            matchs: Number(s.firstHalf.matches) || 0,
            division : s.firstHalf.division,
            goals: Number(s.firstHalf.goals) || 0,
            assists: Number(s.firstHalf.assists) || 0,
            average_playing_time: Number(s.firstHalf.avgPlayingTime) || 0,
            comment1: s.firstHalf.comments?.[0] || null,
            comment2: s.firstHalf.comments?.[1] || null,
            comment3: s.firstHalf.comments?.[2] || null,
          },
          // DEUXIÈME MOITIÉ (half_number: 2 dans le back)
          {
            name: s.secondHalf.club || null,
            category: s.secondHalf.category || null,
            matchs: Number(s.secondHalf.matches) || 0,
            division : s.secondHalf.division,
            goals: Number(s.secondHalf.goals) || 0,
            assists: Number(s.secondHalf.assists) || 0,
            average_playing_time: Number(s.secondHalf.avgPlayingTime) || 0,
            comment1: s.secondHalf.comments?.[0] || null,
            comment2: s.secondHalf.comments?.[1] || null,
            comment3: s.secondHalf.comments?.[2] || null,
          }
        ]
      : [
          // SAISON COMPLÈTE
          {
            name: s.club || null,
            category: s.category || null,
            matchs: Number(s.matches) || 0,
            division : s.division,
            goals: Number(s.goals) || 0,
            assists: Number(s.assists) || 0,
            average_playing_time: Number(s.avgPlayingTime) || 0,
            comment1: s.comments?.[0] || null,
            comment2: s.comments?.[1] || null,
            comment3: s.comments?.[2] || null,
          }
        ]
  };
}),



    
  formations: formData.formations.map(f => ({
        duration: f.year,
        title: f.title,
        details: f.details,
      })),
      essais: formData.trials.map(t => ({
        club: t.club,
        year: t.year,
      })),
      // Links - only send shareLink
      links: formData.shareLink?.trim() 
        ? [{ url: formData.shareLink.trim(), link_type: 'share' }] 
        : [],
    };

    const res = await fetch('http://localhost:3000/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Erreur serveur');

    router.push('/');
  } catch (err: any) {
    console.error(err);
    alert(`Erreur Serveur`);
  }
};




useEffect(() => {
  console.log("seasons :" ,formData.seasons)
} , [formData])

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange =  async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("photo", file);
      const imageUrl = await getThumbnailURL(file)
      updateFormData("photoPreview",imageUrl);
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
        {
          year: "",
          isSplit: false,
          isCurrent: false,
          club: "",
          division: "",
          category: "",
          matches: "",
          goals: "",
          assists: "",
          cleanSheets: "",
          avgPlayingTime: "",
          comments: [],
          firstHalf: { club: "", division: "", category: "", matches: "", goals: "", assists: "", cleanSheets: "", avgPlayingTime: "", comments: [] },
          secondHalf: { club: "", division: "", category: "", matches: "", goals: "", assists: "", cleanSheets: "", avgPlayingTime: "", comments: [] }
        }
      ]);
    }
  };

  const updateSeason = (index: number, field: string, value: string | boolean) => {
    const newSeasons = [...formData.seasons];
    newSeasons[index] = { ...newSeasons[index], [field]: value };
    updateFormData("seasons", newSeasons);
  };

  const updateSeasonHalf = (index: number, half: "firstHalf" | "secondHalf", field: string, value: string) => {
    const newSeasons = [...formData.seasons];
    newSeasons[index] = {
      ...newSeasons[index],
      [half]: { ...newSeasons[index][half], [field]: value }
    };
    updateFormData("seasons", newSeasons);
  };

  const setCurrentSeason = (index: number) => {
    const isAlreadyCurrent = formData.seasons[index].isCurrent;
    const newSeasons = formData.seasons.map((season, i) => ({
      ...season,
      isCurrent: i === index ? !isAlreadyCurrent : false
    }));
    updateFormData("seasons", newSeasons);
  };

  const removeSeason = (index: number) => {
    updateFormData("seasons", formData.seasons.filter((_, i) => i !== index));
  };

  // Comment management for seasons
  const addSeasonComment = (seasonIndex: number) => {
    const newSeasons = [...formData.seasons];
    if (newSeasons[seasonIndex].comments.length < 3) {
      newSeasons[seasonIndex].comments = [...newSeasons[seasonIndex].comments, ""];
      updateFormData("seasons", newSeasons);
    }
  };

  const updateSeasonComment = (seasonIndex: number, commentIndex: number, value: string) => {
    const newSeasons = [...formData.seasons];
    newSeasons[seasonIndex].comments[commentIndex] = value;
    updateFormData("seasons", newSeasons);
  };

  const removeSeasonComment = (seasonIndex: number, commentIndex: number) => {
    const newSeasons = [...formData.seasons];
    newSeasons[seasonIndex].comments = newSeasons[seasonIndex].comments.filter((_, i) => i !== commentIndex);
    updateFormData("seasons", newSeasons);
  };

  // Comment management for half seasons
  const addHalfSeasonComment = (seasonIndex: number, half: "firstHalf" | "secondHalf") => {
    const newSeasons = [...formData.seasons];
    if (newSeasons[seasonIndex][half].comments.length < 3) {
      newSeasons[seasonIndex][half].comments = [...newSeasons[seasonIndex][half].comments, ""];
      updateFormData("seasons", newSeasons);
    }
  };

  const updateHalfSeasonComment = (seasonIndex: number, half: "firstHalf" | "secondHalf", commentIndex: number, value: string) => {
    const newSeasons = [...formData.seasons];
    newSeasons[seasonIndex][half].comments[commentIndex] = value;
    updateFormData("seasons", newSeasons);
  };

  const removeHalfSeasonComment = (seasonIndex: number, half: "firstHalf" | "secondHalf", commentIndex: number) => {
    const newSeasons = [...formData.seasons];
    newSeasons[seasonIndex][half].comments = newSeasons[seasonIndex][half].comments.filter((_, i) => i !== commentIndex);
    updateFormData("seasons", newSeasons);
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

  // CV Preview highlight areas based on current step
  const getHighlightStyle = () => {
    switch (currentStep) {
      case 1: // Identité - Photo area at top left
        return { top: '0%', left: '0%', width: '60%', height: '35%' };
      case 2: // Poste - Field/pitch area at top right
        return { top: '0%', left: '70%', width: '30%', height: '25%' };
      case 3: // Profil - PROFIL section
        return { top: '35%', left: '0%', width: '50%', height: '65%' };
      case 4: // Carrière - CARRIÈRE & STATISTIQUES section
        return { top: '22%', left: '43%', width: '57%', height: '48%' };
      case 5: // Formations - QUALITÉS section
        return { top: '70%', left: '43%', width: '57%', height: '30%' };
      case 6: // Contact - CONTACT section
        return { top: '0%', left: '0%', width: '0%', height: '0%' };
      default:
        return { top: '0%', left: '0%', width: '0%', height: '0%' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 py-6">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Progress Steps with CV Preview */}
          <div className="mb-8 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                {STEPS.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer hover:scale-110 flex-shrink-0 ${
                        step.id <= currentStep
                          ? "bg-[#FF9228] text-white"
                          : "bg-white/10 text-white/50 hover:bg-white/20"
                      }`}
                    >
                      {step.id}
                    </button>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step.id < currentStep ? "bg-[#FF9228]" : "bg-white/10"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-center text-sm text-white/60 font-medium">
                {STEPS[currentStep - 1].name}
              </p>
            </div>

            {/* CV Preview Thumbnail - hidden on step 6 */}
            {currentStep !== 6 && (
              <div className="relative w-16 sm:w-20 flex-shrink-0">
                <img 
                  src="/cv-base-433.png" 
                  alt="CV Preview" 
                  className="w-full rounded shadow-lg border border-white/20"
                />
                {/* Animated highlight rectangle */}
                <div 
                  className="absolute border-2 border-[#FF9228] rounded-sm transition-all duration-500 ease-out pointer-events-none"
                  style={{
                    ...getHighlightStyle(),
                    boxShadow: '0 0 8px rgba(255, 146, 40, 0.6)'
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Identité</h2>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Photo *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-white/10 overflow-hidden flex items-center justify-center border-2 border-dashed border-white/20">
                      {formData.photoPreview ? (
                        <img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl text-white/40">👤</span>
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
                        className="inline-block px-4 py-2 bg-[#FF9228] text-white rounded-lg cursor-pointer hover:bg-[#FF9228]/80 transition-colors text-sm"
                      >
                        Choisir une photo
                      </label>
                      <p className="text-xs text-white/50 mt-1">Format carré recommandé</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                      placeholder="Nom"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white/80">
                      Nationalité(s) *
                    </label>
                    {formData.nationalities.length < 3 && (
                      <button
                        type="button"
                        onClick={addNationality}
                        className="text-[#FF9228] hover:text-[#FF9228]/80 text-sm font-medium flex items-center gap-1"
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
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-left flex items-center justify-between hover:border-[#FF9228]/50 transition-colors"
                          >
                            {nation ? (
                              <span className="text-white">{nation.name}</span>
                            ) : (
                              <span className="text-white/40">Sélectionner une nationalité</span>
                            )}
                            <span className="text-white/40">▼</span>
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
                <h2 className="text-xl font-bold text-white">Poste</h2>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
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
                          ? "bg-[#FF9228] text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
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
                          ? "bg-[#FF9228] text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      3-5-2
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Poste principal *
                  </label>
                  <select
                    value={formData.mainPosition}
                    onChange={(e) => updateFormData("mainPosition", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                  >
                    <option value="" className="bg-[#1a1a1a]">Sélectionner</option>
                    {(formData.composition === "4-3-3" ? POSITIONS_433 : POSITIONS_352).map((pos) => (
                      <option key={pos.value} value={pos.value} className="bg-[#1a1a1a]">{pos.label}</option>
                    ))}
                  </select>
                </div>

                {!formData.secondaryPosition && formData.mainPosition && (
                  <button
                    type="button"
                    onClick={() => updateFormData("secondaryPosition", "_show")}
                    className="text-[#FF9228] hover:text-[#FF9228]/80 text-sm font-medium flex items-center gap-1"
                  >
                    <span className="text-lg">+</span> Ajouter un poste secondaire
                  </button>
                )}

                {(formData.secondaryPosition || formData.secondaryPosition === "_show") && formData.secondaryPosition !== "" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white/80">
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                    >
                      <option value="" className="bg-[#1a1a1a]">Sélectionner</option>
                      {(formData.composition === "4-3-3" ? POSITIONS_433 : POSITIONS_352)
                        .filter(pos => pos.value !== formData.mainPosition)
                        .map((pos) => (
                          <option key={pos.value} value={pos.value} className="bg-[#1a1a1a]">{pos.label}</option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Pitch Visualization */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-white/80 mb-3">
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
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "GB" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "GB" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "4%", left: "50%" }} title="Gardien de but" />
                          {/* Defense */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "AG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "18%", left: "15%" }} title="Arrière gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "DCG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "38%" }} title="Défenseur central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "DCD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "62%" }} title="Défenseur central droit" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "AD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "18%", left: "85%" }} title="Arrière droit" />
                          {/* Midfield */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "MD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "38%", left: "50%" }} title="Milieu défensif" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "MCG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "30%" }} title="Milieu central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "MCD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "70%" }} title="Milieu central droit" />
                          {/* Attack */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AIG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "AIG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "18%" }} title="Ailier gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AC" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "AC" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "78%", left: "50%" }} title="Avant-centre" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "AID" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "AID" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "82%" }} title="Ailier droit" />
                        </>
                      )}

                      {/* 3-5-2 Formation dots */}
                      {formData.composition === "3-5-2" && (
                        <>
                          {/* Goalkeeper */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "GB" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "GB" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "4%", left: "50%" }} title="Gardien de but" />
                          {/* Defense */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "DCG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "25%" }} title="Défenseur central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCA" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "DCA" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "12%", left: "50%" }} title="Défenseur central axe" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "DCD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "DCD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "15%", left: "75%" }} title="Défenseur central droit" />
                          {/* Midfield */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "PG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "PG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "40%", left: "10%" }} title="Piston gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "PD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "PD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "40%", left: "90%" }} title="Piston droit" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "MD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "32%", left: "50%" }} title="Milieu défensif" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "MCG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "35%" }} title="Milieu central gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "MCD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "MCD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "50%", left: "65%" }} title="Milieu central droit" />
                          {/* Attack */}
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "ATG" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "ATG" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "35%" }} title="Attaquant gauche" />
                          <div className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${formData.mainPosition === "ATD" ? "bg-[#FF9228] ring-2 ring-white scale-125" : formData.secondaryPosition === "ATD" ? "bg-[#FF9228]/60 ring-2 ring-white" : "bg-white/40"}`} style={{ bottom: "75%", left: "65%" }} title="Attaquant droit" />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-6 mt-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF9228]/100 ring-2 ring-white" />
                      <span>Principal</span>
                    </div>
                    {formData.secondaryPosition && formData.secondaryPosition !== "_show" && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF9228]/60 ring-2 ring-white" />
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
                <h2 className="text-xl font-bold text-white">Profil sportif</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateFormData("birthDate", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Pied fort *
                    </label>
                    <select
                      value={formData.preferredFoot}
                      onChange={(e) => updateFormData("preferredFoot", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                    >
                      <option value="" className="bg-[#1a1a1a]">Sélectionner</option>
                      <option value="Droit" className="bg-[#1a1a1a]">Droit</option>
                      <option value="Gauche" className="bg-[#1a1a1a]">Gauche</option>
                      <option value="Ambidextre" className="bg-[#1a1a1a]">Ambidextre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Taille (cm) *
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => updateFormData("height", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                      placeholder="180"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      VMA (km/h)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vma}
                      onChange={(e) => updateFormData("vma", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                      placeholder="18.5"
                    />
                  </div>
                </div>

                {/* Envergure - only for goalkeepers */}
                {(formData.mainPosition === "GB" || formData.secondaryPosition === "GB") && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Envergure (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.envergure}
                      onChange={(e) => updateFormData("envergure", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                      placeholder="193"
                    />
                  </div>
                )}

                {/* International */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white/80">
                      International ?
                    </label>
                    {formData.internationals.length < 2 && formData.internationals[0] !== "" && (
                      <button
                        type="button"
                        onClick={() => {
                          updateFormData("internationals", [...formData.internationals, ""]);
                        }}
                        className="text-[#FF9228] hover:text-[#FF9228] text-sm font-medium flex items-center gap-1"
                      >
                        <span className="text-lg">+</span> Ajouter
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {formData.internationals.map((intlCode, index) => {
                      const nation = NATIONALITIES.find(n => n.code === intlCode);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingInternationalIndex(index);
                              setIsInternationalModalOpen(true);
                            }}
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-left flex items-center justify-between hover:border-[#FF9228]/50 transition-colors"
                          >
                            {nation ? (
                              <span className="text-white">{nation.name}</span>
                            ) : (
                              <span className="text-white/40">Sélectionner une équipe nationale</span>
                            )}
                            <span className="text-white/40">▼</span>
                          </button>
                          {(formData.internationals.length > 1 || intlCode !== "") && (
                            <button
                              type="button"
                              onClick={() => {
                                if (formData.internationals.length > 1) {
                                  const newInternationalsRemove = formData.internationals.filter((_, i) => i !== index);
                                  updateFormData("internationals", newInternationalsRemove);
                                } else {
                                  updateFormData("internationals", [""]);
                                }
                              }}
                              className="p-3 text-white/40 hover:text-red-400 transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Lien à partager
                  </label>
                  <input
                    type="url"
                    value={formData.shareLink}
                    onChange={(e) => updateFormData("shareLink", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                    placeholder="Vidéo, portfolio..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white/80">
                      Qualités
                    </label>
                    {formData.qualities.length < 6 && (
                      <button
                        type="button"
                        onClick={addQuality}
                        className="text-[#FF9228] hover:text-[#FF9228] text-sm font-medium flex items-center gap-1"
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
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
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

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-white/50 mb-3">Agent sportif (optionnel)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Email agent
                        </label>
                        <input
                          type="email"
                          value={formData.agentEmail}
                          onChange={(e) => updateFormData("agentEmail", e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
                          placeholder="agent@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Téléphone agent
                        </label>
                        <input
                          type="tel"
                          value={formData.agentPhone}
                          onChange={(e) => updateFormData("agentPhone", e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent"
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
                  <h2 className="text-xl font-bold text-white">Carrière</h2>
                  {formData.seasons.length < 5 && (
                    <button
                      type="button"
                      onClick={addSeason}
                      className="px-4 py-2 bg-[#FF9228]/20 text-[#FF9228] rounded-lg text-sm font-medium hover:bg-[#FF9228]/30 transition-colors"
                    >
                      + Ajouter une saison
                    </button>
                  )}
                </div>
                <p className="text-sm text-white/60">Maximum 5 saisons</p>

                {formData.seasons.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <p>Aucune saison ajoutée</p>
                    <button
                      type="button"
                      onClick={addSeason}
                      className="mt-2 text-[#FF9228] hover:underline"
                    >
                      Ajouter votre première saison
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.seasons.map((season, index) => (
                      <div key={index} className={`border rounded-lg p-4 ${season.isCurrent ? 'border-[#FF9228] bg-[#FF9228]/10' : 'border-white/10'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-white/80">Saison {index + 1}</span>
                            {season.isCurrent && (
                              <span className="text-xs bg-[#FF9228] text-white px-2 py-0.5 rounded-full">En cours</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSeason(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Supprimer
                          </button>
                        </div>

                        {/* Current season checkbox */}
                        <div className="mb-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={season.isCurrent}
                              onChange={() => setCurrentSeason(index)}
                              className="w-4 h-4 text-[#FF9228] rounded focus:ring-[#FF9228]/50"
                            />
                            <span className="text-sm text-white/80">Saison actuelle</span>
                          </label>
                        </div>

                        {/* Half-season toggle */}
                        <div className="mb-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={season.isSplit}
                              onChange={(e) => updateSeason(index, "isSplit", e.target.checked)}
                              className="w-4 h-4 text-[#FF9228] rounded focus:ring-[#FF9228]/50"
                            />
                            <span className="text-sm text-white/80">Demi-saison</span>
                          </label>
                        </div>

                        {/* Year field - always visible at top */}
                        <div className="mb-3">
                          <input
                            type="text"
                            value={season.year}
                            onChange={(e) => updateSeason(index, "year", e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                            placeholder="Saison (ex: 2024/2025)"
                          />
                        </div>

                        {!season.isSplit ? (
                          /* Full season fields */
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={season.club}
                              onChange={(e) => updateSeason(index, "club", e.target.value)}
                              className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                              placeholder="Club"
                            />
                            <input
                              type="text"
                              value={season.division}
                              onChange={(e) => updateSeason(index, "division", e.target.value)}
                              className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                              placeholder="Division (ex: N2)"
                            />
                            <input
                              type="text"
                              value={season.category}
                              onChange={(e) => updateSeason(index, "category", e.target.value)}
                              className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                              placeholder="Catégorie (ex: U19)"
                            />
                            <div className="relative">
                              <input
                                type="number"
                                value={season.matches}
                                onChange={(e) => updateSeason(index, "matches", e.target.value)}
                                className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-sm text-white placeholder-white/40 ${!season.isCurrent && !season.matches ? 'border-red-300' : 'border-white/20'}`}
                                placeholder="Matchs"
                                required={!season.isCurrent}
                              />
                              {!season.isCurrent && <span className="absolute top-2 right-2 text-red-500 text-xs">*</span>}
                            </div>
                            {formData.mainPosition === "GB" ? (
                              /* Goalkeeper stats */
                              <input
                                type="number"
                                value={season.cleanSheets}
                                onChange={(e) => updateSeason(index, "cleanSheets", e.target.value)}
                                className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                placeholder="Clean sheets"
                              />
                            ) : (
                              /* Field player stats */
                              <>
                                <input
                                  type="number"
                                  value={season.goals}
                                  onChange={(e) => updateSeason(index, "goals", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Buts"
                                />
                                <input
                                  type="number"
                                  value={season.assists}
                                  onChange={(e) => updateSeason(index, "assists", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Passes D."
                                />
                                <input
                                  type="number"
                                  value={season.avgPlayingTime}
                                  onChange={(e) => updateSeason(index, "avgPlayingTime", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Temps de jeu moyen (min)"
                                />
                              </>
                            )}
                            {/* Comments section */}
                            <div className="col-span-2 space-y-2">
                              {season.comments.map((comment, commentIndex) => (
                                <div key={commentIndex} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => updateSeasonComment(index, commentIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                    placeholder="Commentaire (ex: Champion, Coupe...)"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeSeasonComment(index, commentIndex)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              {season.comments.length < 3 && (
                                <button
                                  type="button"
                                  onClick={() => addSeasonComment(index)}
                                  className="text-[#FF9228] hover:text-[#FF9228]/80 text-sm font-medium flex items-center gap-1"
                                >
                                  <span className="text-lg">+</span> Ajouter un commentaire
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Split season - tabs */
                          <div>
                            {/* Tabs */}
                            <div className="flex gap-2 mb-3">
                              <button
                                type="button"
                                onClick={() => setActiveHalfTab({ ...activeHalfTab, [index]: "first" })}
                                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                                  (activeHalfTab[index] || "first") === "first"
                                    ? "bg-[#FF9228] text-white"
                                    : "bg-white/10 text-white/80 hover:bg-white/10"
                                }`}
                              >
                                1ère moitié
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveHalfTab({ ...activeHalfTab, [index]: "second" })}
                                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                                  (activeHalfTab[index] || "first") === "second"
                                    ? "bg-[#FF9228] text-white"
                                    : "bg-white/10 text-white/80 hover:bg-white/10"
                                }`}
                              >
                                2ème moitié
                              </button>
                            </div>

                            {/* Tab content */}
                            {(activeHalfTab[index] || "first") === "first" ? (
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={season.firstHalf.club}
                                  onChange={(e) => updateSeasonHalf(index, "firstHalf", "club", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Club"
                                />
                                <input
                                  type="text"
                                  value={season.firstHalf.division}
                                  onChange={(e) => updateSeasonHalf(index, "firstHalf", "division", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Division (ex: N2)"
                                />
                                <input
                                  type="text"
                                  value={season.firstHalf.category}
                                  onChange={(e) => updateSeasonHalf(index, "firstHalf", "category", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Catégorie"
                                />
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={season.firstHalf.matches}
                                    onChange={(e) => updateSeasonHalf(index, "firstHalf", "matches", e.target.value)}
                                    className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-sm text-white placeholder-white/40 ${!season.isCurrent && !season.firstHalf.matches ? 'border-red-300' : 'border-white/20'}`}
                                    placeholder="Matchs"
                                    required={!season.isCurrent}
                                  />
                                  {!season.isCurrent && <span className="absolute top-2 right-2 text-red-500 text-xs">*</span>}
                                </div>
                                {formData.mainPosition === "GB" ? (
                                  <input
                                    type="number"
                                    value={season.firstHalf.cleanSheets}
                                    onChange={(e) => updateSeasonHalf(index, "firstHalf", "cleanSheets", e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                    placeholder="Clean sheets"
                                  />
                                ) : (
                                  <>
                                    <input
                                      type="number"
                                      value={season.firstHalf.goals}
                                      onChange={(e) => updateSeasonHalf(index, "firstHalf", "goals", e.target.value)}
                                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                      placeholder="Buts"
                                    />
                                    <input
                                      type="number"
                                      value={season.firstHalf.assists}
                                      onChange={(e) => updateSeasonHalf(index, "firstHalf", "assists", e.target.value)}
                                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                      placeholder="Passes D."
                                    />
                                    <input
                                      type="number"
                                      value={season.firstHalf.avgPlayingTime}
                                      onChange={(e) => updateSeasonHalf(index, "firstHalf", "avgPlayingTime", e.target.value)}
                                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                      placeholder="Temps de jeu moyen (min)"
                                    />
                                  </>
                                )}
                                {/* Comments section for firstHalf */}
                                <div className="col-span-2 space-y-2">
                                  {season.firstHalf.comments.map((comment, commentIndex) => (
                                    <div key={commentIndex} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => updateHalfSeasonComment(index, "firstHalf", commentIndex, e.target.value)}
                                        className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                        placeholder="Commentaire (ex: Champion, Coupe...)"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeHalfSeasonComment(index, "firstHalf", commentIndex)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  {season.firstHalf.comments.length < 3 && (
                                    <button
                                      type="button"
                                      onClick={() => addHalfSeasonComment(index, "firstHalf")}
                                      className="text-[#FF9228] hover:text-[#FF9228]/80 text-sm font-medium flex items-center gap-1"
                                    >
                                      <span className="text-lg">+</span> Ajouter un commentaire
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={season.secondHalf.club}
                                  onChange={(e) => updateSeasonHalf(index, "secondHalf", "club", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Club"
                                />
                                <input
                                  type="text"
                                  value={season.secondHalf.division}
                                  onChange={(e) => updateSeasonHalf(index, "secondHalf", "division", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Division (ex: N2)"
                                />
                                <input
                                  type="text"
                                  value={season.secondHalf.category}
                                  onChange={(e) => updateSeasonHalf(index, "secondHalf", "category", e.target.value)}
                                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                  placeholder="Catégorie"
                                />
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={season.secondHalf.matches}
                                    onChange={(e) => updateSeasonHalf(index, "secondHalf", "matches", e.target.value)}
                                    className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-sm text-white placeholder-white/40 ${!season.isCurrent && !season.secondHalf.matches ? 'border-red-300' : 'border-white/20'}`}
                                    placeholder="Matchs"
                                    required={!season.isCurrent}
                                  />
                                  {!season.isCurrent && <span className="absolute top-2 right-2 text-red-500 text-xs">*</span>}
                                </div>
                                {formData.mainPosition === "GB" ? (
                                  <input
                                    type="number"
                                    value={season.secondHalf.cleanSheets}
                                    onChange={(e) => updateSeasonHalf(index, "secondHalf", "cleanSheets", e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                    placeholder="Clean sheets"
                                  />
                                ) : (
                                  <>
                                    <input
                                      type="number"
                                      value={season.secondHalf.goals}
                                      onChange={(e) => updateSeasonHalf(index, "secondHalf", "goals", e.target.value)}
                                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                      placeholder="Buts"
                                    />
                                    <input
                                      type="number"
                                      value={season.secondHalf.assists}
                                      onChange={(e) => updateSeasonHalf(index, "secondHalf", "assists", e.target.value)}
                                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                      placeholder="Passes D."
                                    />
                                    <input
                                      type="number"
                                      value={season.secondHalf.avgPlayingTime}
                                      onChange={(e) => updateSeasonHalf(index, "secondHalf", "avgPlayingTime", e.target.value)}
                                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                      placeholder="Temps de jeu moyen (min)"
                                    />
                                  </>
                                )}
                                {/* Comments section for secondHalf */}
                                <div className="col-span-2 space-y-2">
                                  {season.secondHalf.comments.map((comment, commentIndex) => (
                                    <div key={commentIndex} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => updateHalfSeasonComment(index, "secondHalf", commentIndex, e.target.value)}
                                        className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                        placeholder="Commentaire (ex: Champion, Coupe...)"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeHalfSeasonComment(index, "secondHalf", commentIndex)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  {season.secondHalf.comments.length < 3 && (
                                    <button
                                      type="button"
                                      onClick={() => addHalfSeasonComment(index, "secondHalf")}
                                      className="text-[#FF9228] hover:text-[#FF9228]/80 text-sm font-medium flex items-center gap-1"
                                    >
                                      <span className="text-lg">+</span> Ajouter un commentaire
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
                    <h2 className="text-xl font-bold text-white">Formations</h2>
                    <button
                      type="button"
                      onClick={addFormation}
                      className="px-4 py-2 bg-[#FF9228]/20 text-[#FF9228] rounded-lg text-sm font-medium hover:bg-[#FF9228]/30 transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>

                  {formData.formations.length === 0 ? (
                    <p className="text-white/50 text-sm">Aucune formation ajoutée</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.formations.map((formation, index) => (
                        <div key={index} className="border border-white/10 rounded-lg p-3">
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
                              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                              placeholder="Année ou période"
                            />
                            <div>
                              <input
                                type="text"
                                maxLength={1000}
                                value={formation.title}
                                onChange={(e) => updateFormation(index, "title", e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                                placeholder="Titre / Structure"
                              />
                            </div>
                            <div>
                              <textarea
                                maxLength={1000}
                                value={formation.details}
                                onChange={(e) => updateFormation(index, "details", e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 resize-none"
                                placeholder="Détails (optionnel)"
                                rows={2}
                              />
                              <p className="text-white/40 text-xs mt-1 text-right">{formation.details?.length || 0}/1000</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trials */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Essais / Marques d&apos;intérêt</h2>
                    <button
                      type="button"
                      onClick={addTrial}
                      className="px-4 py-2 bg-[#FF9228]/20 text-[#FF9228] rounded-lg text-sm font-medium hover:bg-[#FF9228]/30 transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>

                  {formData.trials.length === 0 ? (
                    <p className="text-white/50 text-sm">Aucun essai ajouté</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.trials.map((trial, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={200}
                            value={trial.club}
                            onChange={(e) => updateTrial(index, "club", e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
                            placeholder="Club"
                          />
                          <input
                            type="text"
                            maxLength={4}
                            value={trial.year}
                            onChange={(e) => updateTrial(index, "year", e.target.value)}
                            className="w-24 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-white/40"
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

            {/* Step 6: Finalisation */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Finalisation</h2>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
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
                            ? "border-white scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Large CV Preview */}
                <div className="flex justify-center">
                  <img 
                    src={`/Colored CV/${formData.composition === "4-3-3" ? "433" : "352"}/${formData.composition === "4-3-3" ? "433" : "352"} ${CV_COLORS.find(c => c.value === formData.cvColor)?.file || "bleu"}.png`}
                    alt="CV Preview" 
                    className="w-48 sm:w-64 rounded-lg shadow-xl border-2 border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Notes, commentaires
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#FF9228]/50 focus:border-transparent resize-none"
                    placeholder="Informations complémentaires, situation particulière, objectifs..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  currentStep === 1
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                Précédent
              </button>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#FF9228] text-white rounded-full font-medium hover:bg-[#FF9228]/90 transition-all"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#FF9228] text-white rounded-full font-medium hover:bg-[#FF9228]/90 transition-all"
                  onClick={submitForm}
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Sélectionner une nationalité</h3>
              <button
                onClick={() => setIsNationalityModalOpen(false)}
                className="text-white/50 hover:text-white/80 text-2xl"
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
                      ? "bg-[#FF9228]/20 text-[#FF9228]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="font-medium">{nation.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* International Modal */}
      {isInternationalModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Sélectionner une équipe nationale</h3>
              <button
                onClick={() => setIsInternationalModalOpen(false)}
                className="text-white/50 hover:text-white/80 text-2xl"
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
                    const newInternationalsArr = [...formData.internationals];
                    newInternationalsArr[editingInternationalIndex] = nation.code;
                    updateFormData("internationals", newInternationalsArr);
                    setIsInternationalModalOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    formData.internationals[editingInternationalIndex] === nation.code
                      ? "bg-[#FF9228]/20 text-[#FF9228]"
                      : "text-white hover:bg-white/10"
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
