import { getVapidPublicKey } from "@/lib/web-push";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const publicKey = getVapidPublicKey();

  if (!publicKey) {
    return NextResponse.json(
      { error: "尚未設定 VAPID 公開金鑰" },
      { status: 503 },
    );
  }

  return NextResponse.json({ publicKey });
}
