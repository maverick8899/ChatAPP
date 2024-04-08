const router = require('express').Router();
const authController = require('../../controllers/Auth.controller');
const limitRequest = require('../../middleWares/limit_req.mw');

const checkManager = authController.checkRole('manager');
const checkAdmin = authController.checkRole('admin');
//

router.get('/test', (req, res, next) => {
    res.json('hey guys. olala');
});

router
    .route('/register')
    .get((req, res) => {
        // res.render('register', { layout: 'main' });
        res.json('hey guys');
    })
    .post(limitRequest(2), authController.register);

router.route('/verifyOTP').post(authController.verifyOTP);
router.post(
    '/login', //authController.securityAPI,
    authController.login,
);
//Authorization
// router.get('/home', authController.checkLogin, (req, res) => {
//     res.render('home', { layout: 'home' });
// });
//
router.get(
    '/manager',
    authController.checkLogin,
    checkManager,
    authController.renderByRole('manager'),
);
router.get('/admin', authController.checkLogin, checkAdmin, authController.renderByRole('admin'));
router.get(
    '/refreshToken',
    // authController.securityAPI,
    authController.refreshToken,
);
router.get(
    '/data',
    authController.securityAPI,
    authController.verifyAccessToken,
    authController.getLists,
);

router.post('/logout', authController.logout);

module.exports = router;
