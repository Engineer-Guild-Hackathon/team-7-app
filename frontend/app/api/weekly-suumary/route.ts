import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * 
 * @param daysAgo
 * @returns {string}
 */
function getStartDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - (daysAgo - 1));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * @param dateStr 
 * @returns {number} 
 */
function getWeekNumber(dateStr: string): number {
  const today = new Date();
  const targetDate = new Date(dateStr + 'T00:00:00');
  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) return 4;   // 今週
  if (diffDays < 14) return 3;  // 先週
  if (diffDays < 21) return 2;  // 2週間前
  if (diffDays < 28) return 1;  // 3週間前
  return 0; // 範囲外
}

export async function GET() {
  console.log(`[API LOG] GET /api/monthly-summary が呼び出されました。`);
  try {
    const db = await getDb();
    const startDate = getStartDate(28);
    const rows: { date: string, type: string, duration: number }[] = await db.all(`
      SELECT l.date, c.type, l.duration
      FROM usage_log l
      JOIN app_categories c ON l.app_name = c.app_name
      WHERE l.date >= ?
    `, [startDate]);

    // 週ごとのデータを集計するオブジェクト
    const weeklyTotals: { [key: number]: { study: number, nonStudy: number } } = {
      1: { study: 0, nonStudy: 0 },
      2: { study: 0, nonStudy: 0 },
      3: { study: 0, nonStudy: 0 },
      4: { study: 0, nonStudy: 0 },
    };

    // 日ごとの勉強時間を集計
    const dailyStudyTimes: { [date: string]: number } = {};

    rows.forEach(row => {
      const week = getWeekNumber(row.date);
      if (week > 0) {
        if (row.type === 'study') {
          weeklyTotals[week].study += row.duration;
          dailyStudyTimes[row.date] = (dailyStudyTimes[row.date] || 0) + row.duration;
        } else {
          weeklyTotals[week].nonStudy += row.duration;
        }
      }
    });

    // グラフ用のデータに変換
    const chartData = Object.entries(weeklyTotals).map(([week, times]) => ({
      week: `第${week}週`,
      study: parseFloat((times.study / 3600).toFixed(2)),
      nonStudy: parseFloat((times.nonStudy / 3600).toFixed(2)),
    }));

    // サマリーデータを計算
    const totalStudyTimeSeconds = Object.values(weeklyTotals).reduce((sum, week) => sum + week.study, 0);
    const totalTimeSeconds = Object.values(weeklyTotals).reduce((sum, week) => sum + week.study + week.nonStudy, 0);
    const studyDays = Object.keys(dailyStudyTimes).length;

    const summary = {
      totalStudyHours: parseFloat((totalStudyTimeSeconds / 3600).toFixed(1)),
      averageStudyHours: studyDays > 0 ? parseFloat((totalStudyTimeSeconds / studyDays / 3600).toFixed(1)) : 0,
      longestStudyHours: studyDays > 0 ? parseFloat((Math.max(...Object.values(dailyStudyTimes)) / 3600).toFixed(1)) : 0,
      studyPercentage: totalTimeSeconds > 0 ? Math.round((totalStudyTimeSeconds / totalTimeSeconds) * 100) : 0,
    };
    
    const suggestions = [];
    if (summary.studyPercentage < 50) {
        suggestions.push({
            title: "集中力を高めましょう",
            description: `月間の勉強時間の割合は${summary.studyPercentage}%でした。休憩時間のアプリを見直して、学習効率を上げる工夫をしてみましょう。`
        });
    } else {
        suggestions.push({
            title: "継続的な成長",
            description: "素晴らしいペースで学習ができています！この調子で目標達成を目指しましょう。"
        });
    }
     if (chartData[3].study > chartData[2].study) {
        suggestions.push({
            title: "良い傾向です",
            description: "先週と比較して今週の勉強時間が増えています。学習習慣が身についていますね！"
        });
    }


    return NextResponse.json({ chartData, summary, suggestions });

  } catch (error) {
    console.error('API [monthly-summary] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
