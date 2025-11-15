# Profile Image Setup Guide

## How to Add Your Profile Picture

1. **Prepare your image:**
   - Use a professional headshot (like the one you have)
   - Recommended size: 600x600px or larger (square)
   - Format: JPG or PNG
   - File size: Keep under 500KB for best performance

2. **Add the image:**
   - Place your image in the `public/` folder
   - Name it `profile.jpg` or `profile.png`
   - The path should be: `portfolio-nextjs/public/profile.jpg`

3. **Verify it's working:**
   - Run `npm run dev`
   - Navigate to the About section
   - Your image should display automatically

## Alternative: Using a Different Filename

If you want to use a different filename:

1. Add your image to `public/` folder with your preferred name
2. Update `features/about/about-section.tsx`:
   ```typescript
   <Image
     src="/your-image-name.jpg"  // Change this
     alt="Your Name - Title"
     fill
     className="object-cover"
     priority
   />
   ```

## Image Optimization

Next.js automatically optimizes images, but for best results:
- Use JPG for photos (smaller file size)
- Use PNG for graphics with transparency
- Compress images before adding (use tools like TinyPNG or ImageOptim)

## Current Setup

The portfolio is configured to use `/profile.jpg` from the public folder. Simply add your image file there and it will work automatically!

