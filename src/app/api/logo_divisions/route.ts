import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET : Récupérer tous les division_logos
export async function GET() {
  try {
    const divisionLogos = db.prepare("SELECT * FROM division_logo ORDER BY id DESC").all();
    return NextResponse.json(divisionLogos);
  } catch (error) {
    console.error("Erreur GET /api/division_logos:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les  logos des divisions " },
      { status: 500 }
    );
  }
}

// POST : Ajouter un division_logo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, initials, image } = body;

    // Validation simple
    if (!name || !image) {
      return NextResponse.json(
        { error: "Le nom et l'image sont requis." },
        { status: 400 }
      );
    }

    const statement = db.prepare(
      "INSERT INTO division_logo (name, initials, image) VALUES (?, ?, ?)"
    );
    const result = statement.run(name, initials, image || "");

    return NextResponse.json(
      { id: result.lastInsertRowid, message: "Logo de la division créé avec succès " },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/division_logos:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du logo de la division ." },
      { status: 500 }
    );
  }
}