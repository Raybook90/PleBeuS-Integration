const express = require('express');
const router = express.Router();
const multer = require('multer');
const policyController = require('../controller/policy-controller');
const transactionController = require('../controller/transaction-controller');
const userController = require('../controller/user-controller');


const upload = multer();

/* GET home page. */
router.get('/', (req, res) => res.status(200).render('index'));
router.get('/policies/:username', policyController.listPolicies);
router.get('/blockchains', policyController.listBlockchains);
router.get('/policy', policyController.editPolicy);
router.get('/api/user-not-exist-check/:username', userController.checkIfUserDoesNotExist);
router.get('/api/blockchain-cost/:blockchain/:currency', transactionController.getBlockchainCost);
router.get('/api/stats/:username', userController.getUserStats);

router.get('/api/test', function(req, res){
    res.send('Hello World')
});

router.get('/api/policies/:username', (req, res, next) => {
    req.isJsonRequest = true;
    next();
}, policyController.listPolicies);
router.get('*', (req, res) => {
    res.redirect('/');
});

router.post('/api/policies', policyController.savePolicy);
router.delete('/api/policy/:id', policyController.deletePolicy);
router.post('/api/transactions', upload.single('xlsxFile'), transactionController.handleTransaction);
;

module.exports = router;
