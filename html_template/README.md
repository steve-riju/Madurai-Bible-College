# Madurai Bible College Landing Page

A beautiful, responsive landing page for Madurai Bible College built with HTML, CSS, and JavaScript.

## 🚀 How to Launch/Execute

You have multiple options to view this landing page:

### Option 1: Using Vite (Recommended - Best for Development)

This is the recommended method as it provides hot-reload and proper file serving.

1. **Install dependencies** (if not already installed):
   ```bash
   cd html_template
   npm install
   # or
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. The page will automatically open in your browser at `http://localhost:3000`

### Option 2: Direct File Opening (Simple)

1. Simply double-click `index.html` or right-click and select "Open with" → your preferred browser
2. **Note**: Some features may be limited due to browser security restrictions (CORS) when opening files directly

### Option 3: Using Python HTTP Server

If you have Python installed:

1. **Navigate to the html_template folder**:
   ```bash
   cd html_template
   ```

2. **Start a local server**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

3. Open your browser and go to `http://localhost:8000`

### Option 4: Using Node.js http-server

1. **Install http-server globally** (if not already installed):
   ```bash
   npm install -g http-server
   ```

2. **Navigate to the html_template folder**:
   ```bash
   cd html_template
   ```

3. **Start the server**:
   ```bash
   http-server -p 8000 -o
   ```

4. The page will open automatically in your browser

## 📁 Project Structure

```
html_template/
├── index.html          # Main HTML file
├── style.css          # Custom styles
├── script.js          # JavaScript functionality
├── assets/            # Images and media files
│   ├── hero-campus-golden-light.jpg
│   ├── students-studying-theology.jpg
│   ├── historic-college-building.jpg
│   └── christian-symbol-watermark.png
├── public/            # Public assets (Vite serves from here)
│   └── assets/
├── package.json       # Node.js dependencies
├── vite.config.js     # Vite configuration
└── README.md          # This file
```

## ✨ Features

- **Fully Responsive**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Uses AOS (Animate On Scroll) library
- **Modern Design**: Tailwind CSS for styling
- **Interactive Elements**: Mobile menu, smooth scrolling, animations
- **Beautiful Typography**: Playfair Display and Inter fonts
- **Christian Theme**: Gold and navy blue color scheme

## 🛠️ Technologies Used

- **HTML5**: Structure
- **CSS3**: Custom styling with CSS variables
- **JavaScript**: Interactive functionality
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **AOS Library**: Animate On Scroll animations
- **Lucide Icons**: Modern icon library
- **Vite**: Development server and build tool

## 📝 Notes

- The page uses external CDN resources (Tailwind CSS, Google Fonts, AOS, Lucide Icons)
- An internet connection is required for full functionality
- All images are included in the `assets` folder
- The page is optimized for modern browsers

## 🎨 Customization

You can customize:
- Colors in `style.css` (CSS variables)
- Content in `index.html`
- Animations in `script.js`
- Images in the `assets` folder

## 📧 Contact

For questions or support, please contact the development team.

---

**Madurai Bible College** - Equipping Servant-Leaders Since 1955


