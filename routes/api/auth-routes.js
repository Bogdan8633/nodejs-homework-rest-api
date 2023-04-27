const express = require("express");

const ctrl = require("../../controllers/auth");

const { validateBody } = require("../../utils");

const { authenticate, upload } = require("../../middlewares");

const { schemas } = require("../../models/user");

const router = express.Router();

//ствоюємо маршрут для реєстрації (signup)
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

//ствоюємо маршрут для логінізації (signin)
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

//створюємо маршрут для повернення залогіненого користувача при рефреші
router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/:userId/subscription",
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.changeSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
