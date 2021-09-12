const express = require('express');

const controller = require('./user.controller');

const router = express.Router();

// CREATE
router.post('/', (req, res, next) => controller.create(req, res, next));

// READ
router.get('/', (req, res, next) => controller.findAll(req, res, next));
router.get('/:username', (req, res, next) => controller.findOne(req, res, next));

// UPDATE
router.patch('/:username', (req, res, next) => controller.update(req, res, next));

// DELETE
router.delete('/:username', (req, res, next) => controller.delete(req, res, next));

module.exports = router;
