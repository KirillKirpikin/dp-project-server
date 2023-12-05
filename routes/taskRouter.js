const Router = require('express');
const router = new Router();
const taskController = require('../controllers/taskController');
const {checkTaskOwnership} = require('../middlewaree/checkUser');

router.get('/:id', taskController.getOne);
router.post('/', taskController.create);
router.put('/:id', taskController.updateOne);
router.delete('/:id', taskController.deleteOne);

module.exports = router;