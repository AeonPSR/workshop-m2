"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "flag-icons/css/flag-icons.min.css";

/* ============================================================================
   CV TEMPLATE PAGE - Used by Puppeteer to generate PDF
   This page renders the CV with a full background image from /colored CV/
============================================================================ */

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
  "DG": { top: 160, left: 610 },
  "DCG": { top: 178, left: 650 },
  "DCD": { top: 178, left: 708 },
  "DD": { top: 160, left: 745 },
  // Midfielders (3)
  "MG": { top: 112, left: 640 },
  "MC": { top: 140, left: 678 },
  "MD": { top: 112, left: 718 },
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
  "DC": { top: 176, left: 678 },
  "DCD": { top: 178, left: 722 },
  // Midfielders (5)
  "MG": { top: 137, left: 613 },
  "MCG": { top: 126, left: 660 },
  "MC": { top: 95, left: 680 },
  "MCD": { top: 126, left: 703 },
  "MD": { top: 137, left: 745 },
  // Forwards (2)
  "ATG": { top: 65, left: 650 },
  "ATD": { top: 65, left: 708 },
};

// Dummy data for testing
const DUMMY_DATA = {
  firstName: "Kylian",
  lastName: "Mbappé",
  photoUrl: "/DEMO-mbappe.jpg",
  nationalities: ["FR", "CM", "DZ"],
  birthDate: "1998-12-20",
  preferredFoot: "Droit",
  height: "178",
  weight: "73",
  vma: "22.5",
  composition: "4-3-3" as "4-3-3" | "3-5-2",
  mainPosition: "AC",
  secondaryPosition: "AIG",
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
  ],
  formations: [
    { year: "2013-2017", title: "Centre de Formation AS Monaco", details: "Formation complète" },
    { year: "2011-2013", title: "INF Clairefontaine", details: "Pôle Espoirs" },
  ],
};

export default function CVTemplatePage() {
  const [data, setData] = useState(DUMMY_DATA);
  
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

        {/* Temporary: Show which background is being used */}
        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "5px 10px",
          fontSize: "10px",
          borderRadius: "4px",
        }}>
          Background: {backgroundImage}
        </div>
      </div>
    </div>
  );
}
