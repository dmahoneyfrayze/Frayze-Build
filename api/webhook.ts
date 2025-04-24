import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    console.log('Received webhook data:', data);

    // Process the webhook data
    const workflow_data = {
      selections: data,
      timestamp: new Date().toISOString(),
    };

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Webhook received successfully',
      data: workflow_data,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing webhook',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 