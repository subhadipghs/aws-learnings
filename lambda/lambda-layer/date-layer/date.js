const moment = require("moment");

exports.today = () => moment().format("dddd");
