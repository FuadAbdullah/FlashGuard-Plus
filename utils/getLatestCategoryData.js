const https = require('https')
const ErrorResponse = require('./errorResponse')
const constants = require('./constants.js')

async function getLatestCategoryData({
    showId
}) {
    // Default showId in case no showId was provided
    if (!showId) showId = process.env.DEFAULT_SHOWID || 13397

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
                resolve(topicIdScrapper(data['topicItemStats']))
            })
        })
        request.on('error', error => reject(error))
        request.end()
    })
}

function topicIdScrapper(array) {
    let topicArray = []
    for (let i = 0; i < array.length; i++) {
        topicArray.push({
            topicID: array[i]['TopicId'],
            hasTopicName: array[i]['topic']['name'],
            doesNotHaveTopicName: array[i]['topic']['notName'],
            keywords: array[i]['topic']['keywords'],
            description: array[i]['topic']['description'],
            questionName: array[i]['topic']['doesName'],
            listName: array[i]['topic']['listName'],
            shortDescription: array[i]['topic']['smmwDescription']
        })
    }
    return topicArray
}

module.exports = getLatestCategoryData