# 🚀 Quick Start Guide - Madurai Bible College Landing Page

## Easiest Way to Launch (3 Steps)

### Method 1: Double-Click (Simplest)
1. Navigate to `D:\MaduraiBibleCollage\html_template\`
2. Double-click `index.html`
3. It will open in your default browser

**Note**: Some animations and features may work better with a local server.

---

### Method 2: Using Vite (Recommended for Full Features)

#### Step 1: Install Dependencies
Open PowerShell or Command Prompt in the `html_template` folder and run:
```bash
npm install
```
or if you're using pnpm:
```bash
pnpm install
```

#### Step 2: Launch
Double-click `launch.bat` (Windows) or run:
```bash
npm run dev
```

#### Step 3: View
The page will automatically open at `http://localhost:3000`

---

### Method 3: Using Python (If you have Python installed)
```bash
cd D:\MaduraiBibleCollage\html_template
python -m http.server 8000
```
Then open: `http://localhost:8000`

---

## 📋 What's Included

✅ **Complete Landing Page** with:
- Hero section with background image
- About Us section
- Purpose & Mission
- History timeline
- Academics information
- Student Life details
- Contact information
- Giving/Support section

✅ **All Images** in the `assets` folder:
- hero-campus-golden-light.jpg
- students-studying-theology.jpg
- historic-college-building.jpg
- christian-symbol-watermark.png

✅ **Responsive Design** - Works on:
- Desktop computers
- Tablets
- Mobile phones

✅ **Modern Features**:
- Smooth scrolling
- Animations
- Mobile menu
- Beautiful typography

---

## 🛠️ Troubleshooting

### Images Not Showing?
- Make sure the `assets` folder exists in the `html_template` directory
- Check that all image files are present in the `assets` folder
- If using a server, ensure you're accessing via `http://localhost` not `file://`

### Styles Not Loading?
- Check your internet connection (Tailwind CSS loads from CDN)
- Ensure `style.css` is in the same folder as `index.html`

### JavaScript Not Working?
- Open browser developer console (F12) to check for errors
- Ensure `script.js` is in the same folder as `index.html`
- Check internet connection (external libraries load from CDN)

---

## 📝 File Structure

```
html_template/
├── index.html          ← Main page file
├── style.css          ← Custom styles
├── script.js          ← JavaScript functionality
├── assets/            ← Images folder
│   ├── hero-campus-golden-light.jpg
│   ├── students-studying-theology.jpg
│   ├── historic-college-building.jpg
│   └── christian-symbol-watermark.png
├── launch.bat         ← Quick launch script (Windows)
├── launch.ps1         ← Quick launch script (PowerShell)
├── package.json       ← Dependencies
└── vite.config.js     ← Vite configuration
```

---

## 🎯 Next Steps

1. **Customize Content**: Edit `index.html` to update text and information
2. **Change Colors**: Modify CSS variables in `style.css`
3. **Update Images**: Replace images in the `assets` folder
4. **Add Features**: Extend functionality in `script.js`

---

**Need Help?** Check the full `README.md` for detailed instructions.


