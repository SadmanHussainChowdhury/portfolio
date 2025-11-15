# How to Add Your Profile Picture

## Quick Steps:

1. **Save your profile image** to your computer
2. **Copy the image file** to this folder (`portfolio-nextjs/public/`)
3. **Rename it** to exactly: `profile.jpg` (or `profile.png`)

## File Requirements:

- **Name**: Must be exactly `profile.jpg` or `profile.png`
- **Location**: Must be in the `public` folder (this folder)
- **Format**: JPG or PNG
- **Size**: Recommended 600x600px or larger (square works best)

## After Adding:

1. Stop your development server (if running)
2. Delete the `.next` folder:
   ```bash
   rmdir /s .next
   ```
3. Restart the server:
   ```bash
   npm run dev
   ```
4. Hard refresh your browser: `Ctrl + Shift + R`

## Current Status:

✅ Code is ready and waiting for your image
✅ Image path is configured: `/profile.jpg`
✅ Error handling is in place (shows placeholder if image not found)

**Just add your image file here and restart the server!**

