import type { APIRoute } from "astro";
import axios from 'axios';

const N8N_WEBHOOK_URL = 'https://n8n.frayze.ca/webhook-test/d685ac24-5d07-43af-8311-bac8fbfe651d';

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    const response = await axios.post(N8N_WEBHOOK_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    
    if (axios.isAxiosError(error)) {
      return new Response(JSON.stringify({
        error: 'Webhook request failed',
        details: error.response?.data || error.message
      }), {
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 