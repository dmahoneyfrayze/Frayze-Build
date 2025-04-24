# Frayze Build Context

## Webhook Implementation

The application includes a webhook system that sends selection data to an n8n endpoint. Here's how it works:

### Webhook Configuration
- Endpoint: `https://n8n.frayze.ca/webhook-test/d685ac24-5d07-43af-8311-bac8fbfe651d`
- Implementation: Vercel Serverless Function
- Location: `/api/webhook/index.ts`

### Data Structure
```typescript
interface SelectionData {
  selections: any[];
  metadata?: {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
    // Additional custom metadata
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

### Environment Variables
- `WEBHOOK_URL`: Configured in vercel.json
- `NODE_ENV`: Automatically set by Vercel

## Additional Context
[Previous context content...] 