const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");

//mongoose 데이터베이스 연결
mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose Connected"))
  .catch(() => console.log("conntect false"));

//++++++++++데이터를 정상적으로 가져오기 필요한 옵션+++++++++++
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
//++++++++++데이터를 정상적으로 가져오기 필요한 옵션+++++++++++

app.get("/", (req, res) => res.send("hello world11 새해복 많이 받으세요"));

app.post("/api/user/register", (req, res) => {
  //회원가입할 때 필요한 정보 들을 클라이언트에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);
  //요청된 이메일을 데이터베이스에서 조회
  User.findOne({ email: req.body.email }, (err, preUser) => {
    if (preUser) {
      return res.json({
        joinSuccess: false,
        message: "preUser",
      });
    } else {
      console.log(user);
      user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
          joinSuccess: true,
          userInfo: userInfo,
        });
      });
    }
    console.log("user:", user);
  });
});

app.post("/api/user/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 조회
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다. ",
      });
    }

    console.log("user:", user);

    //요청한 이메일의 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log(isMatch);
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
    });
    //비밀번호까지 맞다면 토큰 생성
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      //토큰을 저장한다. 어디에? 쿠키 , 로컬스토리지 -> 여기에선 쿠키에 저장함
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    });
  });
});

app.get("/api/user/auth", auth, (req, res) => {
  console.log(req.user);
  return res.status(200).send({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/hello", (req, res) => {
  let sum = 20 + 30;

  res.status(200).json({
    massage: "안녕하세요.",
    num: sum,
    auth: "김완희",
  });
});

//로그아웃 라우터
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`example app listening on port ${port}!`));
