# Add Your Profile Picture

## Quick Steps:

1. **Save your profile image** to your computer
   - Make sure it's a good quality image (JPG or PNG format)

2. **Copy the image to this folder** (`portfolio-nextjs/public/`)
   - The full path should be: `portfolio-nextjs/public/profile.jpg`

3. **Rename it exactly to**: `profile.jpg`
   - If it's a PNG, rename to `profile.png` and update the code

4. **Restart your development server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Delete cache
   Remove-Item -Recurse -Force .next
   # Restart
   npm run dev
   ```

5. **Hard refresh your browser**: `Ctrl + Shift + R`

## Image Requirements:

✅ **Format**: JPG or PNG  
✅ **Size**: 600x600px or larger (square works best)  
✅ **File size**: Under 1MB for best performance  
✅ **Quality**: High resolution for crisp display  
✅ **Name**: Must be exactly `profile.jpg` (case-sensitive)

## Current Setup:

The portfolio is already configured to display your image at:
- **Location**: `/profile.jpg` (in the public folder)
- **Section**: About section
- **Features**: 
  - Premium glassmorphism card
  - Hover zoom effect
  - Smooth transitions
  - Responsive design

## After Adding:

Your profile picture will automatically appear in the About section with:
- ✨ Premium glass card styling
- 🎨 Hover zoom animation
- 💫 Smooth transitions
- 📱 Responsive design

**Just add the file and restart the server!**

