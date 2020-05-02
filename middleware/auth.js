const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증 처리 하는 곳
  //클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;

  //토큰을 복호화 하여 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); // 미들웨어에서 처리완료되면 다음 단계로 진행할 수 있도록 하는 펑션. 이게 없으면 미들웨어에서 계속 머무른다.
  });
  //유저가 있으면 인증 오케이, 유저가 없으면 인증 실패
};

module.exports = { auth };
