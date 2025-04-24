import axios from 'axios';

interface SelectionData {
  selections: any[];
  metadata?: Record<string, any>;
}

export const sendSelections = async (data: SelectionData) => {
  try {
    const payload = {
      selections: data.selections,
      metadata: {
        ...data.metadata,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString()
      }
    };

    const response = await axios.post('https://n8n.frayze.ca/webhook/d685ac24-5d07-43af-8311-bac8fbfe651d', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Webhook-Source': 'frayze-stack'
      },
      timeout: 10000
    });

    if (!response.data) {
      throw new Error('No response received from webhook');
    }

    console.log('Webhook response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending webhook:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Webhook request timed out. Please try again.');
      }
      
      if (!error.response) {
        throw new Error('Could not connect to webhook endpoint. Please check your network connection.');
      }
      
      switch (error.response.status) {
        case 404:
          throw new Error('Webhook endpoint not found. Please verify the URL is correct.');
        case 401:
        case 403:
          throw new Error('Access to webhook endpoint denied. Please check your credentials.');
        case 500:
          throw new Error('Webhook server encountered an error. Please try again later.');
        default:
          throw new Error(`Webhook request failed: ${error.response.status} ${error.response.statusText || 'Unknown error'}`);
      }
    }
    
    throw new Error('An unexpected error occurred while sending the webhook');
  }
}; 