const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewaree/authMiddleware');
const {check} = require('express-validator');

router.post('/registration', [
    check('email', 'Неверный email').isEmail(),
    check('password', 'Пароль должен быть меньше 5 символов').isLength({min:4}),
], authController.registration);
router.post('/login', authController.login);
router.get('/', authMiddleware, authController.check);

module.exports = router;
