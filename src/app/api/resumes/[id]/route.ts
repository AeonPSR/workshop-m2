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
   const resolvedParams = await params;
  const resumeId = resolvedParams.id

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
      essais,
      internationals,
      links
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
          email = ?, phone = ?, email_agent = ?, phone_agent = ?, internationals = ?
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
        playerData.internationals ?? null,
        row.player_data_id
      );

      /* -------- Seasons & ClubSeason -------- */
      db.prepare(`
        DELETE FROM Club_Season
        WHERE season_id IN (SELECT id FROM Season WHERE resume_id = ?)
      `).run(resumeId);

      db.prepare(`DELETE FROM Season WHERE resume_id = ?`).run(resumeId);

     const seasonStmt = db.prepare(`
        INSERT INTO Season (resume_id, duration, current_season, is_split)
        VALUES (?, ?, ?, ?)
      `);
      const clubStmt = db.prepare(`
        INSERT INTO Club_Season 
        (season_id, name, division, category, matchs, goals, assists, average_playing_time, half_number, logo_club, logo_division, comment1, badge1, comment2, badge2, comment3, badge3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            s.clubSeasons[0].average_playing_time ?? 0, 1 , s.clubSeasons[0].logo_club , s.clubSeasons[0].logo_division,
            s.clubSeasons[0].comment1 ?? null, s.clubSeasons[0].badge1 ?? null,
            s.clubSeasons[0].comment2 ?? null, s.clubSeasons[0].badge2 ?? null,
            s.clubSeasons[0].comment3 ?? null, s.clubSeasons[0].badge3 ?? null); // first half

          clubStmt.run(seasonId, s.clubSeasons[1].name ?? null,  s.clubSeasons[1].division, s.clubSeasons[1].category ?? null,
            s.clubSeasons[1].matchs ?? 0, s.clubSeasons[1].goals ?? 0, s.clubSeasons[1].assists ?? 0,
            s.clubSeasons[1].average_playing_time ?? 0, 2,  s.clubSeasons[1].logo_club , s.clubSeasons[1].logo_division,
            s.clubSeasons[1].comment1 ?? null, s.clubSeasons[1].badge1 ?? null,
            s.clubSeasons[1].comment2 ?? null, s.clubSeasons[1].badge2 ?? null,
            s.clubSeasons[1].comment3 ?? null, s.clubSeasons[1].badge3 ?? null); // second half

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
            s.clubSeasons[0].logo_club,
            s.clubSeasons[0].logo_division,
            s.clubSeasons[0].comment1 ?? null,
            s.clubSeasons[0].badge1 ?? null,
            s.clubSeasons[0].comment2 ?? null,
            s.clubSeasons[0].badge2 ?? null,
            s.clubSeasons[0].comment3 ?? null,
            s.clubSeasons[0].badge3 ?? null
          );
        }
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

      /* -------- Internationals -------- */
      db.prepare(`DELETE FROM International WHERE resume_id = ?`).run(resumeId);

      const internationalStmt = db.prepare(`
        INSERT INTO International (resume_id, country_code)
        VALUES (?, ?)
      `);

      internationals?.forEach((i: { country_code: string }) => {
        if (i.country_code) {
          internationalStmt.run(resumeId, i.country_code);
        }
      });

      /* -------- Links -------- */
      db.prepare(`DELETE FROM Link WHERE resume_id = ?`).run(resumeId);

      const linkStmt = db.prepare(`
        INSERT INTO Link (resume_id, url, link_type)
        VALUES (?, ?, ?)
      `);

      links?.forEach((l: { url: string; link_type?: string }) => {
        if (l.url) {
          linkStmt.run(resumeId, l.url, l.link_type ?? null);
        }
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
  const resolvedParams = await params;
  const resumeId = resolvedParams.id



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
        p.phone_agent,
        internationals,
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
      phone_agent: row.phone_agent,
      internationals : row.internationals,
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
            division : c.division,
            logo_club : c.logo_club,
            logo_division : c.logo_division,
            average_playing_time: c.average_playing_time,
            half_number: c.half_number,
            comment1: c.comment1,
            badge1: c.badge1,
            comment2: c.comment2,
            badge2: c.badge2,
            comment3: c.comment3,
            badge3: c.badge3,
          }));

        return {
          id: s.id,
          resume_id: s.resume_id,
          duration: s.duration,
          current_season: Boolean(s.current_season),
          is_split: Boolean(s.is_split), // <-- AJOUTÉ,
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

    /* -------- Internationals -------- */
    const internationals: { id: number; resume_id: number; country_code: string }[] = db
      .prepare(`SELECT * FROM International WHERE resume_id = ?`)
      .all(resumeId)
      .map((i: any) => ({
        id: i.id,
        resume_id: i.resume_id,
        country_code: i.country_code
      }));

    /* -------- Links -------- */
    const links: { id: number; resume_id: number; url: string; link_type: string }[] = db
      .prepare(`SELECT * FROM Link WHERE resume_id = ?`)
      .all(resumeId)
      .map((l: any) => ({
        id: l.id,
        resume_id: l.resume_id,
        url: l.url,
        link_type: l.link_type
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
      essais,
      internationals,
      links
    };

    return NextResponse.json(resume, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PATCH: Basculer le statut is_treated d'un CV
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  const resumeId = resolvedParams.id;

  try {
    // Vérifier que le resume existe et récupérer son statut actuel
    const existing = db.prepare(`SELECT id, is_treated FROM Resume WHERE id = ?`).get(resumeId) as { id: number; is_treated: number } | undefined;
    if (!existing) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    // Basculer le statut
    const newStatus = existing.is_treated ? 0 : 1;
    db.prepare(`UPDATE Resume SET is_treated = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(newStatus, resumeId);

    return NextResponse.json({ 
      message: "Status updated successfully",
      isTreated: newStatus === 1
    }, { status: 200 });
  } catch (err: unknown) {
    console.error("Erreur PATCH /api/resumes/[id]:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: Supprimer un CV et toutes ses données associées
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  const resumeId = resolvedParams.id;

  try {
    // Vérifier que le resume existe
    const existing = db.prepare(`SELECT id FROM Resume WHERE id = ?`).get(resumeId);
    if (!existing) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    db.transaction(() => {
      // Supprimer les Club_Season liés aux Seasons de ce resume
      const seasons = db.prepare(`SELECT id FROM Season WHERE resume_id = ?`).all(resumeId) as { id: number }[];
      for (const season of seasons) {
        db.prepare(`DELETE FROM Club_Season WHERE season_id = ?`).run(season.id);
      }

      // Supprimer les Seasons
      db.prepare(`DELETE FROM Season WHERE resume_id = ?`).run(resumeId);

      // Supprimer les Formations
      db.prepare(`DELETE FROM Formations WHERE resume_id = ?`).run(resumeId);

      // Supprimer les Essais
      db.prepare(`DELETE FROM Essais WHERE resume_id = ?`).run(resumeId);

      // Supprimer les Internationals
      db.prepare(`DELETE FROM International WHERE resume_id = ?`).run(resumeId);

      // Supprimer les Links
      db.prepare(`DELETE FROM Link WHERE resume_id = ?`).run(resumeId);

      // Supprimer le Resume
      db.prepare(`DELETE FROM Resume WHERE id = ?`).run(resumeId);
    })();

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Erreur DELETE /api/resumes/[id]:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
