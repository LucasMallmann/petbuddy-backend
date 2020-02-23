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
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldEmail: Yup.string().email(),
      newEmail: Yup.string()
        .email()
        .when('oldEmail', (oldEmail, field) =>
          oldEmail ? field.required() : field
        ),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, oldEmail, newEmail, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userId);

    // Check if old email is right
    if (oldEmail && user.email !== oldEmail) {
      return res.status(400).json({ error: 'Old e-mail does not match' });
    }

    // Check if new email is available
    if (newEmail) {
      const checkEmail = await User.findOne({ where: { email: newEmail } });

      if (checkEmail) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    // Check if old password is right
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Old password does not match' });
    }

    const { id, email } = await user.update({
      name: name || user.name,
      email: newEmail || user.email,
      password: password || user.password,
    });

    return res.json({ id, name, email });
  }
}

export default new UserController();
