const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');


router.get('/', libroController.getAllLibros);


router.post('/', libroController.createLibro);

router.put('/:id', libroController.updateLibro);

router.delete('/:id', libroController.deleteLibro);

module.exports = router;
