import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
//import { response } from "express";
import { withRouter } from "react-router-dom";

function RegisterPage(props) {
  const dispatch = useDispatch();
  //state 변수 적용하는 부분
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onPasswordConfirmHandler = (event) => {
    setPasswordConfirm(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }

    let body = {
      email: email,
      password: password,
      name: name,
    };

    dispatch(registerUser(body)).then((response) => {
      console.log(response.payload);
      if (response.payload.joinSuccess) {
        alert("가입을 축하합니다.");
        props.history.push("/");
      } else {
        console.log(response);
        if (response.payload.message == "preUser") {
          return alert("기존 회원입니다.");
        } else {
          return alert("회원가입에 실패하였습니다.");
        }
      }
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          fontWeight: "900",
          fontSize: "30px",
        }}
      >
        Register Page
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
            flexDirection: "column",
          }}
          onSubmit={onSubmitHandler}
        >
          <label>E-mail : </label>
          <input type="email" value={email} onChange={onEmailHandler}></input>
          <br />
          <label>Name : </label>
          <input type="text" value={name} onChange={onNameHandler}></input>
          <br />
          <label>Password : </label>
          <input
            type="password"
            value={password}
            onChange={onPasswordHandler}
          ></input>
          <br />
          <label>Password confirm : </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={onPasswordConfirmHandler}
          ></input>
          <br />
          <button>Register</button>
        </form>
      </div>
    </div>
  );
}

export default withRouter(RegisterPage);
