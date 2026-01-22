import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db";


// --- TYPES ---
export type PlayerData = {
  id?: number;
  firstname: string;
  lastname: string;
  nationality1?: string;
  nationality2?: string;
  nationality3?: string;
  internationals : string,
  player_image?: string;
  date_of_birth?: string;
  preferred_foot?: string;
  height?: number;
  weight?: number;
  primary_position?: string;
  secondary_position?: string;
  vma?: number;
  transfermark_url?: string;
  qualities?: string;
  email?: string;
  phone?: string;
  email_agent?: string;
  phone_agent?: string;
};

export type ClubSeason = {
  id?: number;
  season_id?: number;
  name?: string;
  category?: string;
  matchs?: number;
  division? : string ; 
  goals?: number;
  assists?: number;
  logo_division : string ,
  logo_club : string ,
  average_playing_time?: number;
  badge1_id?: number;
  badge2_id?: number;
  badge3_id?: number;
  logo_club_id?: number;
  logo_division_id?: number;
  half_number?: number | null;
};

export type Season = {
  id?: number;
  resume_id?: number;
  duration?: string;
  current_season?: boolean;
  is_split?: boolean;
  clubSeasons?: ClubSeason[];
};

export type Formation = {
  id?: number;
  resume_id?: number;
  duration?: string;
  title?: string;
  details?: string;
};

export type Essai = {
  id?: number;
  resume_id?: number;
  club?: string;
  year?: string;
};

