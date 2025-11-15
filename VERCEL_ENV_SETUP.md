# Vercel Environment Variables Setup Guide

## ⚠️ Critical: Setting MONGODB_URI in Vercel

If your app works locally but not on Vercel, **MONGODB_URI is likely not set in Vercel environment variables**.

## Step-by-Step Setup

### Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual MongoDB user password
6. Replace `<dbname>` with `portfolio` (or your database name)

**Example:**
```
mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

### Step 2: Add to Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Select Your Project**
   - Click on your portfolio project

3. **Navigate to Settings**
   - Click **"Settings"** tab (top navigation)
   - Click **"Environment Variables"** (left sidebar)

4. **Add MONGODB_URI**
   - Click **"Add New"** button
   - **Key**: `MONGODB_URI`
   - **Value**: Paste your MongoDB connection string
   - **Environment**: 
     - ✅ **Production** (required)
     - ✅ **Preview** (recommended)
     - ✅ **Development** (optional)
   - Click **"Save"**

5. **Add ADMIN_PASSWORD** (if not already set)
   - Click **"Add New"** again
   - **Key**: `ADMIN_PASSWORD`
   - **Value**: Your admin panel password
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

### Step 3: Redeploy

**Important**: Environment variables are only available after redeploying!

1. **Option A: Redeploy from Dashboard**
   - Go to **"Deployments"** tab
   - Click **"..."** (three dots) on latest deployment
   - Click **"Redeploy"**
   - Confirm redeploy

2. **Option B: Push New Commit**
   - Make a small change (add a comment, update README)
   - Commit and push to GitHub
   - Vercel will auto-deploy

### Step 4: Verify

1. **Wait for deployment to complete**
   - Check deployment status in Vercel dashboard
   - Wait for "Ready" status

2. **Test your API endpoints**
   ```
   https://your-app.vercel.app/api/portfolio/projects
   https://your-app.vercel.app/api/portfolio/skills
   ```

3. **Check Vercel Function Logs**
   - Go to **"Functions"** tab
   - Click on a function (e.g., `/api/portfolio/projects`)
   - Check **"Logs"** tab
   - Look for:
     - ✅ "MongoDB module loaded successfully"
     - ✅ "Read X items from projects collection"
     - ❌ Any error messages

## Common Issues

### Issue 1: "MONGODB_URI not set"

**Symptoms:**
- Logs show: "❌ MONGODB_URI not set in serverless environment!"
- API returns empty data or errors

**Solution:**
- Follow Step 2 above to add the environment variable
- **Make sure to select "Production" environment**
- Redeploy after adding

### Issue 2: "MongoDB connection error"

**Symptoms:**
- Logs show connection timeout or authentication errors

**Solutions:**
1. **Verify connection string is correct**
   - Check username and password
   - Check cluster address
   - Check database name

2. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is added and **Active**
   - Wait 1-2 minutes after adding

3. **Verify MongoDB user permissions**
   - Go to MongoDB Atlas → Database Access
   - Ensure user has read/write permissions

### Issue 3: Environment variable not available after redeploy

**Symptoms:**
- Added variable but still getting "not set" errors

**Solutions:**
1. **Check environment selection**
   - Make sure variable is set for **Production** environment
   - Preview and Development are optional

2. **Verify variable name**
   - Must be exactly: `MONGODB_URI` (case-sensitive)
   - No spaces or extra characters

3. **Check deployment environment**
   - Production deployments use Production variables
   - Preview deployments use Preview variables

4. **Force redeploy**
   - Delete and recreate the environment variable
   - Redeploy from dashboard

## Verification Checklist

After setting up, verify:

- [ ] MONGODB_URI is set in Vercel environment variables
- [ ] Variable is set for **Production** environment
- [ ] Connection string is correct (tested locally)
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Application has been redeployed after adding variables
- [ ] Vercel function logs show "MongoDB module loaded successfully"
- [ ] API endpoints return data (not empty arrays)

## Testing Locally vs Vercel

**Local (works):**
- Uses `.env.local` file
- Reads `MONGODB_URI` from local file
- Can use file system as fallback

**Vercel (not working):**
- Uses environment variables from Vercel dashboard
- **Cannot** use file system (read-only)
- **Must** have `MONGODB_URI` set in Vercel

## Quick Test

After setting up, test this URL:
```
https://your-app.vercel.app/api/portfolio/projects
```

**Expected response:**
```json
{
  "projects": [
    {
      "id": "...",
      "title": "...",
      ...
    }
  ]
}
```

**If empty or error:**
- Check Vercel function logs
- Verify MONGODB_URI is set
- Check MongoDB connection

## Still Not Working?

1. **Check Vercel Logs**
   - Functions → Select function → Logs tab
   - Look for specific error messages

2. **Test MongoDB Connection**
   - Use MongoDB Compass or `mongosh` to test connection string
   - Verify it works outside of Vercel

3. **Verify Network Access**
   - MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is Active

4. **Check Deployment**
   - Ensure latest deployment completed successfully
   - Check build logs for errors

