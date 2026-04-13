# Vercel Deployment Guide

## Prerequisites
- GitHub account (to push your code)
- Vercel account (Sign up at https://vercel.com)

## Deployment Steps

### 1. Push to GitHub
```bash
cd "CHATBOT NEW"
git add .
git commit -m "Add Vercel configuration"
git push
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Vercel will auto-detect the configuration:
   - **Framework**: Vite
   - **Root Directory**: project
   - **Build Command**: npm run build
5. Click "Deploy"

### 3. Configure Environment Variables (if needed)
In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add any necessary environment variables (currently none required for basic setup)
3. Redeploy if changes are made

### 4. Verify Deployment
- Your site will be live at `https://your-project-name.vercel.app`
- Test the API: `https://your-project-name.vercel.app/api/health`
- Test the chat: Make a request to `/api/chat`

## Troubleshooting

### Issue: Build fails
- Check that all dependencies are in `package.json`
- Verify the build command is correct
- Check Vercel build logs for specific errors

### Issue: API doesn't work
- Ensure the frontend is calling `/api/chat` (not `localhost:8787`)
- Check the Network tab in browser DevTools
- Review Vercel Function logs

### Issue: CORS errors
- CORS is already configured in the API handler
- If issues persist, check browser console for detailed errors

## Local Testing Before Deployment
```bash
cd project
npm install
npm run build
npm run preview
```

This will build and preview your app locally before deploying.
