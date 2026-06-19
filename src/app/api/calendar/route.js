import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.ICAL_URL;
  if (!url) {
    return NextResponse.json({ error: "Missing ICAL_URL" }, { status: 500 });
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error("Fetch failed");
    const text = await res.text();
    
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/calendar',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 });
  }
}
