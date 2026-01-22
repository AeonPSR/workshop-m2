"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "flag-icons/css/flag-icons.min.css";
import { Mail, Phone, Calendar, Footprints, Ruler, Weight, Zap, Link, ExternalLink, Play } from "lucide-react";

/* ===================== TYPES ===================== */
interface ClubSeason {
  name?: string;
  logo_club?: string;
  division?: string;
  logo_division?: string;
  category?: string;
  matchs?: string;
  goals?: string;
  assists?: string;
  average_playing_time?: string;
  comments?: (string | { text: string; badges?: string[] })[];
}

interface Season {
  duration: string;
  is_split?: boolean;
  current_season?: boolean;
  clubSeasons: ClubSeason[];
}

interface PlayerData {
  firstname: string;
  lastname: string;
  player_image?: string;
  nationality1?: string;
  nationality2?: string;
  nationality3?: string;
  date_of_birth?: string;
  preferred_foot?: string;
  height?: number;
  weight?: number;
  vma?: number;
  primary_position?: string;
  secondary_position?: string;
  qualities?: string[];
  email?: string;
  phone?: string;
  email_agent?: string;
  phone_agent?: string;
  transfermark_url?: string;
}

interface ResumeData {
  playerData: PlayerData;
  cv_color?: string;
  composition_to_display?: string;
  seasons: Season[];
  formations?: { year: string; title: string; details?: string }[];
  essais?: { year: string; club: string; details?: string }[];
}

/* ===================== CV CONSTANTS ===================== */
const CV_COLORS: Record<string, string> = {
  "#1E5EFF": "bleu",
  "#C46A4A": "orange",
  "#5B6B3A": "vert",
  "#0F2A43": "bleu fonce",
  "#D6C6A8": "beige",
  "#7A1E3A": "rouge",
};

const POSITION_COORDS_433: Record<string, { top: number; left: number }> = {
  GB: { top: 210, left: 678 },
  AG: { top: 160, left: 610 },
  DCG: { top: 178, left: 650 },
  DCD: { top: 178, left: 708 },
  AD: { top: 160, left: 745 },
  MD: { top: 112, left: 640 },
  MCG: { top: 140, left: 678 },
  MCD: { top: 112, left: 718 },
  AIG: { top: 76, left: 620 },
  AC: { top: 48, left: 680 },
  AID: { top: 76, left: 735 },
};

const POSITION_COORDS_352: Record<string, { top: number; left: number }> = {
  GB: { top: 210, left: 678 },
  DCG: { top: 178, left: 632 },
  DCA: { top: 176, left: 678 },
  DCD: { top: 178, left: 722 },
  PG: { top: 137, left: 613 },
  MCG: { top: 126, left: 660 },
  MD: { top: 95, left: 680 },
  MCD: { top: 126, left: 703 },
  PD: { top: 137, left: 745 },
  ATG: { top: 65, left: 650 },
  ATD: { top: 65, left: 708 },
};

