const Router = require('express');
const router = new Router();
const projectController = require('../controllers/projectController');
const { checkProjectOwnership } = require('../middlewaree/checkUser');

router.get('/', projectController.getAll);
router.get('/user/:id', projectController.getProjectUsers);
router.get('/:id', projectController.getOne);
router.post('/', projectController.create);
router.put('/:id', checkProjectOwnership, projectController.updateOne)
router.delete('/:id', projectController.deleteOne)

module.exports = router;
