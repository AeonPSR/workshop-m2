"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/* ============================================================================
   CV TEMPLATE PAGE - Used by Puppeteer to generate PDF
   This page renders the CV in HTML/CSS that can be converted to PDF
============================================================================ */

// Position coordinates for 4-3-3 formation (percentage from top-left of pitch)
const POSITIONS_433_COORDS: Record<string, { top: string; left: string }> = {
  GB: { top: "85%", left: "50%" },
  AG: { top: "65%", left: "15%" },
  DCG: { top: "70%", left: "35%" },
  DCD: { top: "70%", left: "65%" },
  AD: { top: "65%", left: "85%" },
  MD: { top: "50%", left: "50%" },
  MCG: { top: "45%", left: "30%" },
  MCD: { top: "45%", left: "70%" },
  AIG: { top: "20%", left: "15%" },
  AC: { top: "15%", left: "50%" },
  AID: { top: "20%", left: "85%" },
};

// Position coordinates for 3-5-2 formation
const POSITIONS_352_COORDS: Record<string, { top: string; left: string }> = {
  GB: { top: "85%", left: "50%" },
  DCG: { top: "70%", left: "25%" },
  DCA: { top: "70%", left: "50%" },
  DCD: { top: "70%", left: "75%" },
  PG: { top: "50%", left: "10%" },
  PD: { top: "50%", left: "90%" },
  MD: { top: "45%", left: "50%" },
  MCG: { top: "40%", left: "30%" },
  MCD: { top: "40%", left: "70%" },
  ATG: { top: "18%", left: "35%" },
  ATD: { top: "18%", left: "65%" },
};

// Color mapping
const CV_COLORS: Record<string, { file: string; hex: string }> = {
  "#1E5EFF": { file: "bleu", hex: "#1E5EFF" },
  "#C46A4A": { file: "orange", hex: "#C46A4A" },
  "#5B6B3A": { file: "vert", hex: "#5B6B3A" },
  "#0F2A43": { file: "bleu fonce", hex: "#0F2A43" },
  "#D6C6A8": { file: "beige", hex: "#D6C6A8" },
  "#7A1E3A": { file: "rouge", hex: "#7A1E3A" },
};

// Dummy data for testing
const DUMMY_DATA = {
  firstName: "Kylian",
  lastName: "Mbappé",
  photoUrl: "/DEMO-mbappe.jpg",
  nationalities: ["FR", "CM"],
  birthDate: "1998-12-20",
  preferredFoot: "Droit",
  height: "178",
  weight: "73",
  vma: "22.5",
  composition: "4-3-3",
  mainPosition: "AIG",
  secondaryPosition: "AC",
  qualities: ["Vitesse", "Dribble", "Finition", "Intelligence de jeu", "Puissance de frappe"],
  email: "kylian.mbappe@example.com",
  phone: "+33 6 12 34 56 78",
  cvColor: "#1E5EFF",
  transfermarktUrl: "https://www.transfermarkt.com/kylian-mbappe/profil/spieler/342229",
  seasons: [
    {
      year: "2024-2025",
      club: "Real Madrid",
      clubLogo: "/demo-club/Logo_Olympique_de_Marseille.svg.webp",
      division: "La Liga",
      divisionLogo: "/demo-divisions/ligue 1 fond blanc.png",
      category: "Sénior",
      isCurrent: true,
      matches: "25",
      goals: "20",
      assists: "8",
      avgPlayingTime: "85",
      comments: ["Saison en cours", "Meilleur buteur du championnat"],
    },
    {
      year: "2023-2024",
      club: "Paris Saint-Germain",
      clubLogo: "/demo-club/OL.png",
      division: "Ligue 1",
      divisionLogo: "/demo-divisions/ligue 1 fond noir.png",
      category: "Sénior",
      isCurrent: false,
      matches: "29",
      goals: "27",
      assists: "7",
      avgPlayingTime: "85",
      comments: ["Meilleur buteur du championnat", "Capitaine de l'équipe"],
    },
    {
      year: "2022-2023",
      club: "Paris Saint-Germain",
      clubLogo: "/demo-club/OL.png",
      division: "Ligue 1",
      divisionLogo: "/demo-divisions/national 2.png",
      category: "Sénior",
      isCurrent: false,
      matches: "34",
      goals: "29",
      assists: "5",
      avgPlayingTime: "87",
      comments: ["Champion de France"],
    },
  ],
  formations: [
    { year: "2013-2017", title: "Centre de Formation AS Monaco", details: "Formation complète" },
    { year: "2011-2013", title: "INF Clairefontaine", details: "Pôle Espoirs" },
  ],
};

