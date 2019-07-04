const line = require('./line')
const dao = require('./dao')

// If no Lambda Proxy integration, then event = body
function getCode(event) {
    if (event !== null && event !== undefined) {
        if (event.code) {
            return event.code;
        }
    }
    throw new Error('NO CODE');
}

exports.handler = async (event) => {
    console.log(event);
    const accessToken = await line.retrieveToken(
        getCode(event),
        process.env.REDIRECT_URI,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.TOKEN_API_URL
    );

    await dao.saveToken(accessToken);

    return {
        statusCode: 200,
        body: JSON.stringify({success: true}),
    };
};
