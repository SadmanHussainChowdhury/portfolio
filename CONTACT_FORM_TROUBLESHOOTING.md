# Contact Form Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to send message" Error

#### Check Database Connection

**If using MongoDB (Production/Vercel):**
- Verify `MONGODB_URI` environment variable is set
- Check MongoDB Atlas Network Access (allow `0.0.0.0/0`)
- Ensure MongoDB cluster is running (not paused)
- Verify database user has read/write permissions

**If using File System (Local Development):**
- Check that `data/db/` directory exists and is writable
- Ensure you have file system write permissions

#### Check Console Logs

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Submit the contact form
4. Look for error messages

Common errors:
- `MongoDB not configured` → Set `MONGODB_URI` environment variable
- `Network error` → Check internet connection
- `Failed to process contact form` → Check server logs

### 2. Database Initialization Issues

The database auto-initializes on first API call. If initialization fails:

**Symptoms:**
- Contact form shows error
- Console shows initialization errors

**Solutions:**
1. Check that `data/*.ts` files exist and are valid
2. Verify database connection (MongoDB or file system)
3. Check server logs for detailed error messages

### 3. Environment Variables

**Required for Production (Vercel):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
ADMIN_PASSWORD=your-secure-password
```

**For Local Development:**
- MongoDB is optional (uses file system by default)
- If using MongoDB, set `MONGODB_URI` in `.env.local`

### 4. Network/Connection Errors

**Symptoms:**
- "Network error. Please check your connection."
- Form submission times out

**Solutions:**
1. Check internet connection
2. Verify API route is accessible: `http://localhost:3000/api/contact`
3. Check CORS settings (should work by default in Next.js)
4. Check browser console for CORS errors

### 5. Validation Errors

**Symptoms:**
- Form shows "All fields are required" or "Invalid email format"

**Solutions:**
1. Ensure all fields are filled
2. Check email format (must be valid email)
3. Check for leading/trailing spaces (auto-trimmed)

## Debugging Steps

### Step 1: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Submit form and check for errors

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Submit form
4. Find `/api/contact` request
5. Check:
   - Status code (should be 200)
   - Response body
   - Request payload

### Step 3: Check Server Logs

**Local Development:**
- Check terminal where `npm run dev` is running
- Look for error messages

**Production (Vercel):**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check function logs for errors

### Step 4: Test API Directly

Test the API endpoint directly:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

Expected response:
```json
{
  "message": "Contact form submitted successfully",
  "id": "msg-..."
}
```

## Quick Fixes

### Fix 1: Reset Database (Local)
```bash
# Delete database files
rm -rf data/db/*.json

# Restart server
npm run dev
```

### Fix 2: Check MongoDB Connection
1. Go to MongoDB Atlas
2. Click "Connect" on your cluster
3. Copy connection string
4. Verify it matches `MONGODB_URI` environment variable

### Fix 3: Clear Browser Cache
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache

## Still Having Issues?

1. **Check Error Details**: The form now shows detailed error messages in development mode
2. **Check Console**: Browser and server console logs
3. **Verify Environment**: Ensure all environment variables are set correctly
4. **Test Locally**: Try running locally first to isolate the issue

## Contact Form Flow

```
User submits form
  ↓
Frontend validates
  ↓
POST /api/contact
  ↓
API validates input
  ↓
Initialize database (if needed)
  ↓
Save to database (MongoDB or file system)
  ↓
Return success/error response
  ↓
Frontend shows message
```

## Success Indicators

✅ **Form submitted successfully:**
- Green message: "Message sent successfully!"
- Form fields cleared
- Message saved in database
- Visible in admin panel (`/admin` → Messages tab)

❌ **Form submission failed:**
- Red error message
- Form fields remain filled
- Error logged in console
- Check troubleshooting steps above

