import React, { useState } from "react";
import Axios from "axios";
//import { response } from "express";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function LoginPage(props) {
  const dispatch = useDispatch();
  //state 변수 적용하는 부분
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        props.history.push("/");
      } else {
        alert("계정 정보를 다시 확인해주세요.");
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
        Login Page
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
          }}
          onSubmit={onSubmitHandler}
        >
          <label>E-mail : </label>
          <input type="email" value={Email} onChange={onEmailHandler}></input>
          <br />
          <label>Password : </label>
          <input
            type="password"
            value={Password}
            onChange={onPasswordHandler}
          ></input>
          <br></br>
          <button>Login</button>
        </form>
      </div>
    </div>
  );
}

export default withRouter(LoginPage);
