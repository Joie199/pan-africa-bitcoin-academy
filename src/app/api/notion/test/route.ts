import { NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json(
        { error: 'NOTION_API_KEY not found in environment variables' },
        { status: 500 }
      );
    }

    // Test the connection by trying to retrieve a database (if database ID is provided)
    if (process.env.NOTION_APPLICATIONS_DB_ID) {
      try {
        // Clean the database ID - remove any whitespace
        const cleanDbId = process.env.NOTION_APPLICATIONS_DB_ID.trim().replace(/\s/g, '');
        
        // Validate database ID format (should be 32 characters, can have hyphens)
        if (cleanDbId.length < 32) {
          return NextResponse.json(
            {
              error: 'Invalid database ID format',
              details: 'Database ID should be 32 characters long (with or without hyphens)',
              providedId: cleanDbId.substring(0, 10) + '...',
            },
            { status: 400 }
          );
        }
        
        const db = await notion.databases.retrieve({
          database_id: cleanDbId,
        });
        // Extract title from database response
        const title = (db as any).title?.[0]?.plain_text || 'Untitled';
        return NextResponse.json(
          {
            success: true,
            message: 'Successfully connected to Notion!',
            database: {
              id: db.id,
              title: title,
            },
          },
          { status: 200 }
        );
      } catch (dbError: any) {
        // If database access fails, still confirm API key works
        if (dbError.code === 'object_not_found') {
          return NextResponse.json(
            {
              success: true,
              message: 'API key is valid, but database ID not found or not shared with integration',
              error: dbError.message,
            },
            { status: 200 }
          );
        }
        throw dbError;
      }
    } else {
      // Just verify the API key format is correct
      return NextResponse.json(
        {
          success: true,
          message: 'API key configured. Add NOTION_APPLICATIONS_DB_ID to test database connection.',
          apiKeyConfigured: !!process.env.NOTION_API_KEY,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Notion connection error:', error);
    
    // Provide helpful error messages
    if (error.code === 'unauthorized') {
      return NextResponse.json(
        { 
          error: 'Unauthorized - Check your NOTION_API_KEY',
          details: 'Make sure your API key is correct and starts with "secret_"'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to connect to Notion',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}

