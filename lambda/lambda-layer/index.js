const moment = require("moment");
const date = require("/opt/date");

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Lambda!",
      day: date.today(),
      year: moment().format("yyyy"),
    }),
  };
  return response;
};
