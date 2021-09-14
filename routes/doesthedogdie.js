const express = require('express')
const router = express.Router()
const {
    getLatestCategoryData,
    getShortDescData,
    getMediaId, getShowInfo
} = require('../controller/doesthedogdie.js')

router.get('/category-data', getLatestCategoryData)
router.get('/short-desc-data', getShortDescData)
router.get('/media-id', getMediaId)
router.get('/show-info', getShowInfo)

module.exports = router