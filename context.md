# Frayze Build Context

## Project Configuration

### Build Setup
- Framework: Vite + React + TypeScript
- Node.js Version: 18.x
- Build Command: `npm run build`
- Output Directory: `dist`

### Vercel Deployment
- Branch: `fresh-deploy`
- Configuration: `vercel.json`
- Build Settings:
  - Output: Static
  - Framework Preset: Vite
  - Node.js Version: 18.x

## Webhook Implementation

### Webhook Configuration
- Endpoint: `https://n8n.frayze.ca/webhook-test/d685ac24-5d07-43af-8311-bac8fbfe651d`
- Implementation: Vercel Serverless Function
- Location: `/api/webhook/index.ts`

### Data Structure
```typescript
interface SelectionData {
  selections: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    pricing: {
      type: 'monthly' | 'one-time' | 'inquire';
      amount?: number;
      note?: string;
    };
    includes?: string[];
  }>;
  metadata?: {
    totalPrice?: number;
    businessProfile?: {
      businessType: string;
      teamSize: string;
      mainGoal: string;
    };
    contact?: {
      businessName: string;
      contactName: string;
      email: string;
      phone: string;
      website?: string;
      bestTimeToContact: string;
    };
    preferences?: {
      budget: string;
      timeline: string;
      additionalInfo?: string;
    };
    userAgent?: string;
    platform?: string;
    language?: string;
    timezone?: string;
    timestamp?: string;
  };
}
```

### Client-Side Service
Location: `/src/api/webhook.ts`
- Handles sending selections from the frontend
- Includes client-side metadata
- Provides error handling

### Server-Side Handler
Location: `/api/webhook/index.ts`
- Processes incoming requests
- Adds server-side metadata
- Forwards data to n8n
- Includes comprehensive error handling

### Testing the Webhook
To test the webhook implementation:

1. Make selections in the application
2. Check the browser console for success/error messages
3. Monitor the n8n webhook endpoint for incoming data
4. Check Vercel logs for server-side processing

### Development Setup
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Environment Variables
- `WEBHOOK_URL`: Configured in vercel.json
- `NODE_ENV`: Automatically set by Vercel

## Additional Context
[Previous context content...] 