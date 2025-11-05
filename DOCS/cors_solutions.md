# 🔧 CORS Error Solution Guide

## ❌ The Problem

You're seeing this error:

```
Access to fetch at 'https://platform.zone01.gr/api/auth/signin' from origin 'http://localhost:8000'
has been blocked by CORS policy
```

**Why?** The Zone01 server has a CORS configuration issue (duplicate `Access-Control-Allow-Origin` headers).

## ✅ Solution Implemented

I've added a **CORS proxy** to bypass this issue during development.

### What Changed

**js/config.js** now includes:

```javascript
USE_CORS_PROXY: true,  // Automatically toggles off when running on platform.zone01.gr
CORS_PROXY: 'https://proxy.cors.sh/',  // Proxy service
CORS_PROXY_HEADERS: {
  'x-cors-api-key': 'temp_d0e245c728137f6bcc9d7f3cd30b63d9',
},
```

The proxy acts as a middleman that adds proper CORS headers and forwards the Authorization header safely.

## 🚀 How to Use

### Option 1: Using CORS Proxy (Current Setup - ENABLED)

1. **No changes needed** - it's already configured!
2. Run your local server (for example):
   ```bash
   python -m http.server 8000
   ```
3. Login at: http://localhost:8000

**Note:** This uses a free public proxy service ([corsproxy.io](https://corsproxy.io))

### Option 2: Disable Proxy (When Deployed)

When you deploy to a real domain (not localhost), you can disable the proxy:

1. Open `js/config.js`
2. Change:
   ```javascript
   USE_CORS_PROXY: false,  // Changed from true to false
   ```
3. Save and deploy

**Why?** The CORS issue only affects localhost. Real domains usually work fine.

## 🌐 Alternative CORS Proxies

If `proxy.cors.sh` is slow or down, you can use alternatives by editing `CORS_PROXY`:

### Update `js/config.js`:

**Option A: AllOrigins**

```javascript
CORS_PROXY: 'https://api.allorigins.win/raw?url=',
CORS_PROXY_ENCODE_URI: true,
CORS_PROXY_HEADERS: {},
```

**Option B: CORS Anywhere (if available)**

```javascript
CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
CORS_PROXY_ENCODE_URI: false,
```

**Option C: Your Own Proxy**
If you want to run your own proxy:

```bash
npx cors-anywhere
```

Then use:

```javascript
CORS_PROXY: 'http://localhost:8080/',
CORS_PROXY_ENCODE_URI: false,
CORS_PROXY_HEADERS: {},
```

## 🏠 Better Local Development Setup

### Using Browser Extension (Recommended for Development)

Install a CORS extension for your browser:

**Chrome/Edge:**

- "CORS Unblock" extension
- "Allow CORS: Access-Control-Allow-Origin"

**Firefox:**

- "CORS Everywhere"

**Steps:**

1. Install extension
2. Enable it
3. Set `USE_CORS_PROXY: false` in config.js
4. Reload page

⚠️ **Remember to disable the extension after development!**

## 🌍 Production Deployment

When deploying to production (GitHub Pages, Netlify, etc.):

1. **Set proxy to false**:

   ```javascript
   USE_CORS_PROXY: false,
   ```

2. **Deploy normally** - CORS issues usually don't occur on real domains

3. **If CORS persists**, contact Zone01 support about the server-side issue

## 🔍 Testing the Fix

1. **Restart your server**:

   ```bash
   # Stop current server (Ctrl+C)
   python -m http.server 8000
   ```

2. **Hard refresh browser**:
   - Chrome/Edge: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Firefox: `Ctrl + F5` or `Cmd + Shift + R`

3. **Try logging in** with your Zone01 credentials

4. **Check browser console** (F12) for any errors

## 📊 Expected Behavior

✅ **With proxy enabled:**

- Login should work
- Data loads successfully
- Graphs display properly
- Slight delay due to proxy

✅ **With proxy disabled (production):**

- Faster performance
- Direct API communication
- No middleman

## 🐛 Troubleshooting

### "Failed to fetch" still appearing?

**Try:**

1. Clear browser cache
2. Use incognito/private window
3. Try different browser
4. Check internet connection
5. Verify credentials are correct

### Proxy not working?

**Try:**

1. Use alternative proxy (see options above)
2. Wait a moment (public proxies can be slow)
3. Check if proxy service is online
4. Use browser extension instead

### Login works but graphs don't load?

**Check:**

1. Browser console for errors (F12)
2. JWT token was saved (check localStorage in DevTools)
3. GraphQL queries are using proxy too (they should automatically)

## 💡 Understanding the Issue

The CORS error happens because:

1. Your browser runs code from `http://localhost:8000`
2. Code tries to fetch from `https://platform.zone01.gr`
3. Browser asks: "Is this allowed?"
4. Server responds with **broken CORS headers** (duplicate values)
5. Browser blocks the request for security

**The proxy solves this by:**

- Acting as a middleman
- Making the request on your behalf
- Adding proper CORS headers
- Returning data to your browser

## 📞 Still Having Issues?

If none of these solutions work:

1. **Check console** (F12) for detailed error messages
2. **Test API directly**: Try the signin endpoint in a tool like Postman
3. **Contact Zone01**: Report the server-side CORS issue
4. **Use browser extension**: Easiest temporary solution

## ✨ Summary

**For Development (localhost):**

- ✅ Use CORS proxy (already enabled)
- ✅ Or use browser extension

**For Production (deployed):**

- ✅ Disable proxy (set `USE_CORS_PROXY: false`)
- ✅ Deploy normally

The fix is already applied - just refresh your browser and try again! 🚀
