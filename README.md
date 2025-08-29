This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. **Set up UploadThing** (Required for image uploads):
   - Sign up at [UploadThing Dashboard](https://uploadthing.com/dashboard)
   - Create a new app and get your API token
   - Replace `your_uploadthing_token_here` in `.env.local` with your actual UploadThing token:
   ```bash
   UPLOADTHING_TOKEN=sk_live_...
   ```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Image Upload

This application includes image upload functionality using UploadThing for:

- **Stall Images**: Upload images when creating or editing stalls
- **Zone Images**: Upload images when creating or editing zones

The image upload component supports:

- Drag & drop file upload
- Direct URL input
- Image preview
- File validation (images only, max 4MB)
- Integration with UploadThing cloud storage

## Project Structure

```
app/
├── api/uploadthing/     # UploadThing API routes
│   ├── core.ts         # File router configuration
│   └── route.ts        # API route handler
components/
├── ui/
│   └── image-upload.tsx # Custom image upload component
└── ...                 # Other components
lib/
├── uploadthing.ts      # UploadThing utilities
└── ...                 # Other utilities
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
