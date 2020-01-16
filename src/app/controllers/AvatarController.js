import Avatar from '../models/Avatar';
import User from '../models/User';

class AvatarController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const { id, url } = await Avatar.create({
      name,
      path,
    });

    return res.json({ id, url });
  }

  async update(req, res) {
    const user = await User.findByPk(req.userId);

    const userUpdated = await user.update(req.body);

    return res.json(userUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Avatar.destroy({ where: { id } });

    return res.json();
  }
}

export default new AvatarController();
