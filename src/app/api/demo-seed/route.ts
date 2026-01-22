/* ============================================================================
   ██████╗ ███████╗███╗   ███╗ ██████╗     ███████╗███████╗███████╗██████╗ 
   ██╔══██╗██╔════╝████╗ ████║██╔═══██╗    ██╔════╝██╔════╝██╔════╝██╔══██╗
   ██║  ██║█████╗  ██╔████╔██║██║   ██║    ███████╗█████╗  █████╗  ██║  ██║
   ██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║    ╚════██║██╔══╝  ██╔══╝  ██║  ██║
   ██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝    ███████║███████╗███████╗██████╔╝
   ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝     ╚══════╝╚══════╝╚══════╝╚═════╝ 
   
   ⚠️  DEMO SEED API - TO BE REMOVED BEFORE PRODUCTION DEPLOYMENT  ⚠️
   
   This entire file should be deleted when shipping to the client.
   Also remove the demo-badges folder in /public/
   
============================================================================ */

import { NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs";
import path from "path";

// ==================== DEMO BADGE DATA ====================
const DEMO_BADGES = [
  {
    name: "Capitaine",
    initials: "CAP",
    imagePath: "/demo-badges/capitaine.png",
  },
  {
    name: "Champion",
    initials: "CHP",
    imagePath: "/demo-badges/champion.png",
  },
  {
    name: "Meilleur Buteur",
    initials: "BUT",
    imagePath: "/demo-badges/meilleur_buteur.png",
  },
  {
    name: "Surclassé",
    initials: "SUR",
    imagePath: "/demo-badges/surclasse.png",
  },
];
// ==================== END DEMO BADGE DATA ====================

// ==================== DEMO DIVISION LOGOS DATA ====================
const DEMO_DIVISIONS = [
  {
    name: "Ligue 1 (fond blanc)",
    initials: "L1",
    imagePath: "/demo-divisions/ligue 1 fond blanc.png",
  },
  {
    name: "Ligue 1 (fond noir)",
    initials: "L1",
    imagePath: "/demo-divisions/ligue 1 fond noir.png",
  },
  {
    name: "National 2",
    initials: "N2",
    imagePath: "/demo-divisions/national 2.png",
  },
];
// ==================== END DEMO DIVISION LOGOS DATA ====================

// ==================== DEMO CLUB LOGOS DATA ====================
const DEMO_CLUBS = [
  {
    name: "Olympique de Marseille",
    initials: "OM",
    imagePath: "/demo-club/Logo_Olympique_de_Marseille.svg.webp",
  },
  {
    name: "Olympique Lyonnais",
    initials: "OL",
    imagePath: "/demo-club/OL.png",
  },
];
// ==================== END DEMO CLUB LOGOS DATA ====================

// Helper to convert image to base64
function imageToBase64(imagePath: string): string {
  const fullPath = path.join(process.cwd(), "public", imagePath);
  if (fs.existsSync(fullPath)) {
    const imageBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(imagePath).slice(1);
    const mimeType = ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
    return `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
  }
  return "";
}

// POST: Seed the database with demo data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category } = body;

    const results: { category: string; inserted: number; errors: string[] }[] = [];

    // ==================== SEED BADGES ====================
    if (!category || category === "badges") {
      const badgeResults = { category: "badges", inserted: 0, errors: [] as string[] };
      
      for (const badge of DEMO_BADGES) {
        try {
          // Check if badge already exists
          const existing = db.prepare("SELECT id FROM badge WHERE name = ?").get(badge.name);
          if (existing) {
            badgeResults.errors.push(`Badge "${badge.name}" already exists, skipping`);
            continue;
          }

          const base64Image = imageToBase64(badge.imagePath);
          if (!base64Image) {
            badgeResults.errors.push(`Image not found for badge "${badge.name}"`);
            continue;
          }

          const statement = db.prepare(
            "INSERT INTO badge (name, initials, image) VALUES (?, ?, ?)"
          );
          statement.run(badge.name, badge.initials, base64Image);
          badgeResults.inserted++;
        } catch (err: any) {
          badgeResults.errors.push(`Error inserting "${badge.name}": ${err.message}`);
        }
      }
      
      results.push(badgeResults);
    }
    // ==================== END SEED BADGES ====================

    // ==================== SEED DIVISION LOGOS ====================
    if (!category || category === "divisions") {
      const divisionResults = { category: "divisions", inserted: 0, errors: [] as string[] };
      
      for (const division of DEMO_DIVISIONS) {
        try {
          // Check if division logo already exists
          const existing = db.prepare("SELECT id FROM division_logo WHERE name = ?").get(division.name);
          if (existing) {
            divisionResults.errors.push(`Division "${division.name}" already exists, skipping`);
            continue;
          }

          const base64Image = imageToBase64(division.imagePath);
          if (!base64Image) {
            divisionResults.errors.push(`Image not found for division "${division.name}"`);
            continue;
          }

          const statement = db.prepare(
            "INSERT INTO division_logo (name, initials, image) VALUES (?, ?, ?)"
          );
          statement.run(division.name, division.initials, base64Image);
          divisionResults.inserted++;
        } catch (err: any) {
          divisionResults.errors.push(`Error inserting "${division.name}": ${err.message}`);
        }
      }
      
      results.push(divisionResults);
    }
    // ==================== END SEED DIVISION LOGOS ====================

    // ==================== SEED CLUB LOGOS ====================
    if (!category || category === "clubs") {
      const clubResults = { category: "clubs", inserted: 0, errors: [] as string[] };
      
      for (const club of DEMO_CLUBS) {
        try {
          // Check if club logo already exists
          const existing = db.prepare("SELECT id FROM logo WHERE name = ?").get(club.name);
          if (existing) {
            clubResults.errors.push(`Club "${club.name}" already exists, skipping`);
            continue;
          }

          const base64Image = imageToBase64(club.imagePath);
          if (!base64Image) {
            clubResults.errors.push(`Image not found for club "${club.name}"`);
            continue;
          }

          const statement = db.prepare(
            "INSERT INTO logo (name, initials, image) VALUES (?, ?, ?)"
          );
          statement.run(club.name, club.initials, base64Image);
          clubResults.inserted++;
        } catch (err: any) {
          clubResults.errors.push(`Error inserting "${club.name}": ${err.message}`);
        }
      }
      
      results.push(clubResults);
    }
    // ==================== END SEED CLUB LOGOS ====================

    return NextResponse.json({
      success: true,
      message: "Demo seed completed",
      results,
    });
  } catch (error: any) {
    console.error("Erreur POST /api/demo-seed:", error);
    return NextResponse.json(
      { error: "Erreur lors du seeding: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE: Clear demo data
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { category } = body;

    const results: { category: string; deleted: number }[] = [];

    // ==================== CLEAR BADGES ====================
    if (!category || category === "badges") {
      const badgeNames = DEMO_BADGES.map(b => b.name);
      const placeholders = badgeNames.map(() => "?").join(", ");
      const statement = db.prepare(`DELETE FROM badge WHERE name IN (${placeholders})`);
      const result = statement.run(...badgeNames);
      results.push({ category: "badges", deleted: result.changes });
    }
    // ==================== END CLEAR BADGES ====================

    // ==================== CLEAR DIVISION LOGOS ====================
    if (!category || category === "divisions") {
      const divisionNames = DEMO_DIVISIONS.map(d => d.name);
      const placeholders = divisionNames.map(() => "?").join(", ");
      const statement = db.prepare(`DELETE FROM division_logo WHERE name IN (${placeholders})`);
      const result = statement.run(...divisionNames);
      results.push({ category: "divisions", deleted: result.changes });
    }
    // ==================== END CLEAR DIVISION LOGOS ====================

    // ==================== CLEAR CLUB LOGOS ====================
    if (!category || category === "clubs") {
      const clubNames = DEMO_CLUBS.map(c => c.name);
      const placeholders = clubNames.map(() => "?").join(", ");
      const statement = db.prepare(`DELETE FROM logo WHERE name IN (${placeholders})`);
      const result = statement.run(...clubNames);
      results.push({ category: "clubs", deleted: result.changes });
    }
    // ==================== END CLEAR CLUB LOGOS ====================

    return NextResponse.json({
      success: true,
      message: "Demo data cleared",
      results,
    });
  } catch (error: any) {
    console.error("Erreur DELETE /api/demo-seed:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression: " + error.message },
      { status: 500 }
    );
  }
}

/* ============================================================================
   END OF DEMO SEED API - REMOVE THIS ENTIRE FILE FOR PRODUCTION
============================================================================ */