const NATIONALITIES: Record<string, string> = {
  DZ: "algérien",
  DE: "allemand",
  "GB-ENG": "anglais",
  AO: "angolais",
  AR: "argentin",
  AM: "arménien",
  BE: "belge",
  BJ: "béninois",
  BR: "brésilien",
  BF: "burkinabè",
  BI: "burundais",
  CM: "camerounais",
  CV: "cap-verdien",
  CF: "centrafricain",
  CL: "chilien",
  CO: "colombien",
  KM: "comorien",
  CG: "congolais",
  KR: "sud-coréen",
  CI: "ivoirien",
  HR: "croate",
  DK: "danois",
  EG: "égyptien",
  "GB-SCT": "écossais",
  ES: "espagnol",
  US: "américain",
  FR: "français",
  GA: "gabonais",
  GH: "ghanéen",
  GR: "grec",
  GN: "guinéen",
  GQ: "équato-guinéen",
  GW: "bissau-guinéen",
  HT: "haïtien",
  NL: "néerlandais",
  HU: "hongrois",
  "GB-NIR": "nord-irlandais",
  IE: "irlandais",
  IT: "italien",
  JP: "japonais",
  LB: "libanais",
  LR: "libérien",
  LU: "luxembourgeois",
  MK: "macédonien",
  MG: "malgache",
  ML: "malien",
  MA: "marocain",
  MR: "mauritanien",
  MX: "mexicain",
  ME: "monténégrin",
  NG: "nigérian",
  NO: "norvégien",
  NZ: "néo-zélandais",
  UG: "ougandais",
  "GB-WLS": "gallois",
  PL: "polonais",
  PT: "portugais",
  CD: "congolais (RDC)",
  RO: "roumain",
  RU: "russe",
  RW: "rwandais",
  SN: "sénégalais",
  RS: "serbe",
  SL: "sierra-léonais",
  SK: "slovaque",
  SI: "slovène",
  SD: "soudanais",
  SE: "suédois",
  CH: "suisse",
  TD: "tchadien",
  CZ: "tchèque",
  TG: "togolais",
  TN: "tunisien",
  TR: "turc",
  UA: "ukrainien",
  UY: "uruguayen",
  VE: "vénézuélien",
  ZM: "zambien",
  ZW: "zimbabwéen",
};

const POSITION_NAMES: Record<string, string> = {
  GB: "GARDIEN DE BUT",
  AG: "ARRIÈRE GAUCHE",
  DCG: "DÉFENSEUR CENTRAL GAUCHE",
  DCA: "DÉFENSEUR CENTRAL AXE",
  DCD: "DÉFENSEUR CENTRAL DROIT",
  AD: "ARRIÈRE DROIT",
  PG: "PISTON GAUCHE",
  PD: "PISTON DROIT",
  MD: "MILIEU DÉFENSIF",
  MCG: "MILIEU CENTRAL GAUCHE",
  MCD: "MILIEU CENTRAL DROIT",
  AIG: "AILIER GAUCHE",
  AC: "AVANT-CENTRE",
  AID: "AILIER DROIT",
  ATG: "ATTAQUANT GAUCHE",
  ATD: "ATTAQUANT DROIT",
};

