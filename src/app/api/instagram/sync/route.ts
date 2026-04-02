/*
Arquivo: src/app/api/instagram/sync/route.ts
Objetivo: Endpoint de API do Next.js (App Router).
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import { NextResponse } from "next/server";
import { syncInstagramPosts } from "@/lib/instagram-sync";

// POST /api/instagram/sync - Sincronizar posts do Apify para o banco
export async function POST() {
  try {
    const syncResult = await syncInstagramPosts({ force: true, minIntervalMinutes: 0 });

    if (!syncResult.success) {
      const statusByReason: Record<string, number> = {
        token_missing: 503,
        database_unavailable: 503,
        no_posts_from_apify: 404,
      };

      return NextResponse.json(
        { error: syncResult.message, reason: syncResult.reason, stats: syncResult.stats },
        { status: statusByReason[syncResult.reason || ""] || 500 }
      );
    }

    return NextResponse.json(syncResult);
  } catch (error) {
    console.error("Erro na sincronização:", error);
    return NextResponse.json(
      { error: "Erro na sincronização" },
      { status: 500 }
    );
  }
}
