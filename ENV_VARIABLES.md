# Environment Variables Setup

## Required Environment Variables

Add these to your `.env.local` file and to Vercel Environment Variables:

### Database
```
DATABASE_URL=postgresql://username:password@host/database
```

### NextAuth
```
NEXTAUTH_URL=http://localhost:3000  # or your production URL
NEXTAUTH_SECRET=your-secret-key-here  # generate with: openssl rand -base64 32
```

### Google Gemini AI
```
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key
```
Get from: https://makersuite.google.com/app/apikey

### Vercel Blob Storage
```
BLOB_READ_WRITE_TOKEN=your-blob-token
```
Get from: Vercel Dashboard → Storage → Blob

### Email (Resend)
```
RESEND_API_KEY=your-resend-api-key
```
Get from: https://resend.com/api-keys

### Demo Company ID
```
NEXT_PUBLIC_DEMO_COMPANY_ID=your-company-id-here
```

**How to get your company ID:**
1. Sign up on the app
2. Go to Neon Database
3. Run: `SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE email = 'your@email.com');`
4. Copy the UUID and paste it here

**Or use this company ID:** `0e190270-a874-4f39-a9a5-be0116ecd648`

## Vercel Setup

Add all these variables in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Make sure to add them for:
- ✅ Production
- ✅ Preview
- ✅ Development

