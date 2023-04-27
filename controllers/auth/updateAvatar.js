const fs = require("fs/promises");
const path = require("path");
var Jimp = require("jimp");

const { User } = require("../../models/user");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;

  const uniqAvatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, uniqAvatarName);

  await fs.rename(tempUpload, resultUpload);

  //змінюємо розмір аватара на 250х250 за допомогою Jimp
  const image = await Jimp.read(resultUpload);
  image.resize(250, 250);
  image.write(resultUpload);

  const avatarURL = path.join("avatars", uniqAvatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = updateAvatar;
