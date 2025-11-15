# Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Your portfolio uses MongoDB for data storage in production
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Deployment Steps

### 1. Prepare Your Repository

Make sure all your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required:
- `MONGODB_URI`: Your MongoDB Atlas connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`
- `ADMIN_PASSWORD`: Your admin panel password
  - Example: `admin123` (change this to a strong password!)

#### Optional (for production):
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://yourdomain.com`)

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

## Important Notes

### Database Migration

The portfolio automatically uses MongoDB in production (Vercel). Your data will be stored in MongoDB Atlas, not in JSON files.

**First-time setup**: The database will auto-initialize with default data from `data/*.ts` files on first API call.

### File Uploads

⚠️ **Resume uploads via admin panel won't work on Vercel** because the file system is read-only.

**Solutions:**
1. **Upload via Git**: Add your resume file to `public/resume.pdf` and commit it
2. **Use Cloud Storage**: Integrate Vercel Blob Storage, AWS S3, or Cloudinary for dynamic uploads
3. **Manual Upload**: Upload files directly to your repository

### Admin Panel

- Access: `https://your-domain.com/admin/login`
- Default password: Set via `ADMIN_PASSWORD` environment variable
- **Change the default password in production!**

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Database Connection Issues

- Verify `MONGODB_URI` is correct
- **Check MongoDB Atlas Network Access**:
  1. Go to MongoDB Atlas → Network Access
  2. Add IP Address: `0.0.0.0/0` (allows all IPs - required for Vercel)
  3. Wait 1-2 minutes for changes to propagate
  4. See `MONGODB_NETWORK_ACCESS.md` for detailed instructions
- Ensure MongoDB user has read/write permissions

### API Routes Not Working

- Check function logs in Vercel dashboard
- Verify MongoDB connection
- Ensure environment variables are set correctly

## Post-Deployment Checklist

- [ ] Test all portfolio sections load correctly
- [ ] Test admin panel login
- [ ] Verify contact form works
- [ ] Check that dynamic content loads from MongoDB
- [ ] Test on mobile devices
- [ ] Update resume file in repository if needed
- [ ] Change admin password to a strong one
- [ ] Set up custom domain (optional)

## Support

For issues:
1. Check Vercel function logs
2. Check MongoDB Atlas logs
3. Review build logs in Vercel dashboard

