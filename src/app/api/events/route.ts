import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch upcoming events, ordered by start_time
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events', details: error.message },
        { status: 500 }
      );
    }

    // Transform events to match expected format
    const transformedEvents = (events || []).map((event: any) => {
      const startTime = event.start_time ? new Date(event.start_time) : null;
      const endTime = event.end_time ? new Date(event.end_time) : null;

      // Determine event type (default to 'community' if not set)
      type EventType = 'live-class' | 'assignment' | 'community' | 'workshop' | 'deadline' | 'quiz' | 'cohort';
      let eventType: EventType = 'community';
      if (event.type) {
        const normalizedType = event.type.toLowerCase().trim();
        const typeMap: Record<string, EventType> = {
          'live class': 'live-class',
          'live session': 'live-class',
          'live': 'live-class',
          'office hours': 'community',
          'deadline': 'deadline',
          'workshop': 'workshop',
          'quiz': 'quiz',
          'cohort': 'cohort',
        };
        eventType = typeMap[normalizedType] || 'community';
      }

      return {
        id: event.id,
        title: event.name || 'Untitled Event',
        date: startTime ? startTime.toISOString() : new Date().toISOString(),
        type: eventType,
        time: startTime ? startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        description: event.description || '',
        link: event.link || '#',
        recordingUrl: event.recording_url || null,
      };
    });

    return NextResponse.json({ events: transformedEvents }, { status: 200 });
  } catch (error: any) {
    console.error('Error in events API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

