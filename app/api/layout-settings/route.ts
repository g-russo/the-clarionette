import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "page-layouts.json");

const DEFAULTS: Record<string, string> = {
  homepage: "featured_hero",
  news: "full_grid",
  features: "magazine",
  sports: "full_grid",
  literary: "single_column",
  filipino: "full_grid",
  article: "single_column",
};

export async function GET() {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    return NextResponse.json({ ...DEFAULTS, ...JSON.parse(raw) });
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
