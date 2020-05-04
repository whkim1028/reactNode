const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //trim : 빈 공백을 다 없애주는 기능
  },
  password: {
    type: String,
    maxlength: 200,
  },
  role: {
    type: Number, //1 : 관리자, 0 : 일반유저
    default: 0,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  //비밀번호 암호화
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRound, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
}); // user모델에 유저정보를 저장하기 전에 무엇가 작업을 한다는 뜻

userSchema.methods.comparePassword = function (plainPassword, cb) {
  console.log("입력한 비밀번호 : " + plainPassword);
  console.log("암호화 비밀번호 : " + this.password);
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    console.log(isMatch);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 토큰 생성
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  //토큰을 디코드한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 토큰과 디비의 토큰을 비교한다.
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User }; // 다른 곳에서도 user모델을 사용할 수 있게 설정해주는 것
