import crypto from 'crypto';
import { subDays, isAfter } from 'date-fns';
import * as Yup from 'yup';

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
      user: user.name,
      email,
      token,
    });

    return res.json();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      password: Yup.string()
        .min(6)
        .required(),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { token, password } = req.body;

    const user = await User.findOne({ where: { token } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subDate = subDays(new Date(), 2);

    if (isAfter(subDate, user.token_created_at)) {
      return res.status(401).json({ error: 'Token invalid' });
    }

    user.token = null;
    user.token_created_at = null;
    user.password = password;

    await user.save();

    return res.json();
  }
}

export default new ForgotPasswordController();
