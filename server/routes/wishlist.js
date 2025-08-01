import {
    getMyWishlist,
    createGift,
    updateGift,
    deleteGift,
    getWishlistByUserId,
    markGift,
    unmarkGift,
} from '../controllers/wishlistController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import express from 'express'
const router = express.Router();
router.use(authMiddleware);
router.get('/', getMyWishlist);
router.post('/', createGift);
router.put('/:id', updateGift);
router.delete('/:id', deleteGift);
router.get('/:id', getWishlistByUserId);
router.post('/:id/mark', markGift);
router.post('/:id/unmark', unmarkGift);
export default router;