// Flag emoji mapping
const FLAG_EMOJIS: Record<string, string> = {
  FR: "🇫🇷",
  CM: "🇨🇲",
  MA: "🇲🇦",
  DZ: "🇩🇿",
  SN: "🇸🇳",
  PT: "🇵🇹",
  ES: "🇪🇸",
  IT: "🇮🇹",
  DE: "🇩🇪",
  BR: "🇧🇷",
  AR: "🇦🇷",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function CVTemplatePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [data, setData] = useState(DUMMY_DATA);
  
  // In the future, fetch real data based on params.id
  // For now, use dummy data
  
  const colorInfo = CV_COLORS[data.cvColor] || CV_COLORS["#1E5EFF"];
  const positionCoords = data.composition === "4-3-3" ? POSITIONS_433_COORDS : POSITIONS_352_COORDS;
  const pitchFolder = data.composition === "4-3-3" ? "433" : "352";
  const pitchImage = `/colored CV/${pitchFolder}/${pitchFolder} ${colorInfo.file}.png`;

  return (
    <div 
      id="cv-container"
      style={{
        width: "794px", // A4 width at 96dpi
        height: "1123px", // A4 height at 96dpi
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#1a1a2e",
        color: "white",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "280px",
          backgroundColor: colorInfo.hex,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Nationality flags */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
          {data.nationalities.map((nat, i) => (
            <span key={i} style={{ fontSize: "28px" }}>{FLAG_EMOJIS[nat] || "🏳️"}</span>
          ))}
        </div>

        {/* Player photo */}
        <div
          style={{
            width: "180px",
            height: "220px",
            backgroundColor: "#333",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "20px",
            border: "3px solid white",
          }}
        >
          <img
            src={data.photoUrl}
            alt={`${data.firstName} ${data.lastName}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* PROFIL section */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <img src="/profil.png" alt="" style={{ width: "24px", height: "24px" }} />
            <h2 style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", margin: 0 }}>
              Profil
            </h2>
          </div>
          
          <p style={{ fontSize: "12px", marginBottom: "8px", opacity: 0.9 }}>
            International(e) {data.nationalities.includes("FR") ? "français(e)" : ""}{" "}
            {data.nationalities.map(n => FLAG_EMOJIS[n] || "").join(" ")}
          </p>

          <div style={{ fontSize: "11px", lineHeight: "1.8" }}>
            <p style={{ margin: "4px 0" }}>
              <span style={{ opacity: 0.8 }}>📅 Né(e) le </span>
              <strong>{formatDate(data.birthDate)}</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ opacity: 0.8 }}>🦶 Pied fort - </span>
              <strong>{data.preferredFoot}</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ opacity: 0.8 }}>📏 Taille - </span>
              <strong>{data.height} cm</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ opacity: 0.8 }}>⚖️ Poids - </span>
              <strong>{data.weight} kg</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ opacity: 0.8 }}>⚡ VMA - </span>
              <strong>{data.vma} km/h</strong>
            </p>
          </div>
        </div>

        {/* Links section (Transfermarkt, video, etc.) */}
        {data.transfermarktUrl && (
          <div style={{ marginBottom: "20px", fontSize: "10px", opacity: 0.8 }}>
            <div style={{ 
              backgroundColor: "rgba(255,255,255,0.1)", 
              padding: "8px", 
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>🔗</span>
              <span>Transfermarkt</span>
            </div>
          </div>
        )}

        {/* QUALITÉS section */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <img src="/qualités.png" alt="" style={{ width: "24px", height: "24px" }} />
            <h2 style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", margin: 0 }}>
              Qualités
            </h2>
          </div>
          
          <ul style={{ fontSize: "11px", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
            {data.qualities.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>

        {/* CONTACT section */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <img src="/Contact.png" alt="" style={{ width: "24px", height: "24px" }} />
            <h2 style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", margin: 0 }}>
              Contact
            </h2>
          </div>
          
          <p style={{ fontSize: "10px", margin: "4px 0" }}>
            ✉️ {data.email}
          </p>
          {data.phone && (
            <p style={{ fontSize: "10px", margin: "4px 0" }}>
              📞 {data.phone}
            </p>
          )}
        </div>

        {/* Scoutify logo at bottom */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img src="/monogramme.svg" alt="Scoutify" style={{ width: "30px", opacity: 0.7 }} />
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#1a1a2e",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header with name and position */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <div>
            <h1 style={{ 
              fontSize: "32px", 
              fontWeight: "bold", 
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "2px"
            }}>
              {data.firstName} {data.lastName}
            </h1>
            <p style={{ 
              fontSize: "16px", 
              margin: "5px 0 0 0",
              textTransform: "uppercase",
              opacity: 0.9,
              letterSpacing: "1px"
            }}>
              {data.mainPosition} {data.secondaryPosition ? `/ ${data.secondaryPosition}` : ""}
            </p>
          </div>

          {/* Pitch with positions */}
          <div style={{ position: "relative", width: "160px", height: "110px" }}>
            <img
              src={pitchImage}
              alt="Formation"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            {/* Main position dot */}
            {positionCoords[data.mainPosition] && (
              <div
                style={{
                  position: "absolute",
                  top: positionCoords[data.mainPosition].top,
                  left: positionCoords[data.mainPosition].left,
                  width: "14px",
                  height: "14px",
                  backgroundColor: colorInfo.hex,
                  borderRadius: "50%",
                  border: "2px solid white",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
            {/* Secondary position dot */}
            {data.secondaryPosition && positionCoords[data.secondaryPosition] && (
              <div
                style={{
                  position: "absolute",
                  top: positionCoords[data.secondaryPosition].top,
                  left: positionCoords[data.secondaryPosition].left,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderRadius: "50%",
                  border: "2px solid " + colorInfo.hex,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
        </div>

        {/* CARRIÈRE & STATISTIQUES */}
        <div
          style={{
            backgroundColor: colorInfo.hex,
            padding: "10px 20px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "bold", 
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "2px",
            textAlign: "center"
          }}>
            Carrière & Statistiques
          </h2>
        </div>

        {/* Seasons */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {data.seasons.map((season, index) => (
            <div
              key={index}
              style={{
                marginBottom: "18px",
                paddingBottom: "15px",
                borderBottom: index < data.seasons.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              {/* Season header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {season.year.split("-")[0]} ▶ {season.year.split("-")[1]} - {season.club.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span
                      style={{
                        backgroundColor: colorInfo.hex,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {season.category}
                    </span>
                    {season.divisionLogo && (
                      <img src={season.divisionLogo} alt="" style={{ height: "20px" }} />
                    )}
                  </div>

                  {/* Comments */}
                  <ul style={{ fontSize: "10px", paddingLeft: "15px", margin: "5px 0", opacity: 0.9 }}>
                    {season.comments.map((comment, i) => (
                      <li key={i}>{comment}</li>
                    ))}
                  </ul>

                  {/* Stats */}
                  {!season.isCurrent && (season.matches || season.goals) && (
                    <div style={{ 
                      display: "flex", 
                      gap: "15px", 
                      marginTop: "8px",
                      fontSize: "11px"
                    }}>
                      {season.goals && (
                        <span>
                          <strong style={{ color: colorInfo.hex }}>{season.goals}</strong> buts
                        </span>
                      )}
                      {season.assists && (
                        <span>
                          <strong style={{ color: colorInfo.hex }}>{season.assists}</strong> passes déc.
                        </span>
                      )}
                      {season.matches && (
                        <span>
                          <strong style={{ color: colorInfo.hex }}>{season.matches}</strong> matchs
                        </span>
                      )}
                      {season.avgPlayingTime && (
                        <span>
                          <strong style={{ color: colorInfo.hex }}>{season.avgPlayingTime}'</strong> TdJ moy.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Club logo */}
                {season.clubLogo && (
                  <div style={{ width: "50px", height: "50px", marginLeft: "10px" }}>
                    <img
                      src={season.clubLogo}
                      alt={season.club}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Formations section if exists */}
        {data.formations && data.formations.length > 0 && (
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>
              Formation
            </h3>
            {data.formations.map((formation, i) => (
              <div key={i} style={{ fontSize: "10px", marginBottom: "5px" }}>
                <strong>{formation.year}</strong> - {formation.title}
                {formation.details && <span style={{ opacity: 0.7 }}> ({formation.details})</span>}
              </div>
            ))}
          </div>
        )}

        {/* Scoutify branding */}
        <div style={{ marginTop: "auto", paddingTop: "10px", textAlign: "right" }}>
          <img src="/logo.svg" alt="Scoutify" style={{ width: "80px", opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}
