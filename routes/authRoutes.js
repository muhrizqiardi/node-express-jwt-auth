const { Router } = require('express');  
const { loginGet, loginPost, signupGet, signupPost } = require('../controller/authController');

const router = Router();

router.get('/login', loginGet);
router.post('/login', loginPost);
router.get('/signup', signupGet);
router.post('/signup', signupPost);

module.exports = router;