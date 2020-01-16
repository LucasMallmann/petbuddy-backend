import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(404).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(404).json({ error: 'User already exists.' });
    }

    const { id, name } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const { name, oldEmail, newEmail, oldPassword, confirmPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Check if old email is right
    if (oldEmail && user.email !== oldEmail) {
      return res.status(404).json({ error: 'Old e-mail does not match' });
    }

    if (newEmail) {
      const checkEmail = await User.findOne({ where: { email: newEmail } });

      // Check if new email not exist
      if (checkEmail) {
        return res.status(404).json({ error: 'User already exists' });
      }
    }

    // Check if old password is right
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(404).json({ error: 'Old password does not match' });
    }

    await user.update({
      name: name || user.name,
      email: newEmail || user.email,
      password: confirmPassword || user.password,
    });

    return res.json({ ok: true });
  }
}

export default new UserController();
