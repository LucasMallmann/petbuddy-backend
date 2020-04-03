import crypto from 'crypto';
// import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import ForgotPassword from '../jobs/ForgotPassword';
import User from '../models/User';

class ForgotPasswordController {
  async store(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(10).toString('hex');

    user.token = token;
    user.token_created_at = new Date();

    await user.save();

    Queue.add(ForgotPassword.key, {
      name: user.name,
      email,
      token,
    });

    return res.json();
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     newPassword: Yup.string()
  //       .min(6)
  //       .required(),
  //     confirmPassword: Yup.string().when('newPassword', (newPassword, field) =>
  //       newPassword ? field.required().oneOf([Yup.ref('newPassword')]) : field
  //     ),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Validation fails' });
  //   }

  //   const { email, token } = req.query;
  //   const { newPassword, confirmPassword } = req.body;

  //   if (!email || !token) {
  //     return res.status(404).json({ error: true });
  //   }

  //   const user = await User.findOne({ where: { email } });

  //   if (!user) {
  //     return res.status(404).json({ error: 'User not found' });
  //   }
  // }
}

export default new ForgotPasswordController();
