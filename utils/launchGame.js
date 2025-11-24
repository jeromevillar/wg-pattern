const axios = require('axios');

exports.getLaunchUrl = async (gameId) => {
    try {
        const response = await axios.post('https://wg.com/api/ylgy/v1/proxy/enterWebTryGame', {
            gameId: gameId
        }, {
            headers: {
            'Content-Type': 'application/json'
            }
        });

        //console.log("✅ Response received:", response.data);

        return response.data.data;
        } catch (error) {
        console.error("❌ Request failed:", error.message);
        if (error.response) {
            console.error("🔍 Server response:", error.response.data);
        }
    }
}