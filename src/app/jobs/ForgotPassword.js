import Mail from '../../lib/Mail';
import 'dotenv/config';

class ForgotPassword {
  get key() {
    return 'ForgotPassword';
  }

  async handle({ data }) {
    const { user, email, token } = data;

    await Mail.sendMail({
      to: `${user} <${email}>`,
      subject: 'Solicitação para recuperação de senha',
      template: 'forgotPassword',
      context: {
        user,
        email,
        token,
        url: process.env.URL_FORGOT_PASSWORD,
      },
    });
  }
}

export default new ForgotPassword();
