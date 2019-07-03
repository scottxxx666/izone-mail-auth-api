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

exports.handler = async (event) => {
    console.log(event);
    const code = getCode(event);

    const url = process.env.TOKEN_API_URL;
    const redirectUri = process.env.REDIRECT_URI;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    form.append('redirect_uri', redirectUri);
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);

    const result = await got(url, {body: form});
    console.log(result.body);

    const accessToken = JSON.parse(result.body).access_token;

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

    await docClient.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({success: true}),
    };
};
