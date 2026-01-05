# Total Tonnage - Web Deployment Guide

## Quick Deploy to Vercel (10 minutes)

### Step 1: Set Up Your Files

Create a folder structure like this:
```
total-tonnage/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── index.css
    └── TotalTonnage.jsx
```

**IMPORTANT:** Create a folder called `src` and move these 3 files into it:
- `main.jsx`
- `index.css`
- `TotalTonnage.jsx`

All other files stay in the root folder.

### Step 2: Deploy to Vercel

**Option A: Deploy via GitHub (Recommended)**

1. Go to **github.com** and create a free account (if you don't have one)

2. Create a new repository:
   - Click "+" → "New repository"
   - Name: `total-tonnage`
   - Make it Public
   - Click "Create repository"

3. Upload your files:
   - Click "uploading an existing file"
   - Drag ALL your files and the `src` folder
   - Click "Commit changes"

4. Go to **vercel.com**
   - Click "Sign Up" → "Continue with GitHub"
   - Allow Vercel to access your repositories

5. Import your project:
   - Click "Add New..." → "Project"
   - Select `total-tonnage` repository
   - Click "Import"
   - Framework Preset: **Vite** (should auto-detect)
   - Click **Deploy**

6. Wait 2-3 minutes for deployment

7. **Done!** You'll get a URL like: `total-tonnage.vercel.app`

**Option B: Deploy via Vercel CLI (Advanced)**

1. Install Node.js from nodejs.org
2. Open Terminal/Command Prompt
3. Navigate to your total-tonnage folder
4. Run: `npm install -g vercel`
5. Run: `vercel`
6. Follow the prompts

### Step 3: Add to iPhone Home Screen

1. **Open Safari** on your iPhone
2. Go to your Vercel URL (e.g., `total-tonnage.vercel.app`)
3. Tap the **Share button** (box with arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"**

**Now it works like a native app!** 📱

### Benefits

✅ No expiration - works forever
✅ No $99/year fee
✅ Access from any device
✅ Updates instantly (just git push)
✅ Free SSL certificate
✅ Automatic backups

### Troubleshooting

**If deployment fails:**
- Make sure all files are in correct folders
- Check that `src` folder exists with 3 files inside
- Vercel Framework should be set to "Vite"

**If app is blank:**
- Check browser console (F12) for errors
- Make sure all files uploaded correctly

### Need Help?

Just let me know which step you're stuck on!
