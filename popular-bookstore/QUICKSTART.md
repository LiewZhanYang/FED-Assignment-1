# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation & Running

### Step 1: Install Dependencies
```bash
cd popular-bookstore
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

The application will automatically open at `http://localhost:4200`

### Step 3: Build for Production (Optional)
```bash
npm run build
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests

## First Time Setup Tips

1. **If you encounter PowerShell execution policy errors:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **If port 4200 is already in use:**
   ```bash
   npm start -- --port 4201
   ```

3. **If you see dependency errors:**
   ```bash
   npm cache clean --force
   npm install
   ```

## Project Features

✅ Fully functional shopping cart
✅ Product browsing and search
✅ Responsive design (mobile, tablet, desktop)
✅ Checkout with form validation
✅ Toast notifications
✅ Persistent cart storage
✅ Modern UI with animations

## Next Steps

- Explore the codebase in `src/app/`
- Customize products in `product.service.ts`
- Modify styles in component CSS files
- Add new pages by creating components in `src/app/pages/`

## Need Help?

Check the main README.md for detailed documentation.

---

**Ready to code! 💻**
