import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selections, metadata } = request.body;
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      return response.status(500).json({ error: 'Webhook URL not configured' });
    }

    const webhookData = {
      selections,
      metadata: {
        ...metadata,
        serverTimestamp: new Date().toISOString(),
        source: 'frayze-build',
        environment: process.env.NODE_ENV,
      },
    };

    console.log('Sending webhook data:', JSON.stringify(webhookData, null, 2));

    const webhookResponse = await axios.post(webhookUrl, webhookData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 second timeout
    });

    console.log('Webhook response:', webhookResponse.data);

    return response.status(200).json({
      success: true,
      message: 'Webhook sent successfully',
      data: webhookResponse.data,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    
    if (axios.isAxiosError(error)) {
      return response.status(error.response?.status || 500).json({
        error: 'Failed to process webhook',
        details: error.response?.data || error.message,
        status: error.response?.status,
      });
    }

    return response.status(500).json({
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 