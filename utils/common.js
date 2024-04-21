const axios = require('axios');

async function callAPI(endpoint, method = 'GET', body = null) {
    try {
        const headers = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        };
        const response = await axios({
            method: method,
            url: endpoint,
            data: body,
            headers: headers
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error('Error while making API call:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    callAPI
}