# Notion Connection Troubleshooting

## Common Error: "Invalid request URL"

This error usually means the database ID format is incorrect. Here's how to fix it:

### Getting the Correct Database ID

1. **Open your Notion database in a web browser**
2. **Look at the URL** - it will look like:
   ```
   https://www.notion.so/workspace/DATABASE_ID?v=...
   ```
3. **Extract the Database ID**:
   - The database ID is the 32-character string (with or without hyphens)
   - Example: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - Or: `a1b2c3d4e5f67890abcdef1234567890`

### Database ID Format Rules

- ✅ **Correct**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890` (with hyphens)
- ✅ **Correct**: `a1b2c3d4e5f67890abcdef1234567890` (without hyphens)
- ❌ **Wrong**: `https://www.notion.so/workspace/a1b2c3d4...` (full URL)
- ❌ **Wrong**: `a1b2c3d4 e5f6 7890` (with spaces)
- ❌ **Wrong**: `a1b2c3d4` (too short)

### Steps to Fix

1. **Check your `.env.local` file**:
   ```env
   NOTION_APPLICATIONS_DB_ID=your-32-character-database-id-here
   ```

2. **Make sure there are NO spaces** in the database ID

3. **Remove hyphens if you want** (both formats work, but no spaces allowed)

4. **Restart your dev server** after changing `.env.local`:
   ```bash
   npm run dev
   ```

### Verifying Your Database ID

The database ID should be exactly 32 characters (excluding hyphens). You can count them:
- With hyphens: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (36 chars total, 32 alphanumeric)
- Without hyphens: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (32 chars)

### Other Common Issues

1. **Database not shared with integration**:
   - Go to your Notion database
   - Click the "..." menu (top right)
   - Select "Connections"
   - Add your integration

2. **API Key format**:
   - Must start with `secret_`
   - Example: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. **Environment variables not loading**:
   - Make sure `.env.local` is in the root directory (same level as `package.json`)
   - Restart the dev server after changing `.env.local`

### Testing the Connection

Visit: `http://localhost:3000/api/notion/test`

This will tell you:
- ✅ If your API key is configured
- ✅ If your database ID is valid
- ✅ If the database is accessible
- ❌ What specific error you're getting

