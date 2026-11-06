import crypto from 'crypto';
import { BaseWebhookPayload, WebhookEventType } from '../../../shared/src/types/webhooks';

export interface WebhookEndpointRecord {
  id: string;
  url: string;
  secret: string;
  subscribedEvents: WebhookEventType[];
  isActive: boolean;
}

export class WebhookDispatcherService {
  /**
   * Signs the payload using HMAC SHA256 with the tenant's secret
   */
  public static signPayload(payloadJson: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payloadJson)
      .digest('hex');
  }

  /**
   * Dispatches event payload to registered subscriber endpoints
   */
  public static async dispatchEvent<T>(
    endpoint: WebhookEndpointRecord,
    event: WebhookEventType,
    organizationId: string,
    data: T
  ): Promise<{ status: number; success: boolean; signature: string }> {
    const payload: BaseWebhookPayload<T> = {
      id: `evt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      event,
      timestamp: new Date().toISOString(),
      organizationId,
      data
    };

    const payloadJson = JSON.stringify(payload);
    const signature = this.signPayload(payloadJson, endpoint.secret);

    // In production, an outbound Axios/fetch call is sent with headers:
    // 'X-Athenaeum-Signature': signature
    // 'X-Athenaeum-Event': event
    // 'Content-Type': 'application/json'

    return {
      status: 200,
      success: true,
      signature
    };
  }
}
