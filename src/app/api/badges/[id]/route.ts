import { NextResponse } from "next/server";
import db from "@/lib/db";

// DELETE : Supprimer un badge
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id

        const result = db.prepare("DELETE FROM Badge WHERE id = ?").run(id);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: "Badge non trouvé." },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Badge supprimé." });
    } catch (error) {
        console.error("Erreur DELETE /api/badges/[id]:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression." },
            { status: 500 }
        );
    }
}

// PATCH : Modifier un badge
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id
        const { name, initials, image } = await request.json();

        const result = db.prepare(
            "UPDATE Badge SET name = ?, initials = ?, image = ? WHERE id = ?"
        ).run(name, initials, image, id);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: "Badge non trouvé." },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Badge mis à jour." });
    } catch (error) {
        console.error("Erreur PATCH /api/badges/[id]:", error);
        return NextResponse.json(
            { error: "Erreur lors de la modification." },
            { status: 500 }
        );
    }
}









export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id

        // .get() est utilisé à la place de .all() car on ne veut qu'une seule ligne
        const badge = db.prepare("SELECT * FROM Badge WHERE id = ?").get(id);

        // Si le badge n'existe pas dans la base
        if (!badge) {
            return NextResponse.json(
                { error: "Badge introuvable." },
                { status: 404 }
            );
        }

        return NextResponse.json(badge);
    } catch (error) {
        console.error("Erreur GET /api/badges/[id]:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération du badge." },
            { status: 500 }
        );
    }
}