/* ===================== COMPONENT ===================== */
export default function CVTemplatePage() {
  const searchParams = useSearchParams();
  const resumeId = 1;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resumeId) {
      setLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/resumes/${resumeId}`);
        if (!res.ok) throw new Error("Resume not found");

        const resumeData: ResumeData = await res.json();

        const mappedData = {
          firstName: resumeData.playerData.firstname || "",
          lastName: resumeData.playerData.lastname || "",
          photoUrl: resumeData.playerData.player_image || "/default-photo.jpg",
          nationalities: [
            resumeData.playerData.nationality1,
            resumeData.playerData.nationality2,
            resumeData.playerData.nationality3,
          ].filter(Boolean),
          internationals: [] as string[],
          birthDate: resumeData.playerData.date_of_birth || "",
          preferredFoot: resumeData.playerData.preferred_foot || "",
          height: resumeData.playerData.height || 0,
          weight: resumeData.playerData.weight || 0,
          vma: resumeData.playerData.vma || 0,
          composition: resumeData.composition_to_display || "4-3-3",
          mainPosition: resumeData.playerData.primary_position || "",
          secondaryPosition: resumeData.playerData.secondary_position || "",
          qualities: resumeData.playerData.qualities || [],
          email: resumeData.playerData.email || "",
          phone: resumeData.playerData.phone || "",
          managerEmail: resumeData.playerData.email_agent || "",
          managerPhone: resumeData.playerData.phone_agent || "",
          cvColor: resumeData.cv_color || "#1E5EFF",
          links: resumeData.playerData.transfermark_url ? [resumeData.playerData.transfermark_url] : [],
          seasons: resumeData.seasons.flatMap((s: Season) => {
            if (s.is_split && s.clubSeasons.length >= 2) {
              return [
                {
                  year: `Première saison ${s.duration}`,
                  club: s.clubSeasons[0]?.name || "",
                  clubLogo: s.clubSeasons[0]?.logo_club || "",
                  division: s.clubSeasons[0]?.division || "",
                  divisionLogo: s.clubSeasons[0]?.logo_division || "",
                  category: s.clubSeasons[0]?.category || "",
                  isCurrent: s.current_season || false,
                  matches: s.clubSeasons[0]?.matchs || "0",
                  goals: s.clubSeasons[0]?.goals || "0",
                  assists: s.clubSeasons[0]?.assists || "0",
                  avgPlayingTime: s.clubSeasons[0]?.average_playing_time || "0",
                  comments: s.clubSeasons[0]?.comments || [],
                },
                {
                  year: `Deuxième saison ${s.duration}`,
                  club: s.clubSeasons[1]?.name || "",
                  clubLogo: s.clubSeasons[1]?.logo_club || "",
                  division: s.clubSeasons[1]?.division || "",
                  divisionLogo: s.clubSeasons[1]?.logo_division || "",
                  category: s.clubSeasons[1]?.category || "",
                  isCurrent: s.current_season || false,
                  matches: s.clubSeasons[1]?.matchs || "0",
                  goals: s.clubSeasons[1]?.goals || "0",
                  assists: s.clubSeasons[1]?.assists || "0",
                  avgPlayingTime: s.clubSeasons[1]?.average_playing_time || "0",
                  comments: s.clubSeasons[1]?.comments || [],
                },
              ];
            } else {
              const clubSeason = s.clubSeasons[0] || {};
              return [
                {
                  year: s.duration,
                  club: clubSeason.name || "",
                  clubLogo: clubSeason.logo_club || "",
                  division: clubSeason.division || "",
                  divisionLogo: clubSeason.logo_division || "",
                  category: clubSeason.category || "",
                  isCurrent: s.current_season || false,
                  matches: clubSeason.matchs || "0",
                  goals: clubSeason.goals || "0",
                  assists: clubSeason.assists || "0",
                  avgPlayingTime: clubSeason.average_playing_time || "0",
                  comments: clubSeason.comments || [],
                },
              ];
            }
          }),
          formations: resumeData.formations || [],
          essais: resumeData.essais || [],
        };

        setData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="w-[794px] h-[1123px] flex items-center justify-center bg-gray-100">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-[794px] h-[1123px] flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">Erreur de chargement</div>
      </div>
    );
  }

  /* ===================== RENDERING ===================== */
  const colorFile = CV_COLORS[data.cvColor] || "bleu";
  const formationFolder = data.composition === "4-3-3" ? "433" : "352";
  const backgroundImage = `/colored CV/${formationFolder}/${formationFolder} ${colorFile}.png`;

  return (
    <div className="w-[794px] h-[1123px] relative overflow-hidden bg-white">
      {/* FULL BACKGROUND IMAGE */}
      <img
        src={backgroundImage}
        alt="CV Background"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* BLACK BAR */}
      <div className="absolute top-0 left-0 w-[284px] h-full bg-black" style={{ zIndex: 1 }} />

      {/* CONTENT OVERLAY */}
      <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 2 }}>
        {/* NATIONALITY FLAGS */}
        <div className="absolute top-[18px] left-[340px] flex gap-2">
          {data.nationalities.map((nat: string, i: number) => (
            <span
              key={i}
              className={`fi fi-${nat.toLowerCase()} text-[28px] leading-none`}
              style={{ width: 36, height: 24 }}
            />
          ))}
        </div>

        {/* PLAYER NAME */}
        {(() => {
          const fullName = `${data.firstName} ${data.lastName}`;
          const firstLineLength = data.firstName.length;
          const needsTwoLines = firstLineLength > 16;
          const isVeryLong = fullName.length > 28;

          let fontSize = 38;
          if (isVeryLong) fontSize = 30;
          else if (needsTwoLines) fontSize = 34;

          const topPosition = needsTwoLines ? 45 : 60;

          return (
            <div
              className="absolute left-[340px] font-black text-white uppercase tracking-tight"
              style={{ top: `${topPosition}px`, fontSize: `${fontSize}px`, lineHeight: 1.1 }}
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

        {/* PLAYER PHOTO */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: 46,
            left: 59,
            width: 167,
            height: 167,
            borderRadius: "50%",
          }}
        >
          <img src={data.photoUrl} alt="Player" className="w-full h-full object-cover" />
        </div>

        {/* POSITION LABELS */}
        <div className="absolute" style={{ top: 122, left: 340 }}>
          {(() => {
            const mainName = POSITION_NAMES[data.mainPosition] || data.mainPosition;
            const secondaryName = POSITION_NAMES[data.secondaryPosition] || data.secondaryPosition;

            const getSize = (text: string) => {
              if (text.length <= 16) return 22;
              if (text.length <= 20) return 18;
              if (text.length <= 24) return 15;
              return 13;
            };

            return (
              <>
                <div
                  className="font-bold text-white uppercase tracking-wide"
                  style={{ fontSize: getSize(mainName), lineHeight: 1.2 }}
                >
                  {mainName}
                </div>
                <div
                  className="font-bold text-white uppercase tracking-wide mt-0.5"
                  style={{ fontSize: getSize(secondaryName), lineHeight: 1.2 }}
                >
                  {secondaryName}
                </div>
              </>
            );
          })()}
        </div>

        {/* FOOTBALL FIELD POSITIONS */}
        {(() => {
          const positionCoords = data.composition === "4-3-3" ? POSITION_COORDS_433 : POSITION_COORDS_352;
          const mainPos = positionCoords[data.mainPosition];
          const secondaryPos = positionCoords[data.secondaryPosition];

          return (
            <>
              {mainPos && (
                <div
                  className="absolute w-3 h-3 rounded-full bg-yellow-400 border-2 border-black"
                  style={{ top: mainPos.top, left: mainPos.left }}
                />
              )}
              {secondaryPos && (
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-black"
                  style={{ top: secondaryPos.top, left: secondaryPos.left }}
                />
              )}
            </>
          );
        })()}

        {/* SIDEBAR SECTIONS */}
        <div className="absolute left-[40px] text-white" style={{ top: 235, width: 210 }}>
          {/* International selections */}
          {data.internationals.filter((i: string) => i !== "").map((intCode: string, idx: number) => (
            <div key={idx} className="mb-3 flex items-center gap-2">
              <div className="text-[12px] font-medium leading-tight">
                International {NATIONALITIES[intCode] || intCode}
              </div>
              <span
                className={`fi fi-${intCode.toLowerCase()}`}
                style={{ width: 20, height: 14, fontSize: 14 }}
              />
            </div>
          ))}

          {/* Profile stats */}
          <div className="mt-6 space-y-2.5 text-[13px]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-tight">
                Né le {new Date(data.birthDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Footprints className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-tight">Pied fort - {data.preferredFoot}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-tight">Taille - {data.height} cm</span>
            </div>
            <div className="flex items-center gap-2">
              <Weight className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-tight">Poids - {data.weight} kg</span>
            </div>
            {data.vma > 0 && (
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="leading-tight">VMA - {data.vma} km/h</span>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mt-6 space-y-2">
            {data.links && data.links.filter((link: string) => link !== "").map((link: string, idx: number) => {
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
                  className="flex items-center gap-2 text-[12px] hover:underline"
                >
                  {isYoutube && youtubeThumbnail && (
                    <img src={youtubeThumbnail} alt="Video" className="w-8 h-6 rounded object-cover" />
                  )}
                  {isTransfermarkt && (
                    <img src="/transfermarkt-logo.png" alt="Transfermarkt" className="w-5 h-5" />
                  )}
                  {!isYoutube && !isTransfermarkt && <Link className="w-3.5 h-3.5 flex-shrink-0" />}
                  <span className="flex-1 truncate">
                    {isYoutube && "Vidéo YouTube"}
                    {isTransfermarkt && "Transfermarkt"}
                    {!isYoutube && !isTransfermarkt && new URL(link).hostname}
                  </span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              );
            })}
          </div>

          {/* Qualities */}
          <div className="mt-8">
            {data.qualities.filter((q: string) => q !== "").map((quality: string, i: number) => (
              <div key={i} className="text-[13px] leading-snug mb-1.5">
                * {quality}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-8 space-y-2 text-[11px]">
            {data.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="leading-tight break-all">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="leading-tight">{data.phone}</span>
              </div>
            )}
            {(data.managerEmail || data.managerPhone) && (
              <div className="font-bold text-[12px] mt-4 mb-2">Agent</div>
            )}
            {data.managerEmail && (
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="leading-tight break-all">{data.managerEmail}</span>
              </div>
            )}
            {data.managerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="leading-tight">{data.managerPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* POWERED BY SCOUTIFY */}
        <div className="absolute left-[40px] text-white text-[9px] opacity-60" style={{ bottom: 15 }}>
          Powered by Scoutify
        </div>

        {/* SEASONS */}
        <div className="absolute left-[300px] right-[20px]" style={{ top: 235, paddingBottom: 30 }}>
          {data.seasons.map((season: any, idx: number) => (
            <div key={idx} className="mb-6 flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-white leading-tight mb-1">
                  {season.year.split("-")[0]} → {season.year.split("-")[1]} - {season.club.toUpperCase()}
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white mb-2">
                  <span>
                    {season.category} / {season.division}
                  </span>
                  {season.divisionLogo && (
                    <img src={season.divisionLogo} alt={season.division} className="h-3 object-contain" />
                  )}
                </div>
                <div className="space-y-1 mb-2">
                  {season.comments.map((comment: any, cIdx: number) => (
                    <div key={cIdx} className="text-[9px] text-white flex items-center gap-2">
                      <span>{typeof comment === "string" ? comment : comment.text}</span>
                      {typeof comment !== "string" &&
                        comment.badges &&
                        comment.badges.map((badge: string, bIdx: number) =>
                          badge.length === 2 ? (
                            <span
                              key={bIdx}
                              className={`fi fi-${badge.toLowerCase()}`}
                              style={{ width: 14, height: 10, fontSize: 10 }}
                            />
                          ) : (
                            <img key={bIdx} src={badge} alt="badge" className="h-3 object-contain" />
                          )
                        )}
                    </div>
                  ))}
                </div>
                {season.matches && parseInt(season.matches) > 0 && (
                  <div className="flex gap-4 text-[9px] text-white">
                    <span className="font-bold">{season.goals} buts</span>
                    <span className="font-bold">{season.assists} passes déc.</span>
                    <span className="font-bold">{season.matches} matchs</span>
                    <span className="font-bold">{season.avgPlayingTime}' Temps moy.</span>
                  </div>
                )}
              </div>
              {season.clubLogo && (
                <div className="flex-shrink-0">
                  <img src={season.clubLogo} alt={season.club} className="h-10 w-10 object-contain" />
                </div>
              )}
            </div>
          ))}

          {/* FORMATIONS */}
          {data.formations && data.formations.length > 0 && (
            <div className="mt-8">
              <div className="text-[11px] font-bold text-white mb-2">Formations</div>
              {data.formations.map((formation: any, idx: number) => (
                <div key={idx} className="text-[9px] text-white mb-1">
                  {formation.year} - {formation.title}
                  {formation.details && ` (${formation.details})`}
                </div>
              ))}
            </div>
          )}

          {/* ESSAIS */}
          {data.essais && data.essais.length > 0 && (
            <div className="mt-8">
              <div className="text-[11px] font-bold text-white mb-2">Essais / Marques d'intérêt</div>
              {data.essais.map((essai: any, idx: number) => (
                <div key={idx} className="text-[9px] text-white mb-1">
                  {essai.year} - {essai.club}
                  {essai.details && ` (${essai.details})`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}