export type Resume = {
  resumeId: number;
  cv_color?: string;
  isTreated: boolean;
  createdAt: string;
  updatedAt: string;
  composition_to_display?: string;
  comments?: string;
  playerData: PlayerData;
  seasons?: Season[];
  formations?: Formation[];
  essais?: Essai[];
};
// --- POST ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerData, cv_color, composition_to_display, comments, seasons, formations, essais, links } = body;

    const resumeId = db.transaction(() => {
      const playerStmt = db.prepare(`
        INSERT INTO PlayerData (
          firstname, lastname, nationality1, nationality2, nationality3,
          player_image, date_of_birth, preferred_foot, height, weight,
          primary_position, secondary_position, vma, transfermark_url, qualities,
          email, phone, email_agent, phone_agent , internationals
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `);

      const playerInfo = playerStmt.run(
        playerData.firstname,
        playerData.lastname,
        playerData.nationality1 ?? null,
        playerData.nationality2 ?? null,
        playerData.nationality3 ?? null,
        playerData.player_image ?? null,
        playerData.date_of_birth ?? null,
        playerData.preferred_foot ?? null,
        playerData.height ?? null,
        playerData.weight ?? null,
        playerData.primary_position ?? null,
        playerData.secondary_position ?? null,
        playerData.vma ?? null,
        playerData.transfermark_url ?? null,
        playerData.qualities ?? null,
        playerData.email ?? null,
        playerData.phone ?? null,
        playerData.email_agent ?? null,
        playerData.phone_agent ?? null,
        playerData.internationals ?? null
      );

      const playerId = playerInfo.lastInsertRowid;

      const resumeStmt = db.prepare(`
        INSERT INTO Resume (player_data_id, cv_color, composition_to_display, comments, is_treated)
        VALUES (?, ?, ?, ?, ?)
      `);
      const resumeInfo = resumeStmt.run(playerId, cv_color ?? null, composition_to_display ?? null, comments ?? null, 0);
      const resumeId = resumeInfo.lastInsertRowid;

      const seasonStmt = db.prepare(`
        INSERT INTO Season (resume_id, duration, current_season, is_split)
        VALUES (?, ?, ?, ?)
      `);
      const clubStmt = db.prepare(`
        INSERT INTO Club_Season 
        (season_id, name, division, category, matchs, goals, assists, average_playing_time, half_number, comment1, comment2, comment3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      seasons?.forEach(s => {
        const seasonInfo = seasonStmt.run(
          resumeId,
          s.duration ?? null,
          s.current_season ? 1 : 0,
          s.is_split ? 1 : 0 
        );
        const seasonId = seasonInfo.lastInsertRowid;
        console.log("is_splite :" , s.is_split)
        if (s.is_split) {
          // Half season → exactly 2 clubSeasons required
          if (!s.clubSeasons || s.clubSeasons.length !== 2) {
            throw new Error("A split season must have exactly 2 clubSeasons");
          }

          clubStmt.run(seasonId, s.clubSeasons[0].name ?? null, s.clubSeasons[0].division , s.clubSeasons[0].category ?? null,
            s.clubSeasons[0].matchs ?? 0, s.clubSeasons[0].goals ?? 0, s.clubSeasons[0].assists ?? 0,
            s.clubSeasons[0].average_playing_time ?? 0, 1,
            s.clubSeasons[0].comment1 ?? null, s.clubSeasons[0].comment2 ?? null, s.clubSeasons[0].comment3 ?? null); // first half

          clubStmt.run(seasonId, s.clubSeasons[1].name ?? null,  s.clubSeasons[1].division, s.clubSeasons[1].category ?? null,
            s.clubSeasons[1].matchs ?? 0, s.clubSeasons[1].goals ?? 0, s.clubSeasons[1].assists ?? 0,
            s.clubSeasons[1].average_playing_time ?? 0, 2,
            s.clubSeasons[1].comment1 ?? null, s.clubSeasons[1].comment2 ?? null, s.clubSeasons[1].comment3 ?? null); // second half

        } else {
          // Full season → exactly 1 clubSeason
          if (!s.clubSeasons || s.clubSeasons.length !== 1) {
            throw new Error("A full season must have exactly 1 clubSeason");
          }

          clubStmt.run(
            seasonId,
            s.clubSeasons[0].name ?? null,
            s.clubSeasons[0].division,
            s.clubSeasons[0].category ?? null,
            s.clubSeasons[0].matchs ?? 0,
            s.clubSeasons[0].goals ?? 0,
            s.clubSeasons[0].assists ?? 0,
            s.clubSeasons[0].average_playing_time ?? 0,
            null, // no half
            s.clubSeasons[0].comment1 ?? null,
            s.clubSeasons[0].comment2 ?? null,
            s.clubSeasons[0].comment3 ?? null
          );
        }
      });

      const formationStmt = db.prepare(`INSERT INTO Formations (resume_id, duration, title, details) VALUES (?, ?, ?, ?)`);
      formations?.forEach(f => formationStmt.run(resumeId, f.duration ?? null, f.title ?? null, f.details ?? null));

      const essaiStmt = db.prepare(`INSERT INTO Essais (resume_id, club, year) VALUES (?, ?, ?)`);
      essais?.forEach(e => essaiStmt.run(resumeId, e.club ?? null, e.year ?? null));

      // Insert links (videoUrl, shareLink, etc.)
      const linkStmt = db.prepare(`INSERT INTO Link (resume_id, url, link_type) VALUES (?, ?, ?)`);
      links?.forEach((l: { url: string; link_type?: string }) => {
        if (l.url) linkStmt.run(resumeId, l.url, l.link_type ?? null);
      });

      return resumeId;
    })();

    return NextResponse.json({ message: "Resume created", resumeId }, { status: 201 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}


// --- GET ---
export async function GET(req: NextRequest) {
  try {
    const resumesRaw: any[] = db.prepare(`
     SELECT 
  r.id as resumeId,
  r.cv_color,
  r.composition_to_display,
  r.comments,
  r.created_at,
  r.updated_at,
  r.is_treated,
  p.*
  FROM Resume r
  JOIN PlayerData p ON r.player_data_id = p.id
  ORDER BY r.id DESC
    `).all();

    const fullResumes: Resume[] = resumesRaw.map(r => {
      const playerData: PlayerData = {
        id: r.id,
        firstname: r.firstname,
        lastname: r.lastname,
        nationality1: r.nationality1,
        nationality2: r.nationality2,
        nationality3: r.nationality3,
        player_image: r.player_image,
        date_of_birth: r.date_of_birth,
        preferred_foot: r.preferred_foot,
        height: r.height,
        weight: r.weight,
        primary_position: r.primary_position,
        secondary_position: r.secondary_position,
        vma: r.vma,
        transfermark_url: r.transfermark_url,
        qualities: r.qualities,
        email: r.email,
        phone: r.phone,
        email_agent: r.email_agent,
        phone_agent: r.phone_agent,
        internationals : r.internationals
      };
      const seasons: Season[] = db.prepare(`SELECT * FROM Season WHERE resume_id = ?`).all(r.resumeId).map((s: any) => ({
        ...s,
        clubSeasons: db.prepare(`SELECT * FROM Club_Season WHERE season_id = ?`).all(s.id) as ClubSeason[]
      }));
      const formations: Formation[] = db.prepare(`SELECT * FROM Formations WHERE resume_id = ?`).all(r.resumeId) as Formation[];
      const essais: Essai[] = db.prepare(`SELECT * FROM Essais WHERE resume_id = ?`).all(r.resumeId) as Essai[];

      return {
        resumeId: r.resumeId,
        cv_color: r.cv_color,
        composition_to_display: r.composition_to_display,
        comments: r.comments,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        isTreated: r.is_treated,
        playerData,
        seasons,
        formations,
        essais
      };
    });
    return NextResponse.json(fullResumes, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
