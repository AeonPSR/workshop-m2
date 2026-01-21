import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";
import {
  Resume,
  Season,
  ClubSeason,
  Formation,
  Essai,
  PlayerData
} from "../route"; 

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resumeId = Number(params.id);
  if (isNaN(resumeId)) {
    return NextResponse.json({ message: "Invalid resume id" }, { status: 400 });
  }

  try {
    const body: Resume = await req.json();
    const {
      playerData,
      cv_color,
      composition_to_display,
      comments,
      isTreated,
      seasons,
      formations,
      essais
    } = body;

    db.transaction(() => {
      /* -------- Resume -------- */
      db.prepare(`
        UPDATE Resume
        SET
          cv_color = ?,
          composition_to_display = ?,
          comments = ?,
          is_treated = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        cv_color ?? null,
        composition_to_display ?? null,
        comments ?? null,
        isTreated ? 1 : 0,
        resumeId
      );

      /* -------- PlayerData -------- */
      const row = db
        .prepare(`SELECT player_data_id FROM Resume WHERE id = ?`)
        .get(resumeId) as { player_data_id: number } | undefined;

      if (!row) throw new Error("Resume not found");

      db.prepare(`
        UPDATE PlayerData SET
          firstname = ?, lastname = ?, nationality1 = ?, nationality2 = ?, nationality3 = ?,
          player_image = ?, date_of_birth = ?, preferred_foot = ?, height = ?, weight = ?,
          primary_position = ?, secondary_position = ?, vma = ?, transfermark_url = ?, qualities = ?,
          email = ?, phone = ?, email_agent = ?, phone_agent = ?
        WHERE id = ?
      `).run(
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
        row.player_data_id
      );

      /* -------- Seasons & ClubSeason -------- */
      db.prepare(`
        DELETE FROM Club_Season
        WHERE season_id IN (SELECT id FROM Season WHERE resume_id = ?)
      `).run(resumeId);

      db.prepare(`DELETE FROM Season WHERE resume_id = ?`).run(resumeId);

      const seasonStmt = db.prepare(`
        INSERT INTO Season (resume_id, duration, current_season)
        VALUES (?, ?, ?)
      `);

      const clubStmt = db.prepare(`
        INSERT INTO Club_Season (
          season_id, name, category, matchs, goals, assists, average_playing_time,
          badge1_id, badge2_id, badge3_id, logo_club_id, logo_division_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      seasons?.forEach((s: Season) => {
        const seasonInfo = seasonStmt.run(
          resumeId,
          s.duration ?? null,
          s.current_season ? 1 : 0
        );

        const seasonId = seasonInfo.lastInsertRowid as number;

        s.clubSeasons?.forEach((c: ClubSeason) => {
          clubStmt.run(
            seasonId,
            c.name ?? null,
            c.category ?? null,
            c.matchs ?? 0,
            c.goals ?? 0,
            c.assists ?? 0,
            c.average_playing_time ?? 0,
            c.badge1_id ?? null,
            c.badge2_id ?? null,
            c.badge3_id ?? null,
            c.logo_club_id ?? null,
            c.logo_division_id ?? null
          );
        });
      });

      /* -------- Formations -------- */
      db.prepare(`DELETE FROM Formations WHERE resume_id = ?`).run(resumeId);

      const formationStmt = db.prepare(`
        INSERT INTO Formations (resume_id, duration, title, details)
        VALUES (?, ?, ?, ?)
      `);

      formations?.forEach((f: Formation) => {
        formationStmt.run(
          resumeId,
          f.duration ?? null,
          f.title ?? null,
          f.details ?? null
        );
      });

      /* -------- Essais -------- */
      db.prepare(`DELETE FROM Essais WHERE resume_id = ?`).run(resumeId);

      const essaiStmt = db.prepare(`
        INSERT INTO Essais (resume_id, club, year)
        VALUES (?, ?, ?)
      `);

      essais?.forEach((e: Essai) => {
        essaiStmt.run(
          resumeId,
          e.club ?? null,
          e.year ?? null
        );
      });
    })();

    return NextResponse.json(
      { message: "Resume updated successfully", resumeId },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}




export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resumeId = Number(params.id);

  if (isNaN(resumeId)) {
    return NextResponse.json({ message: "Invalid resume id" }, { status: 400 });
  }

  try {
    /* -------- Resume + PlayerData -------- */
    const row = db.prepare(`
      SELECT
        r.id AS resumeId,
        r.cv_color,
        r.composition_to_display,
        r.comments,
        r.is_treated,
        r.created_at,
        r.updated_at,
        p.id AS player_data_id,
        p.firstname,
        p.lastname,
        p.nationality1,
        p.nationality2,
        p.nationality3,
        p.player_image,
        p.date_of_birth,
        p.preferred_foot,
        p.height,
        p.weight,
        p.primary_position,
        p.secondary_position,
        p.vma,
        p.transfermark_url,
        p.qualities,
        p.email,
        p.phone,
        p.email_agent,
        p.phone_agent
      FROM Resume r
      JOIN PlayerData p ON p.id = r.player_data_id
      WHERE r.id = ?
    `).get(resumeId) as any;

    if (!row) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const playerData: PlayerData = {
      id: row.player_data_id,
      firstname: row.firstname,
      lastname: row.lastname,
      nationality1: row.nationality1,
      nationality2: row.nationality2,
      nationality3: row.nationality3,
      player_image: row.player_image,
      date_of_birth: row.date_of_birth,
      preferred_foot: row.preferred_foot,
      height: row.height,
      weight: row.weight,
      primary_position: row.primary_position,
      secondary_position: row.secondary_position,
      vma: row.vma,
      transfermark_url: row.transfermark_url,
      qualities: row.qualities,
      email: row.email,
      phone: row.phone,
      email_agent: row.email_agent,
      phone_agent: row.phone_agent
    };

    /* -------- Seasons & ClubSeason -------- */
    const seasons: Season[] = db
      .prepare(`SELECT * FROM Season WHERE resume_id = ?`)
      .all(resumeId)
      .map((s: any) => {
        const clubSeasons: ClubSeason[] = db
          .prepare(`SELECT * FROM Club_Season WHERE season_id = ?`)
          .all(s.id)
          .map((c: any) => ({
            id: c.id,
            season_id: c.season_id,
            name: c.name,
            category: c.category,
            matchs: c.matchs,
            goals: c.goals,
            assists: c.assists,
            average_playing_time: c.average_playing_time,
            badge1_id: c.badge1_id,
            badge2_id: c.badge2_id,
            badge3_id: c.badge3_id,
            logo_club_id: c.logo_club_id,
            logo_division_id: c.logo_division_id
          }));

        return {
          id: s.id,
          resume_id: s.resume_id,
          duration: s.duration,
          current_season: Boolean(s.current_season),
          clubSeasons
        };
      });

    /* -------- Formations -------- */
    const formations: Formation[] = db
      .prepare(`SELECT * FROM Formations WHERE resume_id = ?`)
      .all(resumeId)
      .map((f: any) => ({
        id: f.id,
        resume_id: f.resume_id,
        duration: f.duration,
        title: f.title,
        details: f.details
      }));

    /* -------- Essais -------- */
    const essais: Essai[] = db
      .prepare(`SELECT * FROM Essais WHERE resume_id = ?`)
      .all(resumeId)
      .map((e: any) => ({
        id: e.id,
        resume_id: e.resume_id,
        club: e.club,
        year: e.year
      }));

    /* -------- Resume final -------- */
    const resume: Resume = {
      resumeId: row.resumeId,
      cv_color: row.cv_color,
      composition_to_display: row.composition_to_display,
      comments: row.comments,
      isTreated: Boolean(row.is_treated),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      playerData,
      seasons,
      formations,
      essais
    };

    return NextResponse.json(resume, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
