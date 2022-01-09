const jwt = require("jsonwebtoken");

const verifyAccessToken = async (Access_Token) => {
  //console.log(token);

  try {
    if (!Access_Token) {
        const user = { username: 'GUEST' };

        return user;
    } else {
      const decrypt = await jwt.verify(
        Access_Token,
        process.env.ACCESS_TOKEN_SECRET
      );

        const user = decrypt.user;

        return user;
    }
    //console.log(req.user);
    return 1;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { verifyAccessToken };