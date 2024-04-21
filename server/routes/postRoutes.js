import express from 'express'
import { getAllPost, getPost, updatePost, deletePost, createPost } from '../controllers/postControllers.js'

const router = express.Router()

router.get('/', getAllPost)
router.get('/:id', getPost)
router.post('/', createPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)

export default router