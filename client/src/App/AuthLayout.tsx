import { FC, ReactNode, useEffect, useState } from "react";
import { RootState } from "../shared/store";
import { useDispatch, useSelector } from "react-redux";
import { useValidQuery } from "../entities/user";
import { setAuth, setLoading, setToken } from "../entities/user/lib/store/userStore";
import Cookies from "universal-cookie";
import { Spin } from "antd";
const cookies = new Cookies();

interface IProps {
  children: ReactNode;
}

const AuthLayout: FC<IProps> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const token = useSelector((state: RootState) => state.user.token);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const dispatch = useDispatch();

  const { refetch, data } = useValidQuery();

  useEffect(() => {
    if (data) {
      dispatch(setAuth(true));
    }

    if (!token && !data) {
      const CToken = cookies.get("token");
      if (CToken) {
        dispatch(setToken(CToken));
      }
      dispatch(setAuth(false));
    } else if (token && data) {
      dispatch(setAuth(true));
    }

    setTimeout(() => {
      dispatch(setLoading(false));
    }, 300);
  }, [token, data]);

  if (isLoading) {
    return <Spin size={"large"} fullscreen></Spin>;
  }

  return children;
};

export default AuthLayout;
