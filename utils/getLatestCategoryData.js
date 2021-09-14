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

    let responseChunk = []
    let data

    const request = https.request(option, (response) => {
        response.on('data', data => {
            responseChunk.push(data)
        }).on('end', async () => {
            data = JSON.parse(Buffer.concat(responseChunk).toString())
            data = topicIdScrapper(data['topicItemStats'])
        })

        response.on('error', error => {
            return new Promise((_, reject) => {
                reject(error)
            })
        })
    })

    request.on('error', error => {
        return new Promise((_, reject) => {
            reject(error)
        })
    })

    request.end()

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!data) {
                return reject(ErrorResponse(null, constants.statusCodes.SERVICEUNAVAILABLE, constants.errorCodes.E0001, 'API failed to provide data on time'))
            }
            resolve(data)
        }, 2500)
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