import Mail from '../../lib/Mail';
import 'dotenv/config';

class ForgotPassword {
  get key() {
    return 'ForgotPassword';
  }

  async handle({ data }) {
    const { name, email, token } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Solicitação para troca de senha',
      template: 'forgotPassword',
      context: {
        user: name,
        email,
        token,
        url: process.env.URL_FORGOT_PASSWORD,
      },
    });
  }
}

export default new ForgotPassword();
