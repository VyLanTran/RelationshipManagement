import express from 'express'
import { getAllPost, getPost, updatePost, deletePost, createPost, addPictures, deletePicture, addMembers } from '../controllers/postControllers.js'
import { verifyAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(verifyAuth)

router.get('/', getAllPost)
router.get('/:id', getPost)
router.post('/', createPost)
router.put('/:id', updatePost)
router.put('/addPictures', addPictures)
router.put('/deletePicture', deletePicture)
router.put('/addMembers', addMembers)
router.delete('/:id', deletePost)

export default router