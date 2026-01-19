import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET : Récupérer tous les badges
export async function GET() {
  try {
    const badges = db.prepare("SELECT * FROM Badge ORDER BY id DESC").all();
    return NextResponse.json(badges);
  } catch (error) {
    console.error("Erreur GET /api/badges:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les badges." },
      { status: 500 }
    );
  }
}

// POST : Ajouter un badge
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
      "INSERT INTO Badge (name, initials, image) VALUES (?, ?, ?)"
    );
    const result = statement.run(name, initials, image || "");

    return NextResponse.json(
      { id: result.lastInsertRowid, message: "Badge créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/badges:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du badge." },
      { status: 500 }
    );
  }
}