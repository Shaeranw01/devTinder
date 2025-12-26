// Purpose:
// sesClient.js is a helper function that creates an Amazon Simple Email Services (Amazon SES) service client.

// snippet-start:[ses.JavaScript.createclientv3]
const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET,
  },
});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
