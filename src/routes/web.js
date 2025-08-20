const express = require('express');
const homeController = require('../controllers/homeController.js');
const mongoController = require('../controllers/mongoController.js');

const router = express.Router();

const initWebRoutes = (app) => {
    //Default
    router.get('/', (req, res) => {
        return res.send('Pham Danh Huong');
    });
    
    // ====================== SEQUELIZE ROUTES ======================
    router.get('/home', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.getFindAllCrud);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // ====================== MONGODB ROUTES ======================
    router.get('/mongo', mongoController.getMongoHomePage);
    router.get('/mongo/home', mongoController.getMongoHomePage);
    router.get('/mongo/crud', mongoController.getMongoCRUD);
    router.post('/mongo/post-crud', mongoController.postMongoCRUD);
    router.get('/mongo/get-crud', mongoController.getMongoFindAllCrud);
    router.get('/mongo/edit-crud', mongoController.getMongoEditCRUD);
    router.post('/mongo/put-crud', mongoController.putMongoCRUD);
    router.get('/mongo/delete-crud', mongoController.deleteMongoCRUD);
    router.get('/mongo/search', mongoController.searchMongoCRUD);

    // Use the router in the app
    app.use('/', router);
};

module.exports = initWebRoutes;
