import logger from '../../utils/logger.js';
/**
 * @fileoverview  User Fanout services
 * @author Darshit Vora
 * @class User\Hookshot
 * @extends User
 * @description uses subscription.json
 * @return {object} returns user methods for triggering webhooks
 */
import hookshot from '../../utils/webhook.js';

/**
 * Trigger user email
 * @author Darshit Vora
 * @version 0.0.1
 * @function
 * @name upgradeRequestMail
 * @memberof User\Hookshot
 */
export function upgradeRequestMail(emailData) {
  try {
    return hookshot.trigger('email:sendMail', {
      object: 'email',
      event: 'sendMail',
      emailData,
    });
  }
  catch (err) {
    return logger.error(err);
  }
}
