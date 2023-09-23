const jwt = require("jsonwebtoken");

module.exports = async function (context, req) {
  const secretKey ="jwt-token";
  const payload = {
    username: "nafish",
    role: "admin@test.com",
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: "1 year" });
  context.res = {
    body: { token },
  };
};
