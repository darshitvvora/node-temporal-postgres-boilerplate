import logger from '../../utils/logger.js';
/**
 * @fileoverview  User Fanout services
 * @author Darshit Vora
 * @class User\Hookshot
 * @extends User
 * @description uses subscription.json
 * @return returns user methods for triggering webhooks
 */
import hookshot from '../../utils/webhook.js';

interface EmailData {
  [key: string]: any;
}

/**
 * Trigger user email
 * @author Darshit Vora
 * @version 0.0.1
 * @function
 * @name upgradeRequestMail
 * @memberof User\Hookshot
 */
export function upgradeRequestMail(emailData: EmailData): Promise<any> | undefined {
  try {
    return hookshot.trigger('email:sendMail', {
      object: 'email',
      event: 'sendMail',
      emailData,
    });
  }
  catch (err) {
    logger.error(err);
    return undefined;
  }
}
