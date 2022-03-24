import React from "react";
import {Button} from "antd";

export interface ButtonProps {
    label: string;
}


const Index: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (<Button>{props.label}</Button>)
}
export default Index;