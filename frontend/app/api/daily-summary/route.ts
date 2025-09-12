import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * タイムゾーンを考慮した過去N日間の日付リストを 'YYYY-MM-DD' 形式で生成します。
 * @param days 遡る日数
 * @returns {string[]} 日付文字列の配列
 */
function getLastNDates(days: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates.reverse(); // 古い日付から順に並べる
}

export async function GET() {
  console.log(`[API LOG] GET /api/weekly-summary が呼び出されました。`);
  try {
    const db = await getDb();
    const last7Days = getLastNDates(7);
    const firstDay = last7Days[0];

    // 過去7日間のログを全て取得
    const rows: { date: string; type: string; time: number }[] = await db.all(`
      SELECT
        l.date,
        c.type,
        SUM(l.duration) as time
      FROM
        usage_log l
      JOIN
        app_categories c ON l.app_name = c.app_name
      WHERE
        l.date >= ?
      GROUP BY
        l.date, c.type
    `, [firstDay]);

    // 曜日を取得するためのヘルパー
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

    // 過去7日間分のデータを整形
    const weeklyData = last7Days.map(dateStr => {
      const dateObj = new Date(dateStr + 'T00:00:00'); // タイムゾーンのズレを防ぐためT00:00:00を付与
      const name = dayOfWeek[dateObj.getDay()];

      const dailyLogs = rows.filter(r => r.date === dateStr);

      const studyTime = dailyLogs
        .filter(log => log.type === 'study')
        .reduce((sum, log) => sum + log.time, 0);

      const nonStudyTime = dailyLogs
        .filter(log => log.type !== 'study')
        .reduce((sum, log) => sum + log.time, 0);

      return {
        name: name,
        // 時間（秒）を時間（hour）に変換し、小数点以下2桁に丸める
        study: parseFloat((studyTime / 3600).toFixed(2)),
        nonStudy: parseFloat((nonStudyTime / 3600).toFixed(2)),
      };
    });

    return NextResponse.json(weeklyData);

  } catch (error) {
    console.error('API [weekly-summary] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
