"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "flag-icons/css/flag-icons.min.css";
import { Mail, Phone, Calendar, Footprints, Ruler, Weight, Zap, Link, ExternalLink, Play } from "lucide-react";

/* ============================================================================
CV TEMPLATE PAGE - Used by Puppeteer to generate PDF
This page renders the CV with a full background image from /colored CV/
============================================================================ */

// Type definitions for API response
interface ClubSeason {
  id: number;
  season_id: number;
  name: string;
  category: string;
  matchs: number;
  goals: number;
  assists: number;
  division: string;
  logo_club: string;
  logo_division: string;
  average_playing_time: number;
  half_number: number | null;
}

interface Season {
  id: number;
  resume_id: number;
  duration: string;
  current_season: boolean;
  is_split: boolean;
  clubSeasons: ClubSeason[];
}

interface Formation {
  id: number;
  resume_id: number;
  duration: string;
  title: string;
  details: string;
}

interface Essai {
  id: number;
  resume_id: number;
  club: string;
  year: string;
}

interface PlayerData {
  id: number;
  firstname: string;
  lastname: string;
  nationality1: string | null;
  nationality2: string | null;
  nationality3: string | null;
  player_image: string | null;
  date_of_birth: string | null;
  preferred_foot: string | null;
  height: number | null;
  weight: number | null;
  primary_position: string | null;
  secondary_position: string | null;
  vma: number | null;
  transfermark_url: string | null;
  qualities: string | null;
  email: string | null;
  phone: string | null;
  email_agent: string | null;
  phone_agent: string | null;
}

interface ResumeAPIResponse {
  resumeId: number;
  cv_color: string | null;
  composition_to_display: string | null;
  comments: string | null;
  isTreated: boolean;
  createdAt: string;
  updatedAt: string;
  playerData: PlayerData;
  seasons: Season[];
  formations: Formation[];
  essais: Essai[];
}

// Type for internal CV data structure
interface CVData {
  firstName: string;
  lastName: string;
  photoUrl: string;
  nationalities: string[];
  internationals: string[]; // Not in DB yet - will show MISSING
  birthDate: string;
  preferredFoot: string;
  height: string;
  weight: string;
  vma: string;
  composition: "4-3-3" | "3-5-2";
  mainPosition: string;
  secondaryPosition: string;
  qualities: string[];
  email: string;
  phone: string;
  managerEmail: string;
  managerPhone: string;
  cvColor: string;
  links: string[]; // Not fully in DB yet - will show MISSING
  seasons: {
    year: string;
    club: string;
    clubLogo: string;
    division: string;
    divisionLogo: string;
    category: string;
    isCurrent: boolean;
    matches: string;
    goals: string;
    assists: string;
    avgPlayingTime: string;
    comments: { text: string; badges: string[] }[]; // Not in DB yet - will show MISSING
  }[];
  formations: { year: string; title: string; details: string }[];
  essais: { year: string; club: string; details: string }[];
}

// Color mapping to file names
const CV_COLORS: Record<string, string> = {
"#1E5EFF": "bleu",
"#C46A4A": "orange",
"#5B6B3A": "vert",
"#0F2A43": "bleu fonce",
"#D6C6A8": "beige",
"#7A1E3A": "rouge",
};

// Position coordinates on the football field (absolute pixels from CV top-left)
// CV is 794x1123px, field is on the right side
const POSITION_COORDS_433: Record<string, { top: number; left: number }> = {
// Goalkeeper (1)
"GB": { top: 210, left: 678 },
// Defenders (4)
"AG": { top: 160, left: 610 },
"DCG": { top: 178, left: 650 },
"DCD": { top: 178, left: 708 },
"AD": { top: 160, left: 745 },
// Midfielders (3)
"MD": { top: 112, left: 640 },
"MCG": { top: 140, left: 678 },
"MCD": { top: 112, left: 718 },
// Forwards (3)
"AIG": { top: 76, left: 620 },
"AC": { top: 48, left: 680 },
"AID": { top: 76, left: 735 },
};

