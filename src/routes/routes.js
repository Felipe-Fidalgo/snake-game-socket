const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('/control', (req, res) => {
    res.render('controle/index.html');
});

module.exports = router;