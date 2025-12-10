import { NextRequest, NextResponse } from 'next/server';
import { createPage, formatPropertiesForSubmission, notion } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get database ID from environment variable
    const databaseId = process.env.NOTION_APPLICATIONS_DB_ID;

    if (!databaseId) {
      return NextResponse.json(
        { error: 'Notion database ID not configured' },
        { status: 500 }
      );
    }

    // Clean the database ID - remove any whitespace
    const cleanDbId = databaseId.trim().replace(/\s/g, '');

    // Optional: resolve Preferred Cohort relation if Cohorts DB is configured
    let preferredCohortRelation: { id: string }[] | undefined;
    const cohortsDbId = process.env.NOTION_COHORTS_DB_ID?.trim().replace(/\s/g, '');
    const apiKey = process.env.NOTION_API_KEY;
    if (formData.preferredCohort && cohortsDbId && apiKey) {
      try {
        const response = await fetch(`https://api.notion.com/v1/databases/${cohortsDbId}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
          body: JSON.stringify({
            filter: {
              property: 'Name',
              title: {
                equals: formData.preferredCohort,
              },
            },
          }),
        });
        if (response.ok) {
          const match = await response.json();
          const page = match.results?.[0];
          if (page?.id) {
            preferredCohortRelation = [{ id: page.id }];
          }
        }
      } catch (cohortError) {
        console.error('Error resolving cohort relation:', cohortError);
      }
    }

    // If the Notion property is a relation, send relation even if no match (empty array)
    const properties = formatPropertiesForSubmission(formData, preferredCohortRelation ?? []);

    // Create page in Notion database
    const page = await createPage(cleanDbId, properties);

    return NextResponse.json(
      { success: true, pageId: page.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error submitting to Notion:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}