const POSITION_COORDS_352: Record<string, { top: number; left: number }> = {
// Goalkeeper (1)
"GB": { top: 210, left: 678 },
// Defenders (3)
"DCG": { top: 178, left: 632 },
"DCA": { top: 176, left: 678 },
"DCD": { top: 178, left: 722 },
// Midfielders (5)
"PG": { top: 137, left: 613 },
"MCG": { top: 126, left: 660 },
"MD": { top: 95, left: 680 },
"MCD": { top: 126, left: 703 },
"PD": { top: 137, left: 745 },
// Forwards (2)
"ATG": { top: 65, left: 650 },
"ATD": { top: 65, left: 708 },
};

// Country code to nationality adjective mapping (French, masculine)
const NATIONALITIES: Record<string, string> = {
"DZ": "algérien",
"DE": "allemand",
"GB-ENG": "anglais",
"AO": "angolais",
"AR": "argentin",
"AM": "arménien",
"BE": "belge",
"BJ": "béninois",
"BR": "brésilien",
"BF": "burkinabè",
"BI": "burundais",
"CM": "camerounais",
"CV": "cap-verdien",
"CF": "centrafricain",
"CL": "chilien",
"CO": "colombien",
"KM": "comorien",
"CG": "congolais",
"KR": "sud-coréen",
"CI": "ivoirien",
"HR": "croate",
"DK": "danois",
"EG": "égyptien",
"GB-SCT": "écossais",
"ES": "espagnol",
"US": "américain",
"FR": "français",
"GA": "gabonais",
"GH": "ghanéen",
"GR": "grec",
"GN": "guinéen",
"GQ": "équato-guinéen",
"GW": "bissau-guinéen",
"HT": "haïtien",
"NL": "néerlandais",
"HU": "hongrois",
"GB-NIR": "nord-irlandais",
"IE": "irlandais",
"IT": "italien",
"JP": "japonais",
"LB": "libanais",
"LR": "libérien",
"LU": "luxembourgeois",
"MK": "macédonien",
"MG": "malgache",
"ML": "malien",
"MA": "marocain",
"MR": "mauritanien",
"MX": "mexicain",
"ME": "monténégrin",
"NG": "nigérian",
"NO": "norvégien",
"NZ": "néo-zélandais",
"UG": "ougandais",
"GB-WLS": "gallois",
"PL": "polonais",
"PT": "portugais",
"CD": "congolais (RDC)",
"RO": "roumain",
"RU": "russe",
"RW": "rwandais",
"SN": "sénégalais",
"RS": "serbe",
"SL": "sierra-léonais",
"SK": "slovaque",
"SI": "slovène",
"SD": "soudanais",
"SE": "suédois",
"CH": "suisse",
"TD": "tchadien",
"CZ": "tchèque",
"TG": "togolais",
"TN": "tunisien",
"TR": "turc",
"UA": "ukrainien",
"UY": "uruguayen",
"VE": "vénézuélien",
"ZM": "zambien",
"ZW": "zimbabwéen",
};

// Position display names (human-readable) - must match form labels
const POSITION_NAMES: Record<string, string> = {
// Goalkeeper
"GB": "GARDIEN DE BUT",
// Defenders
"AG": "ARRIÈRE GAUCHE",
"DCG": "DÉFENSEUR CENTRAL GAUCHE",
"DCA": "DÉFENSEUR CENTRAL AXE",
"DCD": "DÉFENSEUR CENTRAL DROIT",
"AD": "ARRIÈRE DROIT",
// Midfielders
"PG": "PISTON GAUCHE",
"PD": "PISTON DROIT",
"MD": "MILIEU DÉFENSIF",
"MCG": "MILIEU CENTRAL GAUCHE",
"MCD": "MILIEU CENTRAL DROIT",
// Forwards
"AIG": "AILIER GAUCHE",
"AC": "AVANT-CENTRE",
"AID": "AILIER DROIT",
"ATG": "ATTAQUANT GAUCHE",
"ATD": "ATTAQUANT DROIT",
};

