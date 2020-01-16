import Avatar from '../models/Avatar';
import User from '../models/User';

class AvatarController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const avatar = await Avatar.create({
      name,
      path,
    });

    return res.json(avatar);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Avatar.destroy({ where: { id } });

    return res.json();
  }
}

export default new AvatarController();
