import { NextResponse } from "next/server";
import db from "@/lib/db";

// DELETE : Supprimer un logo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id

    const result = db.prepare("DELETE FROM Logo WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "logo non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "logo supprimé." });
  } catch (error) {
    console.error("Erreur DELETE /api/logos/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}

// PATCH : Modifier un logo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id
    const { name, initials, image } = await request.json();

    const result = db.prepare(
      "UPDATE Logo SET name = ?, initials = ?, image = ? WHERE id = ?"
    ).run(name, initials, image, id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "logo non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "logo mis à jour." });
  } catch (error) {
    console.error("Erreur PATCH /api/logos/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification." },
      { status: 500 }
    );
  }
}






export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id

    // .get() est utilisé à la place de .all() car on ne veut qu'une seule ligne
    const logo = db.prepare("SELECT * FROM Logo WHERE id = ?").get(id);

    // Si le logo n'existe pas dans la base
    if (!logo) {
      return NextResponse.json(
        { error: "logo introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(logo);
  } catch (error) {
    console.error("Erreur GET /api/logos/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du logo." },
      { status: 500 }
    );
  }
}