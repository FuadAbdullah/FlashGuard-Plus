const https = require('https')
const ErrorResponse = require('./errorResponse')
const constants = require('./constants.js')
const keywordMatchAnalyzer = require('../utils/keywordMatchAnalyzer.js')

function getShowInfo({
    showId,
    categoryId,
    categoryString
}) {

    // Default showId in case no showId was provided
    if (!showId) showId = process.env.DEFAULT_SHOWID || 'The Good Doctor'
    // Default categoryId in case no categoryId was provided
    if (!categoryId || categoryId.length === 0) categoryId = process.env.DEFAULT_CATEGORY_ID || [167] // Flashing lights as of 11/09/2021
    // categoryString is optional

    const option = {
        hostname: 'www.doesthedogdie.com',
        path: `/media/${showId}`,
        headers: {
            'X-API-KEY': process.env.X_API_KEY,
            'Accept': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        const request = https.request(option, response => {
            // response.setEncoding('utf-8')
            let responseChunk = []
            response.on('data', data => {
                responseChunk.push(data)
            }).on('end', () => {
                let data = JSON.parse(Buffer.concat(responseChunk).toString())
                if (categoryString) {
                    return resolve(categoryKeywordScrapper(data['topicItemStats'], categoryString))
                }
                resolve(categoryScrapper(data['topicItemStats'], categoryId))
            })
        })
        request.on('error', error => reject(error))
        request.end()
    })
}

function categoryScrapper(array, category) {
    let resultArray = []
    for (let i = 0; i < array.length; i++) {
        if (category.includes(array[i]['TopicId'])) {
            resultArray.push({
                ...array[i]
            })
        }
    }
    return resultArray
}

function categoryKeywordScrapper(array, categoryString) {
    let sortingArray = []
    let resultArray = []
    let closeMatch = []
    sortingArray.push(...keywordMatchAnalyzer(categoryString))

    for (let i = 0; i < sortingArray.length; i++) {
        if (sortingArray[i]['percentage'] > 0) {
            closeMatch.push(sortingArray[i])
        }
    }

    closeMatch = closeMatch.sort(compareForSorting)

    for (let i = 0; i < array.length; i++) {
        closeMatch.forEach(value => {
            if (array[i]['TopicId'] === value['topicID']) {
                resultArray.push({
                    ...array[i]
                })
                return
            }
        })
    }

    return resultArray.length === 0 ? {
        error: 'No Data'
    } : resultArray
}

function compareForSorting(a, b) {
    // Sorts the closest match to the top part of the array, descending order
    if (a['percentage'] < b['percentage']) return 1
    if (a['percentage'] > b['percentage']) return -1
    return 0
}

module.exports = getShowInfo