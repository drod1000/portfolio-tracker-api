import { Service } from 'typedi';
import sgMail from '@sendgrid/mail';
require('dotenv').config();

@Service()
class SendgridService {
  constructor()
  {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendTemplateMessage(templateId: string, templateData: object) {
    const msg = {
      to: process.env.USER_EMAIL,
      from: process.env.USER_EMAIL,
      template_id: templateId,
      "dynamic_template_data": templateData
    };

    return sgMail.send(msg);
  }
}

export default SendgridService