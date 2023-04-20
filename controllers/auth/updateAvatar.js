const fs = require("fs/promises");
const path = require("path");

const { User } = require("../../models/user");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  const uniqAvatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, uniqAvatarName);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", uniqAvatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = updateAvatar;
