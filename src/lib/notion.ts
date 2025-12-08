import { Client } from '@notionhq/client';

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Example: Query a database
export async function queryDatabase(databaseId: string) {
  try {
    // Clean the database ID - remove any whitespace and ensure proper format
    const cleanId = databaseId.trim().replace(/\s/g, '');
    
    // Use the correct API method - query pages in a database
    const response = await notion.databases.query({
      database_id: cleanId,
    });
    return response.results;
  } catch (error) {
    console.error('Error querying Notion database:', error);
    throw error;
  }
}

// Example: Get a page
export async function getPage(pageId: string) {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (error) {
    console.error('Error retrieving Notion page:', error);
    throw error;
  }
}

// Example: Create a page in a database
export async function createPage(databaseId: string, properties: any) {
  try {
    // Clean the database ID - remove any whitespace
    const cleanId = databaseId.trim().replace(/\s/g, '');
    
    const response = await notion.pages.create({
      parent: {
        database_id: cleanId,
      },
      properties: properties,
    });
    return response;
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
}

// Example: Update a page
export async function updatePage(pageId: string, properties: any) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    });
    return response;
  } catch (error) {
    console.error('Error updating Notion page:', error);
    throw error;
  }
}

// Helper function to extract text from Notion rich text
export function extractText(richText: any[]): string {
  return richText.map((text) => text.plain_text).join('');
}

// Helper function to format Notion properties for form submission
export function formatPropertiesForSubmission(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  experienceLevel: string;
  preferredCohort: string;
}) {
  return {
    'Name': {
      title: [
        {
          text: {
            content: `${formData.firstName} ${formData.lastName}`,
          },
        },
      ],
    },
    'Email': {
      email: formData.email,
    },
    'Phone': {
      phone_number: formData.phone,
    },
    'Country': {
      rich_text: [
        {
          text: {
            content: formData.country,
          },
        },
      ],
    },
    'City': {
      rich_text: [
        {
          text: {
            content: formData.city || '',
          },
        },
      ],
    },
    'Experience Level': {
      select: {
        name: formData.experienceLevel,
      },
    },
    'Preferred Cohort': {
      rich_text: [
        {
          text: {
            content: formData.preferredCohort,
          },
        },
      ],
    },
  };
}

