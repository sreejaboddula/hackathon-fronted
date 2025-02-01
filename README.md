# SkillBridge Frontend

A Next.js-based frontend application for the SkillBridge platform, featuring a multi-step registration process with document verification and skill assessment.

## Features

- Multi-step registration form
- OTP verification for phone numbers
- Document upload (Aadhaar card)
- Skills selection and verification video upload
- Modern UI with Tailwind CSS
- Form validation using Zod and React Hook Form
- TypeScript support

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd skillbridge-frontend22
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   └── forms/             # Form components
│       ├── BasicInfoForm.tsx
│       ├── DocumentInfoForm.tsx
│       └── SkillInfoForm.tsx
├── lib/
│   └── api.ts            # API service
└── types/
    └── auth.ts           # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