// Helper function to transform API response to CV data format
function transformAPIResponse(apiData: ResumeAPIResponse): CVData {
  const { playerData, seasons, formations, essais, cv_color, composition_to_display } = apiData;
  
  // Build nationalities array from nationality1, 2, 3
  const nationalities: string[] = [];
  if (playerData.nationality1) nationalities.push(playerData.nationality1);
  if (playerData.nationality2) nationalities.push(playerData.nationality2);
  if (playerData.nationality3) nationalities.push(playerData.nationality3);
  
  // Parse qualities (stored as JSON string or comma-separated in DB)
  let qualitiesArray: string[] = [];
  if (playerData.qualities) {
    try {
      // Try parsing as JSON array first
      qualitiesArray = JSON.parse(playerData.qualities);
    } catch {
      // If not JSON, split by comma
      qualitiesArray = playerData.qualities.split(',').map(q => q.trim()).filter(q => q);
    }
  }
  
  // Transform seasons - handle split seasons
  const transformedSeasons = seasons.flatMap((season) => {
    if (season.is_split && season.clubSeasons.length >= 2) {
      // Split season: create two entries
      return season.clubSeasons.map((cs, idx) => ({
        year: season.duration, // e.g., "2024-2025"
        club: cs.name || "MISSING",
        clubLogo: cs.logo_club || "",
        division: cs.division || "MISSING",
        divisionLogo: cs.logo_division || "",
        category: cs.category || "MISSING",
        isCurrent: season.current_season && idx === 0,
        matches: String(cs.matchs || 0),
        goals: String(cs.goals || 0),
        assists: String(cs.assists || 0),
        avgPlayingTime: String(cs.average_playing_time || 0),
        comments: [], // Not in DB yet - empty for now
      }));
    } else {
      // Full season: single entry
      const cs = season.clubSeasons[0];
      return [{
        year: season.duration,
        club: cs?.name || "MISSING",
        clubLogo: cs?.logo_club || "",
        division: cs?.division || "MISSING",
        divisionLogo: cs?.logo_division || "",
        category: cs?.category || "MISSING",
        isCurrent: season.current_season,
        matches: String(cs?.matchs || 0),
        goals: String(cs?.goals || 0),
        assists: String(cs?.assists || 0),
        avgPlayingTime: String(cs?.average_playing_time || 0),
        comments: [], // Not in DB yet - empty for now
      }];
    }
  });
  
  // Transform formations
  const transformedFormations = formations.map(f => ({
    year: f.duration || "MISSING",
    title: f.title || "MISSING",
    details: f.details || "",
  }));
  
  // Transform essais
  const transformedEssais = essais.map(e => ({
    year: e.year || "MISSING",
    club: e.club || "MISSING",
    details: "", // Not in DB
  }));
  
  return {
    firstName: playerData.firstname || "MISSING",
    lastName: playerData.lastname || "MISSING",
    photoUrl: playerData.player_image || "",
    nationalities: nationalities.length > 0 ? nationalities : [],
    internationals: [], // Not in DB yet - empty for now
    birthDate: playerData.date_of_birth || "",
    preferredFoot: playerData.preferred_foot || "MISSING",
    height: playerData.height ? String(playerData.height) : "MISSING",
    weight: playerData.weight ? String(playerData.weight) : "MISSING",
    vma: playerData.vma ? String(playerData.vma) : "",
    composition: (composition_to_display === "3-5-2" ? "3-5-2" : "4-3-3") as "4-3-3" | "3-5-2",
    mainPosition: playerData.primary_position || "AC",
    secondaryPosition: playerData.secondary_position || "",
    qualities: qualitiesArray.length > 0 ? qualitiesArray : ["MISSING"],
    email: playerData.email || "",
    phone: playerData.phone || "",
    managerEmail: playerData.email_agent || "",
    managerPhone: playerData.phone_agent || "",
    cvColor: cv_color || "#1E5EFF",
    links: [], // Not fully in DB yet - empty for now
    seasons: transformedSeasons,
    formations: transformedFormations,
    essais: transformedEssais,
  };
}

