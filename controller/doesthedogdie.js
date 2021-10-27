const asyncHandler = require('../middleware/asyncHandler.js')
const ErrorResponse = require('../utils/errorResponse.js')
const constants = require('../utils/constants.js')
const getLatestCategoryData = require('../utils/getLatestCategoryData.js')
const getShortDescData = require('../utils/getShortDescData.js')
const getMediaId = require('../utils/getMediaId.js')
const getShowInfo = require('../utils/getShowInfo.js')

exports.getLatestCategoryData = asyncHandler(async (req, res, next) => {
    try {
        getLatestCategoryData(req.query).then(result => {
            res.status(constants.statusCodes.OK).json(result)
        })
    } catch (error) {
        return next(ErrorResponse(error))
    }
})

exports.getShortDescData = asyncHandler(async (req, res, next) => {
    try {
        getShortDescData(req.query).then(result => {
            res.status(constants.statusCodes.OK).json(result)
        })
    } catch (error) {
        return next(ErrorResponse(error))
    }
})

exports.getMediaId = asyncHandler(async (req, res, next) => {
    try {
        getMediaId(req.query).then(result => {
            res.status(constants.statusCodes.OK).json(result)
        })
    } catch (error) {
        return next(ErrorResponse(error))
    }
})

exports.getShowInfo = asyncHandler(async (req, res, next) => {
    try {
        getShowInfo(req.query).then(result => {
            res.status(constants.statusCodes.OK).json(result)
        })
    } catch (error) {
        return next(ErrorResponse(error))
    }
})