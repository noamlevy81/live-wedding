const AWS = require("aws-sdk");

exports.handler = async (event) => {
    if (event['httpMethod'] === 'OPTIONS') {

        return { statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Access-Control-Allow-Headers" : "Content-Type",

            }
        }
    }
    // Get S3 client
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        signatureVersion: 'v4'
    });
    console.log(event)
    // Define S3 bucket and file name
    const bucket = "or-and-noam-wedding-bucket";
    const body = JSON.parse(event['body']);
    const imagePath = body.imagePath;
    const key = "images" + '/' + imagePath;
    const token = body.token;
    if (!imagePath || token !== 'Noam Loves Or') {
        return { statusCode: 403,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Access-Control-Allow-Headers" : "Content-Type",

            },
            body: JSON.stringify(body) };
    }

    // Generate a presigned URL
    const presignedUrl = s3.getSignedUrl("putObject", {
        Bucket: bucket,
        Key: key,
        Expires: 600 // URL expiration time in seconds
    });

    // Return the presigned URL as the response
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Access-Control-Allow-Headers" : "Content-Type",
        },
        body: JSON.stringify({
            presignedUrl: presignedUrl,
            event: event
        }),
    };
};
