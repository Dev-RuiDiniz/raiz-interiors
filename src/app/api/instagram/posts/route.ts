/*
Arquivo: src/app/api/instagram/posts/route.ts
Objetivo: Endpoint de API do Next.js (App Router).
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import { NextResponse } from "next/server";
import { syncInstagramPosts } from "@/lib/instagram-sync";

// GET /api/instagram/posts - Buscar posts do banco
export async function GET(request: Request) {
  try {
    try {
      await syncInstagramPosts({ force: false, minIntervalMinutes: 30 });
    } catch (syncError) {
      console.error("Erro no sync automático do Instagram:", syncError);
    }

    const { prisma } = await import("@/lib/prisma");
    if (!prisma) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const rawLimit = parseInt(searchParams.get("limit") || "12", 10);
    const limit = Number.isNaN(rawLimit) ? 12 : Math.min(Math.max(rawLimit, 1), 24);

    const posts = await prisma.instagramPost.findMany({
      where: { isActive: true },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    // Retorna array vazio se tabela não existir ou outro erro
    return NextResponse.json([]);
  }
}
