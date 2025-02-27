const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const { User } = require("../../models/user");

const { HttpError, sendEmail } = require("../../helpers");

const { BASE_URL } = process.env;

//СТВОРЮЄМО КОНТРОЛЛЕР ДЛЯ РЕЄСТРАЦІЇ КОРИСТУВАЧА
const register = async (req, res) => {
  //1 перевіряємо чи немає вже в базі користувача з такою ж електронною поштою
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //1 Якщо в базі вже є такий користувач то викидуэмо помилку
  if (user) {
    throw HttpError(409, "Email in use");
  }

  //2 перед тим як зберегти пароль в базу ми його хешуємо для того щоб він візуально був прихований (захешований)
  const hashPassword = await bcrypt.hash(password, 10);

  //видаємо дефолтну аватарку для користувача який не додав свою особисто
  const avatarURL = gravatar.url(email);

  //створюємо verification token
  const verificationToken = nanoid();

  //1 Якщо в базі немає такого користувача то ми створюємо його
  //2 Записуємо для користувача пароль в захешованому вигляді
  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  //створюємо лист для веріфікації пошти
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  //Отримуємо выдповідь з бази про створення нового користувача та повертаємо email новоствореного користувача
  res.status(201).json({
    email: result.email,
    subscription: result.subscription,
  });
};

module.exports = register;
