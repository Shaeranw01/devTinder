const AWS = require("aws-sdk");

// Configure AWS credentials and region
AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET,
});

// Create SES instance
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

/**
 * Send an email
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML)
 */
const run = async (subject, body) => {
  const params = {
    Source: "sharan@devtinders.ca", // verified sender
    Destination: {
      ToAddresses: ["sharan.w01@gmail.com"], // recipient
      CcAddresses: [],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `<h1>${body}</h1>`,
          Charset: "UTF-8",
        },
        Text: {
          Data: body,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [],
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result.MessageId);
    return result;
  } catch (err) {
    if (err.code === "MessageRejected") {
      console.error("MessageRejected:", err.message);
      return err;
    }
    console.error("SES Error:", err);
    throw err;
  }
};

module.exports = { run };