export default function CVTemplatePage() {
  const params = useParams();
  const resumeId = params.id as string;
  
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumeData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/resumes/${resumeId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.status}`);
        }
        
        const apiData: ResumeAPIResponse = await response.json();
        const transformedData = transformAPIResponse(apiData);
        setData(transformedData);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    
    if (resumeId) {
      fetchResumeData();
    }
  }, [resumeId]);

  // Loading state
  if (loading) {
    return (
      <div id="cv-container" style={{ width: "794px", height: "1123px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", color: "white" }}>
        <p>Chargement du CV...</p>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div id="cv-container" style={{ width: "794px", height: "1123px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", color: "white" }}>
        <p>Erreur: {error || "Données non disponibles"}</p>
      </div>
    );
  }

  // Determine the background image based on color + composition
  const colorFile = CV_COLORS[data.cvColor] || "bleu";
  const formationFolder = data.composition === "4-3-3" ? "433" : "352";
  const backgroundImage = `/colored CV/${formationFolder}/${formationFolder} ${colorFile}.png`;

  return (
    <div 
      id="cv-container"
      style={{
		width: "794px",  // A4 width at 96dpi
		height: "1123px", // A4 height at 96dpi
		position: "relative",
		overflow: "hidden",
	}}
	>
	{/* FULL BACKGROUND IMAGE */}
	<img
		src={backgroundImage}
		alt="CV Background"
		style={{
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		objectFit: "cover",
		zIndex: 0,
		}}
	/>

	{/* BLACK BAR - Covers the left sidebar to hide static PROFIL/QUALITÉS/CONTACT */}
	<div
		style={{
		position: "absolute",
		top: "115px",
		left: "55px",
		width: "270px", 
		height: "950px", 
		backgroundColor: "#000000",
		zIndex: 1,
		}}
	/>

	{/* CONTENT OVERLAY - All dynamic content goes here */}
	<div
		style={{
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		zIndex: 2,
		}}
	>
		{/* ============== NATIONALITY FLAGS ============== */}
		<div
		style={{
			position: "absolute",
			top: "65px",
			left: "15px",
			display: "flex",
			flexDirection: "column",
			gap: "5px",
		}}
		>
		{data.nationalities.map((nat, i) => (
			<span
			key={i}
			className={`fi fi-${nat.toLowerCase()}`}
			style={{
				width: "60px",
				height: "45px",
				border: "3px solid white",
				borderRadius: "2px",
				backgroundSize: "cover",
			}}
			/>
		))}
		</div>

		{/* ============== PLAYER NAME ============== */}
		{(() => {
		const fullName = `${data.firstName} ${data.lastName}`;
		const firstLineLength = data.firstName.length;
		
		// Determine if we need two lines (first line max 16 chars)
		const needsTwoLines = firstLineLength > 16;
		const isVeryLong = fullName.length > 28;
		
		// Base font size, reduced if very long
		let fontSize = 38;
		if (isVeryLong) fontSize = 30;
		else if (needsTwoLines) fontSize = 34;
		
		// Top position: 45 if two lines, 60 if one line
		const topPosition = needsTwoLines ? 45 : 60;
		
		return (
			<div
			style={{
				position: "absolute",
				top: `${topPosition}px`,
				left: "100px",
				color: "white",
				fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
				fontSize: `${fontSize}px`,
				fontWeight: "900",
				textTransform: "uppercase",
				letterSpacing: "2px",
				textShadow: "0px 4px 1px rgba(30, 30, 30, 1)",
				lineHeight: "1.1",
			}}
			>
			{needsTwoLines ? (
				<>
				<div>{data.firstName}</div>
				<div>{data.lastName}</div>
				</>
			) : (
				fullName
			)}
			</div>
		);
		})()}

		{/* ============== PLAYER PHOTO ============== */}
		<div
		style={{
			position: "absolute",
			top: "130px",
			left: "100px",
			width: "180px",
			height: "220px",
			backgroundColor: "#333",
			border: "4px solid white",
			overflow: "hidden",
		}}
		>
		<img
			src={data.photoUrl}
			alt={`${data.firstName} ${data.lastName}`}
			style={{
			width: "100%",
			height: "100%",
			objectFit: "cover",
			}}
		/>
		</div>

		{/* ============== POSITION LABELS ============== */}
		<div
		style={{
			position: "absolute",
			top: "130px",
			left: "300px",
			display: "flex",
			flexDirection: "column",
			gap: "5px",
		}}
		>
		{(() => {
			const mainName = POSITION_NAMES[data.mainPosition] || data.mainPosition;
			const secondaryName = POSITION_NAMES[data.secondaryPosition] || data.secondaryPosition;
			
			// Calculate font size: 22px for ≤16 chars, shrink for longer
			const getSize = (text: string) => {
			if (text.length <= 16) return 22;
			if (text.length <= 20) return 18;
			if (text.length <= 24) return 15;
			return 13;
			};
			
			return (
			<>
				<div
				style={{
					color: "white",
					fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
					fontSize: `${getSize(mainName)}px`,
					fontWeight: "900",
					textTransform: "uppercase",
					letterSpacing: "1px",
				}}
				>
				{mainName}
				</div>
				<div
				style={{
					color: "white",
					fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
					fontSize: `${getSize(secondaryName)}px`,
					fontWeight: "900",
					textTransform: "uppercase",
					letterSpacing: "1px",
				}}
				>
				{secondaryName}
				</div>
			</>
			);
		})()}
		</div>

		{/* ============== FOOTBALL FIELD POSITIONS ============== */}
		{(() => {
		const positionCoords = data.composition === "4-3-3" ? POSITION_COORDS_433 : POSITION_COORDS_352;
		const mainPos = positionCoords[data.mainPosition];
		const secondaryPos = positionCoords[data.secondaryPosition];
		
		return (
			<>
			{/* Main Position - Yellow dot */}
			{mainPos && (
				<div
				style={{
					position: "absolute",
					top: `${mainPos.top}px`,
					left: `${mainPos.left}px`,
					width: "24px",
					height: "24px",
					backgroundColor: "#FFD700",
					borderRadius: "50%",
					border: "3px solid #FFF",
					transform: "translate(-50%, -50%)",
					boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
				}}
				/>
			)}
			
			{/* Secondary Position - Yellow dot (slightly smaller) */}
			{secondaryPos && (
				<div
				style={{
					position: "absolute",
					top: `${secondaryPos.top}px`,
					left: `${secondaryPos.left}px`,
					width: "20px",
					height: "20px",
					backgroundColor: "#FFD700",
					borderRadius: "50%",
					border: "2px solid #FFF",
					transform: "translate(-50%, -50%)",
					boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
					opacity: 0.85,
				}}
				/>
			)}
			</>
		);
		})()}

		{/* ============== SIDEBAR SECTIONS (PROFIL, QUALITÉS, CONTACT) ============== */}
		<div
		style={{
			position: "absolute",
			top: "365px",
			left: "70px",
			display: "flex",
			flexDirection: "column",
			gap: "10px",
			width: "250px",
		}}
		>
		<div>
			<img src="/profil.png" alt="Profil" style={{ width: "220px" }} />
			
			{/* International selections - Text and Flag as separate elements */}
			{data.internationals.filter(i => i !== "").map((intCode, idx) => (
			<div key={idx} style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
				{/* International text */}
				<span
				style={{
					color: "black",
					fontWeight: "bold",
					fontSize: "13px",
					backgroundColor: "#ffffff",
					marginLeft: "-70px",
					paddingLeft: "70px",
					paddingTop: "1px",
					paddingBottom: "1px",
					flex: 1,
				}}
				>
				International {NATIONALITIES[intCode] || intCode}
				</span>
				
				{/* International flag */}
				<span
				className={`fi fi-${intCode.toLowerCase()}`}
				style={{
					fontSize: "30px",
					outline: "3px solid white",
				}}
				/>
			</div>
			))}
			
			{/* Profile stats */}
			<div style={{ marginTop: "12px", color: "white", fontSize: "13px" }}>
				{/* Né le */}
				<div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
					<Calendar size={16} style={{ marginRight: "8px", color: "#1E5EFF" }} />
					<span><strong>Né le</strong> {new Date(data.birthDate).toLocaleDateString("fr-FR")}</span>
				</div>
				
				{/* Pied fort */}
				<div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
					<Footprints size={16} style={{ marginRight: "8px", color: "#1E5EFF" }} />
					<span><strong>Pied fort</strong> - {data.preferredFoot}</span>
				</div>
				
				{/* Taille */}
				<div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
					<Ruler size={16} style={{ marginRight: "8px", color: "#1E5EFF" }} />
					<span><strong>Taille</strong> - {data.height} cm</span>
				</div>
				
				{/* Poids */}
				<div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
					<Weight size={16} style={{ marginRight: "8px", color: "#1E5EFF" }} />
					<span><strong>Poids</strong> - {data.weight} kg</span>
				</div>
				
				{/* VMA */}
				{data.vma && (
				<div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
					<Zap size={16} style={{ marginRight: "8px", color: "#1E5EFF" }} />
					<span><strong>VMA</strong> - {data.vma} km/h</span>
				</div>
				)}
			</div>
			
			{/* Clickable links - auto-detects YouTube, Transfermarkt, or shows hostname */}
			<div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
				{data.links && data.links.filter(link => link !== "").map((link, idx) => {
					// Auto-detect link type
					const youtubeMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
					const isYoutube = !!youtubeMatch;
					const videoId = youtubeMatch ? youtubeMatch[1] : null;
					const youtubeThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
					
					const isTransfermarkt = link.includes("transfermarkt.");
					
					return (
						<a 
							key={idx}
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								textDecoration: "none",
								color: "white",
							}}
						>
							<Link size={18} style={{ marginRight: "2px", color: "#1E5EFF", flexShrink: 0 }} />
							
							{/* YouTube - show thumbnail */}
							{isYoutube && youtubeThumbnail && (
								<img 
									src={youtubeThumbnail} 
									alt="Video" 
									style={{ height: "50px", borderRadius: "4px", objectFit: "cover" }}
								/>
							)}
							
							{/* Transfermarkt - show logo */}
							{isTransfermarkt && (
								<img 
									src="/transfermarkt.png" 
									alt="Transfermarkt" 
									style={{ height: "30px", objectFit: "contain" }}
								/>
							)}
							
							{/* Other - show hostname */}
							{!isYoutube && !isTransfermarkt && (
								<span style={{ fontSize: "12px" }}>
									{new URL(link).hostname}
								</span>
							)}
							
							<ExternalLink size={18} style={{ marginLeft: "2px", color: "#1E5EFF", flexShrink: 0 }} />
						</a>
					);
				})}
			</div>
		</div>
		
		<div>
			<img src="/qualités.png" alt="Qualités" style={{ width: "220px" }} />
			<ul
			style={{
				margin: "8px 0 0 0",
				padding: "0 0 0 20px",
				color: "white",
				fontSize: "14px",
				lineHeight: "1.2",
				listStyleType: "disc",
			}}
			>
			{data.qualities.filter(q => q !== "").map((quality, i) => (
				<li key={i} style={{ marginBottom: "2px" }}>{quality}</li>
			))}
			</ul>
		</div>
		
		<div>
			<img src="/Contact.png" alt="Contact" style={{ width: "220px" }} />
			<ul
			style={{
				margin: "8px 0 0 0",
				padding: "0",
				color: "white",
				fontSize: "12px",
				lineHeight: "1.6",
				listStyleType: "none",
			}}
			>
			{data.email && (
				<li style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
				<Mail size={14} />
				<span>{data.email}</span>
				</li>
			)}
			{data.phone && (
				<li style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
				<Phone size={14} />
				<span>{data.phone}</span>
				</li>
			)}
			{(data.managerEmail || data.managerPhone) && (
				<li style={{ 
				marginTop: "10px", 
				marginBottom: "6px", 
				fontWeight: "bold",
				fontSize: "11px",
				textTransform: "uppercase",
				letterSpacing: "0.5px",
				opacity: 0.8,
				}}>
				Agent
				</li>
			)}
			{data.managerEmail && (
				<li style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
				<Mail size={14} />
				<span>{data.managerEmail}</span>
				</li>
			)}
			{data.managerPhone && (
				<li style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
				<Phone size={14} />
				<span>{data.managerPhone}</span>
				</li>
			)}
			</ul>
		</div>
		</div>

		{/* ============== POWERED BY SCOUTIFY ============== */}
		<div style={{
			position: "absolute",
			bottom: "10px",
			left: "50px",
			width: "280px",
			textAlign: "center",
			fontSize: "10px",
			color: "white",
			opacity: 0.6,
		}}>
			Powered by Scoutify
		</div>

		{/* ============== CARRIÈRE & STATISTIQUES ============== */}
		<div
			style={{
				position: "absolute",
				top: "320px",
				left: "350px",
				width: "440px",
				color: "#000000",
			}}
		>
			{/* Seasons */}
			{data.seasons.map((season, idx) => (
				<div
					key={idx}
					style={{
						marginBottom: "15px",
						borderBottom: idx < data.seasons.length - 1 ? "1px solid #ddd" : "none",
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					{/* Left side - Season info */}
					<div style={{ flex: 1 }}>
						{/* Year + Club */}
						<div style={{ fontWeight: "bold", marginBottom: "4px" }}>
							<span style={{ color: "#000000" }}>{season.year.split("-")[0]}</span>
							<span style={{ color: data.cvColor }}>{" \u2794 "}</span>
							<span style={{ color: "#000000" }}>{season.year.split("-")[1]}</span>
							<span> - {season.club.toUpperCase()}</span>
						</div>

						{/* Division + Category */}
						<div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
							<span style={{ color: data.cvColor, fontWeight: "bold", fontSize: "12px", textTransform: "uppercase" }}>
								{season.category} / {season.division}
							</span>
							{season.divisionLogo && (
								<img 
									src={season.divisionLogo} 
									alt={season.division} 
									style={{ height: "18px", objectFit: "contain" }}
								/>
							)}
						</div>

						{/* Comments with badges */}
						<ul style={{ margin: 0, padding: "0 0 0 15px", fontSize: "11px", lineHeight: "1.6", listStyleType: "disc" }}>
							{season.comments.map((comment, cIdx) => (
								<li key={cIdx} style={{ display: "list-item", paddingLeft: "4px" }}>
									<span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
										<span>{typeof comment === "string" ? comment : comment.text}</span>
										{typeof comment !== "string" && comment.badges && comment.badges.map((badge, bIdx) => (
											badge.length === 2 ? (
												/* Flag badge */
												<span
													key={bIdx}
													className={`fi fi-${badge.toLowerCase()}`}
													style={{ fontSize: "12px" }}
												/>
											) : (
												/* Image badge */
												<img
													key={bIdx}
													src={badge}
													alt=""
													style={{ height: "14px", objectFit: "contain" }}
												/>
											)
										))}
									</span>
								</li>
							))}
						</ul>

						{/* Stats (if has matches) */}
						{season.matches && parseInt(season.matches) > 0 && (
							<div style={{ 
								display: "flex", 
								gap: "15px", 
								marginTop: "8px",
								fontSize: "11px",
								backgroundColor: "#f5f5f5",
								padding: "6px 10px",
								borderRadius: "4px",
							}}>
								<div>
									<strong style={{ fontSize: "14px" }}>{season.goals}</strong> buts
								</div>
								<div>
									<strong style={{ fontSize: "14px" }}>{season.assists}</strong> passes déc.
								</div>
								<div>
									<strong style={{ fontSize: "14px" }}>{season.matches}</strong> matchs
								</div>
								<div>
									<strong style={{ fontSize: "14px" }}>{season.avgPlayingTime}'</strong> Temps moy.
								</div>
							</div>
						)}
					</div>

					{/* Right side - Club logo */}
					{season.clubLogo && (
						<div style={{ marginLeft: "10px", flexShrink: 0 }}>
							<img
								src={season.clubLogo}
								alt={season.club}
								style={{ width: "75px", height: "75px", objectFit: "contain" }}
							/>
						</div>
					)}
				</div>
			))}

			{/* ============== FORMATIONS ============== */}
			{data.formations && data.formations.length > 0 && (
				<div style={{  }}>
					<div style={{ 
						fontWeight: "bold", 
						fontSize: "12px", 
						color: data.cvColor,
						marginBottom: "6px",
						textTransform: "uppercase"
					}}>
						Formations
					</div>
					{data.formations.map((formation, idx) => (
						<div key={idx} style={{ fontSize: "11px", marginBottom: "4px" }}>
							<span style={{ color: "#666" }}>{formation.year}</span>
							<span> - </span>
							<span style={{ fontWeight: "500" }}>{formation.title}</span>
							{formation.details && <span style={{ color: "#666" }}> ({formation.details})</span>}
						</div>
					))}
				</div>
			)}

			{/* ============== ESSAIS / MARQUES D'INTÉRÊT ============== */}
			{data.essais && data.essais.length > 0 && (
				<div style={{ marginTop: "15px" }}>
					<div style={{ 
						fontWeight: "bold", 
						fontSize: "12px", 
						color: data.cvColor,
						marginBottom: "6px",
						textTransform: "uppercase"
					}}>
						Essais / Marques d'intérêt
					</div>
					{data.essais.map((essai, idx) => (
						<div key={idx} style={{ fontSize: "11px", marginBottom: "4px" }}>
							<span style={{ color: "#666" }}>{essai.year}</span>
							<span> - </span>
							<span style={{ fontWeight: "500" }}>{essai.club}</span>
							{essai.details && <span style={{ color: "#666" }}> ({essai.details})</span>}
						</div>
					))}
				</div>
			)}
		</div>
	</div>
	</div>
);
}
