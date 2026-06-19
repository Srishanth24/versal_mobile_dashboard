import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("https://api.todoist.com/api/v1/tasks", {
      headers: { "Authorization": `Bearer ${process.env.TODOIST_TOKEN}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed fetching tasks");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch from Todoist" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === 'close') {
      await fetch(`https://api.todoist.com/api/v1/tasks/${body.taskId}/close`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.TODOIST_TOKEN}` }
      });
      return NextResponse.json({ success: true });
    } 
    
    if (body.action === 'add') {
      const res = await fetch("https://api.todoist.com/api/v1/tasks", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.TODOIST_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: body.content, due_string: "today" })
      });
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to update Todoist" }, { status: 500 });
  }
}
