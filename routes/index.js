const Router = require('express').Router;
const router = new Router();
const authRouter = require('./authRouter');
const projectRouter = require('./projectRouter');
const taskRouter = require('./taskRouter');

router.use('/auth', authRouter);
router.use('/project', projectRouter);
router.use('/task', taskRouter);

module.exports = router;