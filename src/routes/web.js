import express from 'express';
import homeController from '../controllers/homeController.js';

const router = express.Router();

const initWebRoutes = (app) => {
    //Default
    router.get('/', (req, res) => {
        return res.send('Pham Danh Huong');
    });
    // Define routes
    router.get('/home', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.getFindAllCrud);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // Use the router in the app
    app.use('/', router);
};

export default initWebRoutes;
