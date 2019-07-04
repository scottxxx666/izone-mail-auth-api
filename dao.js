const AWS = require("aws-sdk");

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

module.exports = {
    saveToken: saveToken
}
