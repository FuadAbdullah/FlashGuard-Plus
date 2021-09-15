const https = require('https')
const ErrorResponse = require('./errorResponse')
const constants = require('./constants.js')

async function getShortDescData({
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
                resolve(shortDescScrapper(data['topicItemStats']))
            })
        })
        request.on('error', error => reject(error))
        request.end()
    })
}

function shortDescScrapper(array) {
    let shortDescArray = []
    for (let i = 0; i < array.length; i++) {
        shortDescArray.push({
            topicID: array[i]['TopicId'],
            shortDescription: array[i]['topic']['smmwDescription']
        })
    }
    return shortDescArray
}

module.exports = getShortDescData