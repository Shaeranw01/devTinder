const sendSuccess = (res, data = null, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const sendError = (
  res,
  message = "Something went wrong",
  status = 400,
  data = null
) => {
  return res.status(status).json({
    success: false,
    message,
    data,
  });
};

module.exports = { sendSuccess, sendError };
