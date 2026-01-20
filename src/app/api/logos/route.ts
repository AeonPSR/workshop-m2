import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const logos = db.prepare("SELECT * FROM Logo ORDER BY id DESC").all();
    return NextResponse.json(logos);
  } catch (error) {
    console.error("Erreur GET /api/logos:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les logos." },
      { status: 500 }
    );
  }
}

// POST : Ajouter un logo
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
      "INSERT INTO Logo (name, initials, image) VALUES (?, ?, ?)"
    );
    const result = statement.run(name, initials, image || "");

    return NextResponse.json(

      { id: result.lastInsertRowid, message: "Logo créé avec succès" },
      { status: 201 }

    );
  } catch (error) {
    console.error("Erreur POST /api/logos:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du logo." },
      { status: 500 }
    );
  }
}