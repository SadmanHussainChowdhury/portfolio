# Vercel Data Loading Issues - Fix Guide

## Problem
Data is not loading on Vercel deployment. This is usually caused by:
1. MongoDB connection issues
2. Missing environment variables
3. Database initialization failures
4. Network access restrictions

## Quick Fix Checklist

### 1. Verify Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required:**
- `MONGODB_URI`: Your MongoDB Atlas connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`
- `ADMIN_PASSWORD`: Your admin panel password

**To add:**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add `MONGODB_URI` with your connection string
5. Add `ADMIN_PASSWORD` with your password
6. **Redeploy** after adding variables

### 2. Check MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access**
3. Ensure `0.0.0.0/0` is added and **Active**
4. If not, add it and wait 1-2 minutes

### 3. Verify MongoDB Connection String

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

**Important:**
- Replace `username` and `password` with your MongoDB user credentials
- Replace `cluster0.xxxxx` with your actual cluster address
- Database name should be `portfolio` (or your preferred name)

### 4. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Functions** tab
4. Check logs for errors:
   - Look for "MongoDB not configured"
   - Look for connection errors
   - Look for database initialization errors

### 5. Test Database Connection

After deploying, test the API endpoints:

```bash
# Test projects endpoint
curl https://your-app.vercel.app/api/portfolio/projects

# Test skills endpoint
curl https://your-app.vercel.app/api/portfolio/skills

# Test config endpoint
curl https://your-app.vercel.app/api/portfolio/config
```

**Expected response:**
```json
{
  "projects": [...]
}
```

**Error response:**
```json
{
  "error": "Failed to fetch projects",
  "details": "..."
}
```

## Common Error Messages and Solutions

### Error: "MongoDB not configured"
**Solution:**
- Set `MONGODB_URI` in Vercel environment variables
- Redeploy the application

### Error: "Database read failed"
**Solution:**
- Check MongoDB connection string is correct
- Verify MongoDB Atlas Network Access (allow `0.0.0.0/0`)
- Check MongoDB cluster is running (not paused)

### Error: "Connection timeout"
**Solution:**
- Check MongoDB Atlas Network Access
- Verify connection string is correct
- Check MongoDB cluster status

### Error: "Authentication failed"
**Solution:**
- Verify MongoDB username and password in connection string
- Check database user has read/write permissions
- Ensure user exists in MongoDB Atlas

## Step-by-Step Fix

### Step 1: Get MongoDB Connection String

1. Go to MongoDB Atlas
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `portfolio`

### Step 2: Add to Vercel

1. Go to Vercel Dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Name: `MONGODB_URI`
6. Value: Your connection string
7. Environment: **Production, Preview, Development** (select all)
8. Click **"Save"**

### Step 3: Configure Network Access

1. Go to MongoDB Atlas
2. **Network Access** → **Add IP Address**
3. Click **"Allow Access from Anywhere"**
4. Enter: `0.0.0.0/0`
5. Click **"Confirm"**
6. Wait for status to be **"Active"**

### Step 4: Redeploy

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click **"..."** on latest deployment
5. Click **"Redeploy"**
6. Or push a new commit to trigger redeploy

### Step 5: Verify

1. Wait for deployment to complete
2. Visit your site
3. Check browser console (F12) for errors
4. Test API endpoints directly
5. Check Vercel function logs

## Debugging in Vercel

### View Function Logs

1. Vercel Dashboard → Your Project
2. **Functions** tab
3. Click on a function (e.g., `/api/portfolio/projects`)
4. View **Logs** tab
5. Look for error messages

### Check Environment Variables

1. Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Verify `MONGODB_URI` is set
4. Check it's available for **Production** environment

### Test API Endpoints

Use these URLs to test:
- Projects: `https://your-app.vercel.app/api/portfolio/projects`
- Skills: `https://your-app.vercel.app/api/portfolio/skills`
- Experience: `https://your-app.vercel.app/api/portfolio/experience`
- Services: `https://your-app.vercel.app/api/portfolio/services`
- Blog: `https://your-app.vercel.app/api/portfolio/blog`
- Config: `https://your-app.vercel.app/api/portfolio/config`

## Still Not Working?

1. **Check Vercel Logs**: Look for specific error messages
2. **Test MongoDB Connection**: Use MongoDB Compass or `mongosh` to test connection
3. **Verify Connection String**: Double-check username, password, and cluster address
4. **Check MongoDB Status**: Ensure cluster is running and not paused
5. **Network Access**: Verify `0.0.0.0/0` is active in MongoDB Atlas

## Success Indicators

✅ **Working correctly:**
- API endpoints return data
- Portfolio sections load with content
- No errors in browser console
- No errors in Vercel function logs
- Admin panel can view messages

❌ **Still not working:**
- API endpoints return errors
- Portfolio sections are empty
- Errors in browser console
- Errors in Vercel function logs
- Check the specific error message for details

