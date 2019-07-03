const got = require('got');
const AWS = require("aws-sdk");
const FormData = require('form-data');

// If no Lambda Proxy integration, then event = body
function getCode(event) {
    if (event !== null && event !== undefined) {
        if (event.code) {
            return event.code;
        }
    }
    throw new Error('NO CODE');
}

async function retrieveToken(code, redirectUri, clientId, clientSecret, url) {
    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    form.append('redirect_uri', redirectUri);
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);

    const result = await got(url, {body: form});
    console.log(result.body);

    return JSON.parse(result.body).access_token;
}

async function saveToken(accessToken) {
    AWS.config.update({
        region: "ap-northeast-1",
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: "line_auth",
        Item: {
            "access_token": accessToken,
        }
    };

    return await docClient.put(params).promise();
}

exports.handler = async (event) => {
    console.log(event);
    const accessToken = await retrieveToken(
        getCode(event),
        process.env.REDIRECT_URI,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.TOKEN_API_URL
    );

    await saveToken(accessToken);

    return {
        statusCode: 200,
        body: JSON.stringify({success: true}),
    };
};
