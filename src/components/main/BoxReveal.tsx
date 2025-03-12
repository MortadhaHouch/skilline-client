import React from "react";
import { BoxReveal as BoxRevealComponent } from "../ui/box-reveal"
export function BoxReveal({children}:{children:React.ReactElement}) {
  return (
    <BoxRevealComponent boxColor={"#5046e6"} duration={0.5}>
        {children}
    </BoxRevealComponent>
  );
}