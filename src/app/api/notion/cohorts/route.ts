import { NextResponse } from 'next/server';
import { queryDatabase, extractText } from '@/lib/notion';

export async function GET() {
  try {
    const databaseId = process.env.NOTION_COHORTS_DB_ID;

    if (!databaseId) {
      return NextResponse.json(
        { error: 'Notion database ID not configured' },
        { status: 500 }
      );
    }

    // Clean the database ID - remove any whitespace
    const cleanDbId = databaseId.trim().replace(/\s/g, '');

    // Query Notion database
    const results = await queryDatabase(cleanDbId);

    // Transform Notion results to your format
    const cohorts = results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        name: extractText(properties.Name?.title || []),
        startDate: properties['Start Date']?.date?.start || '',
        endDate: properties['End Date']?.date?.start || '',
        seats: properties.Seats?.number || 0,
        available: properties.Available?.number || 0,
        level: properties.Level?.select?.name || 'Beginner',
        duration: properties.Duration?.rich_text?.[0]?.plain_text || '8 weeks',
      };
    });

    return NextResponse.json({ cohorts }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching cohorts from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohorts', details: error.message },
      { status: 500 }
    );
  }
}

