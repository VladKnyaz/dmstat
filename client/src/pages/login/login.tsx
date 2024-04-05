import { FC, useEffect, useState } from "react";

import "./login.scss";
import { Input, Button, Flex, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../entities/user/lib/store/userStore";
import { useLoginMutation } from "../../entities/user";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const LoginPage: FC = () => {
  // const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const dispatch = useDispatch();
  const navig = useNavigate();
  const [pass, setPass] = useState<string>("");
  const [fetch, { isLoading, data, error }] = useLoginMutation();

  function login() {
    fetch(pass);
  }

  useEffect(() => {
    if (error) {
      //@ts-ignore
      message.error({ content: error.error, duration: 1 });
    }

    if (data) {
      if (data.message && data.status > 290) {
        message.error({ content: data.message, duration: 1 });
        return;
      }
      if (data.token) {
        cookies.set("token", data.token);
        message.success({ content: "Вы вошли", duration: 1 });
        navig("/");
        dispatch(setAuth(true));
      }
    }
  }, [data, error]);

  return (
    <>
      <div className="login-page">
        <div className="container">
          <form className="form">
            <Flex gap={10} vertical>
              <Input
                type="text"
                placeholder="Введите пароль"
                onChange={(e) => setPass(e.target.value)}
              />
              <Button loading={isLoading} onClick={login}>
                Войти
              </Button>
            </Flex>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
