import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GETリクエストを処理するハンドラ
export async function GET() {
  try {
    const db = await getDb();
    const today = new Date().toISOString().slice(0, 10);

    const appUsage = await db.all(`
      SELECT
        ul.app_name as name,
        ac.type as type,
        SUM(ul.duration) as time
      FROM
        usage_log ul
      JOIN
        app_categories ac ON ul.app_name = ac.app_name
      WHERE
        ul.date = ?
      GROUP BY
        ul.app_name, ac.type
      ORDER BY
        time DESC
    `, [today]);

    return NextResponse.json(appUsage);

  } catch (error) {
    console.error('API [app-usage] Error:', error);

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
