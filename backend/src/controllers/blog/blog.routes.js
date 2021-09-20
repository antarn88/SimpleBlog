const express = require('express');

const controller = require('./blog.controller');

const router = express.Router();

// CREATE
router.post('/', (req, res, next) => controller.create(req, res, next));

// READ
router.get('/:username', (req, res, next) => controller.findOne(req, res, next));

// UPDATE
router.patch('/:username/addPost/:postId', (req, res, next) => controller.addPost(req, res, next));
router.patch('/:username/deletePost/:postId', (req, res, next) => controller.deletePost(req, res, next));

// DELETE
router.delete('/:username', (req, res, next) => controller.delete(req, res, next));

module.exports = router;
