import { Router } from 'express';
import * as productController from '../controllers/product.controller';

const router = Router();

router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/products', productController.store);
router.put('/products/:id', productController.update);
router.patch('/products/:id', productController.patch);
router.delete('/products/:id', productController.destroy);

export default router;
