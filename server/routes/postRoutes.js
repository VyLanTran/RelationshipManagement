import express from 'express'
import { getAllPost, getPost, updatePost, deletePost, createPost } from '../controllers/postControllers.js'
import { verifyAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(verifyAuth)

router.get('/', getAllPost)
router.get('/:id', getPost)
router.post('/', createPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)

export default router