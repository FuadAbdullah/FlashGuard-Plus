const https = require('https')
const ErrorResponse = require('./errorResponse')
const constants = require('./constants.js')

async function getMediaId({
    keyword
}) {

    // Default keyword in case no keyword was provided
    if (!keyword) keyword = process.env.DEFAULT_KEYWORD || 'The Good Doctor'

    const encodedKeyword = encodeURI(keyword)
    const option = {
        hostname: 'www.doesthedogdie.com',
        path: `/dddsearch?q=${encodedKeyword}`,
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
                resolve(data['items'][0])
            })
        })
        request.on('error', error => reject(error))
        request.end()
    })
}

module.exports = getMediaId