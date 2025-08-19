# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for the Book Sale Application.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

## Step 2: Configure OAuth 2.0

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:8080` (for your backend)
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:8080`
6. Click "Create"
7. Copy the Client ID (you'll need this for both frontend and backend)

## Step 3: Update Frontend Configuration

1. Open `frontEnd/my-app/src/config.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID:

```javascript
export const config = {
  GOOGLE_CLIENT_ID: 'your-actual-google-client-id-here',
  API_BASE_URL: 'http://localhost:8080',
};
```

## Step 4: Update Backend Configuration

1. Open `bookSaleApplication/src/main/resources/application.properties`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID:

```properties
# Google OAuth Configuration
google.client.id=your-actual-google-client-id-here
```

## Step 5: Install Dependencies

### Frontend
```bash
cd frontEnd/my-app
npm install @react-oauth/google
```

### Backend
The Google OAuth dependencies are already added to `pom.xml`. If you need to rebuild:

```bash
cd bookSaleApplication
mvn clean install
```

## Step 6: Test the Implementation

1. Start the backend server:
   ```bash
   cd bookSaleApplication
   mvn spring-boot:run
   ```

2. Start the frontend development server:
   ```bash
   cd frontEnd/my-app
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`
4. Click "Login" and try the Google authentication

## Features Implemented

### Frontend Features:
- ✅ Google OAuth integration with @react-oauth/google
- ✅ Email validation for login and registration forms
- ✅ Google login button in both login and register modals
- ✅ Proper error handling for authentication failures
- ✅ JWT token storage and management

### Backend Features:
- ✅ Google ID token verification
- ✅ Automatic user creation for new Google users
- ✅ JWT token generation for authenticated users
- ✅ Email validation enforcement
- ✅ Secure authentication endpoints

### Validation Rules:
- ✅ Username must be a valid email address
- ✅ Password must be at least 6 characters for registration
- ✅ Name is required for registration
- ✅ Google users are automatically created with email as username

## Security Notes

1. **Never commit your actual Google Client ID to version control**
2. Use environment variables for production deployments
3. The Google Client ID should be kept secure and not exposed in client-side code for production
4. Consider implementing additional security measures like rate limiting

## Troubleshooting

### Common Issues:

1. **"Invalid ID token" error**: Check that your Google Client ID matches between frontend and backend
2. **CORS errors**: Ensure your backend allows requests from `http://localhost:3000`
3. **"Google authentication failed"**: Verify that the Google+ API is enabled in your Google Cloud Console

### Debug Steps:

1. Check browser console for JavaScript errors
2. Check backend logs for authentication errors
3. Verify Google Client ID is correctly set in both frontend and backend
4. Ensure all required Google APIs are enabled in Google Cloud Console

## Production Deployment

For production deployment:

1. Update the Google Client ID to use your production domain
2. Add your production domain to authorized origins in Google Cloud Console
3. Use environment variables for sensitive configuration
4. Implement proper CORS configuration for your production domain
5. Consider using HTTPS for all authentication flows 