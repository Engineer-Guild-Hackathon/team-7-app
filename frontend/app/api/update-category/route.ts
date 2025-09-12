import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// POSTリクエストを処理するハンドラ
export async function POST(request: Request) {
  try {
    const db = await getDb();
    const { appName, newType } = await request.json();

    // appNameとnewTypeが提供されているかチェック
    if (!appName || !newType) {
      return NextResponse.json({ message: 'appName and newType are required' }, { status: 400 });
    }
    
    // app_categoriesテーブルの該当アプリのカテゴリを更新
    await db.run(
      `UPDATE app_categories SET type = ? WHERE app_name = ?`,
      [newType, appName]
    );

    console.log(`[API] カテゴリ更新: ${appName} を ${newType} に変更しました。`);

    // 成功したことを示すレスポンスを返す
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API [update-category] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
