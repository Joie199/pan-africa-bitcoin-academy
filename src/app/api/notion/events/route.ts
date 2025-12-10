import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const databaseId = process.env.NOTION_EVENTS_DB_ID;

    if (!databaseId) {
      return NextResponse.json(
        { error: 'Notion Events database ID not configured' },
        { status: 500 }
      );
    }

    // Clean the database ID
    const cleanDbId = databaseId.trim().replace(/\s/g, '');

    if (cleanDbId.length < 32) {
      return NextResponse.json(
        { error: 'Invalid database ID format' },
        { status: 400 }
      );
    }

    // Fetch from Notion API directly
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Notion API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Failed to fetch events from Notion',
          details: errorData.message || `HTTP ${response.status}`,
          code: errorData.code
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const results = data.results || [];

    // Transform Notion results to calendar events
    const events = results.map((page: any) => {
      const properties = page.properties || {};
      
      // Extract event name (Title property)
      const eventName = properties['Event Name']?.title?.[0]?.plain_text || 
                       properties['Name']?.title?.[0]?.plain_text || 
                       'Untitled Event';
      
      // Extract event type (Select property)
      const eventTypeRaw = properties['Event Type']?.select?.name || 
                          properties['Type']?.select?.name || 
                          'community';
      const normalizedType = (eventTypeRaw || '').trim().toLowerCase();
      
      // Map Notion event types to calendar event types
      const eventTypeMap: Record<string, 'live-class' | 'assignment' | 'community' | 'workshop' | 'deadline' | 'quiz' | 'cohort'> = {
        'live class': 'live-class',
        'live session': 'live-class',
        'live': 'live-class',
        'office hours': 'community',
        'deadline': 'deadline',
        'workshop': 'workshop',
        'quiz': 'quiz',
        'community event': 'community',
        'community': 'community',
        'cohort start': 'cohort',
        'cohort end': 'cohort',
        'graduation': 'cohort',
        'assignment': 'assignment',
      };
      
      const eventType = eventTypeMap[normalizedType] || 'community';
      
      // Extract date & time (Date property)
      const dateTime = properties['Date & Time']?.date || 
                      properties['Date']?.date || 
                      properties['Date/Time']?.date || 
                      null;
      
      let eventDate = new Date();
      let eventTime: string | undefined;
      
      if (dateTime) {
        if (dateTime.start) {
          const hasTime = dateTime.start.includes('T');
          // If no time provided, pin to noon UTC to avoid timezone day-shift
          const startIso = hasTime
            ? dateTime.start
            : `${dateTime.start}T12:00:00.000Z`;

          eventDate = new Date(startIso);

          // Extract time only if Notion provided a time
          if (hasTime) {
            const dateObj = new Date(startIso);
            eventTime = dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        }
      }
      
      // Extract description
      const description = properties['Description']?.rich_text?.[0]?.plain_text || 
                         properties['Description']?.text || 
                         '';
      
      // Extract recording link
      const recording = properties['Recording']?.url || 
                      properties['Link']?.url || 
                      '';
      
      // Extract cohort relation (if needed)
      const cohortRelation = properties['Cohort']?.relation || [];

      return {
        id: page.id,
        title: eventName,
        date: eventDate.toISOString(),
        type: eventType,
        time: eventTime,
        link: recording || '#',
        description: description,
        cohortIds: cohortRelation.map((r: any) => r.id),
      };
    });

    // Filter out events with invalid dates and sort by date
    const validEvents = events
      .filter((event: { date: string }) => !isNaN(new Date(event.date).getTime()))
      .sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ events: validEvents }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching events from Notion:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch events', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

