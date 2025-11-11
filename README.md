# GraphQL Profile - Zone01 Athens

A dynamic, interactive profile page that visualizes your Zone01 learning journey using GraphQL and SVG graphs.

## 🚀 Features

- **Authentication System**: Secure login with JWT tokens
- **Profile Dashboard**: View your user information and statistics
- **Interactive Graphs**:
  - XP Progress Timeline (line chart)
  - Audit Ratio (donut chart)
  - Project Success Rate (bar chart)
  - XP Distribution by Project (horizontal bars)
- **Real-time Data**: Fetched directly from Zone01 GraphQL API
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Valid Zone01 Athens credentials (username/email and password)
- Internet connection

## 🛠️ Installation & Setup

### Option 1: Local Development

1. **Clone or download** this repository to your computer

2. **Navigate** to the project folder

3. **Open with a local server**:

   Using Python:

   ```bash
   # Python 3
   python3 -m http.server 8000

   # Python 2
   python3 -m SimpleHTTPServer 8000
   ```

   Using Node.js (http-server):

   ```bash
   npx http-server -p 8000
   ```

   Using PHP:

   ```bash
   php -S localhost:8000
   ```

4. **Access** the application:
   - Open your browser and go to: `http://localhost:8000`



### Github online page ###
   ```
   https://giannispap29.github.io/graphql_display/profile.html
   ```



## 🔑 How to Use

1. **Open** the application in your browser

2. **Login** with your Zone01 credentials:
   - Enter your username or email
   - Enter your password
   - Click "Sign In"

3. **View your profile**:
   - See your user information
   - Check your statistics (Total XP, Projects, Audits)
   - Explore interactive graphs

4. **Interact with graphs**:
   - Hover over data points to see details
   - View your progress over time
   - Analyze your performance

5. **Logout** when finished:
   - Click the "Logout" button in the header
   - Confirm logout in the modal

## 📁 Project Structure

```
graphql-profile/
├── index.html              # Landing page (redirects based on auth)
├── login.html              # Login page
├── profile.html            # Main profile dashboard
├── css/
│   ├── style.css           # Global styles
│   ├── login.css           # Login page styles
│   ├── profile.css         # Profile page styles
│   └── graphs.css          # Graph styles
├── js/
│   ├── config.js           # API endpoints
│   ├── auth/               # Authentication modules
│   │   ├── auth.js
│   │   ├── jwt.js
│   │   └── storage.js
│   ├── api/                # GraphQL API
│   │   ├── graphql.js
│   │   └── queries.js
│   ├── components/         # UI components
│   │   ├── profile-info.js
│   │   ├── stats-card.js
│   │   └── logout.js
│   ├── graphs/             # SVG graph generators
│   │   ├── svg-builder.js
│   │   ├── xp-timeline.js
│   │   ├── audit-ratio.js
│   │   ├── project-stats.js
│   │   └── xp-by-project.js
│   └── utils/              # Utility functions
│       ├── data-processor.js
│       ├── date-utils.js
│       └── validators.js
└── README.md
```

## 🔒 Security & Privacy

- **JWT Tokens**: Stored securely in browser localStorage
- **Auto-logout**: Tokens expire automatically for security
- **HTTPS**: Always use HTTPS in production
- **No Server**: All processing happens in your browser
- **Your Data**: Only you can see your data (requires login)

## 🌐 API Information

- **Endpoint**: `https://platform.zone01.gr/api/graphql-engine/v1/graphql`
- **Authentication**: Bearer token (JWT)
- **Signin**: `https://platform.zone01.gr/api/auth/signin`

## 🎨 Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Pure CSS3 with CSS Grid & Flexbox
- **Graphs**: Custom SVG generation
- **API**: GraphQL
- **Authentication**: JWT (JSON Web Tokens)

## 🐛 Troubleshooting

### CORS Issues (Local Development)

**Problem**: "CORS policy" error when logging in

- **Solution**: The project is pre-configured with a CORS proxy for development
- The proxy is **automatically enabled** in `js/config.js`
- Just refresh your browser (Ctrl+Shift+R) after starting the server
- **See CORS_SOLUTION.md** for detailed information and alternatives

**For Production**: Disable the proxy by setting `USE_CORS_PROXY: false` in `js/config.js`

### Login Issues

**Problem**: "Invalid credentials" error

- **Solution**: Double-check your username/email and password
- Make sure you're using your Zone01 Athens credentials

**Problem**: "Network error" message

- **Solution**: Check your internet connection
- Try refreshing the page
- Check if Zone01 platform is accessible

### Graph Issues

**Problem**: Graphs not loading or showing "No data"

- **Solution**: Make sure you have completed some projects
- Try logging out and logging back in
- Clear browser cache and try again

### Browser Compatibility

**Problem**: Application not working properly

- **Solution**: Use a modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Enable JavaScript in your browser
- Disable browser extensions that might interfere

### CORS Issues (Local Development)

**Problem**: CORS errors in console

- **Solution**: Use a local server (see Installation steps)
- Don't open HTML files directly (file://)

## 📊 Graph Details

### XP Timeline

- Shows cumulative XP over time
- Hover to see individual project details
- Animated line drawing effect

### Audit Ratio

- Compares audits done vs received
- Displays your audit ratio
- Color-coded status indicator

### Project Success Rate

- Shows passed vs failed projects
- Displays success percentage
- Animated bar growth

### XP by Project

- Top 10 projects by XP earned
- Horizontal bar chart
- Ranked with medals for top 3

## 🔄 Data Updates

- Data is fetched fresh on each login
- Graphs update automatically when data changes
- No manual refresh needed

## 💡 Tips

- **Bookmark** the profile page for quick access
- **Regular audits** improve your audit ratio
- **Track progress** with the XP timeline
- **Mobile friendly** - check your stats on the go

## 📞 Support

For issues with:

- **Zone01 account**: Contact Zone01 Athens support
- **Application bugs**: Check browser console for errors
- **Feature requests**: Document and suggest improvements

## 📜 License

This project is created for educational purposes as part of the Zone01 Athens curriculum.

## 🙏 Acknowledgments

- Zone01 Athens for the GraphQL API
- Zone01 community for feedback and support

---


