# Troubleshooting Profile Picture

## Issue: Profile picture not showing

### Step 1: Check if the image file exists

The image file should be located at:
```
portfolio-nextjs/public/profile.jpg
```

Or alternatively:
```
portfolio-nextjs/public/profile.png
```

### Step 2: Verify file name and format

- ✅ File name must be exactly: `profile.jpg` or `profile.png`
- ✅ File should be in the `public/` folder (not in any subfolder)
- ✅ Check file extension (not `profile.jpg.txt`)

### Step 3: Restart the development server

After adding the image file:

1. Stop the server (Ctrl+C)
2. Delete `.next` folder (if it exists):
   ```bash
   rm -rf .next
   # or on Windows:
   rmdir /s .next
   ```
3. Restart the server:
   ```bash
   npm run dev
   ```

### Step 4: Check browser cache

- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache

### Step 5: Verify image path

Open browser console (F12) and check for errors:
- Look for 404 errors for `/profile.jpg`
- Check if the path is correct

### Step 6: Try different image formats

If JPG doesn't work, try:
1. Rename to `profile.png`
2. Update the code to use `/profile.png`

Or update `features/about/about-section.tsx`:
```typescript
<Image
  src="/profile.png"  // Change to .png
  alt="..."
/>
```

### Step 7: Check image size and format

- Image should be a valid JPG or PNG file
- File size should be reasonable (< 5MB)
- Image should not be corrupted

### Step 8: Alternative - Use absolute path

If local file doesn't work, you can temporarily use an online image:

```typescript
<Image
  src="https://your-image-url.com/profile.jpg"
  alt="..."
/>
```

### Common Issues:

1. **File in wrong location**: Must be in `public/` folder, not `public/images/`
2. **Wrong file name**: Case-sensitive, must be exactly `profile.jpg`
3. **Server not restarted**: Next.js needs restart after adding new files
4. **Browser cache**: Old cached version showing
5. **File extension hidden**: Make sure it's `.jpg` not `.jpg.txt`

### Quick Fix:

1. Place your image in: `portfolio-nextjs/public/profile.jpg`
2. Stop the dev server
3. Delete `.next` folder
4. Run `npm run dev`
5. Hard refresh browser (Ctrl+Shift+R)

If still not working, check the browser console for specific error messages.

