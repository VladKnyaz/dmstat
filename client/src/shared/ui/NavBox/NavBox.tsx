import  { FC, ReactNode } from "react";
import { Card } from "antd";
import { ENavBox } from "./types";

interface INavBox {
  children: ReactNode | string;
  nameBox: ENavBox;
  boxActive: ENavBox;
}

const NavBox: FC<INavBox> = ({ children, nameBox, boxActive }) => {
  return (
    <Card
      style={{
        display: boxActive === nameBox ? "block" : "none",
        width: "100%",
      }}
    >
      {children}
    </Card>
  );
};

export { NavBox };
