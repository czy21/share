import React from "react";
import {Button} from "antd";

export interface ButtonProps {
    label: string;
}


const Index: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (<div><Button>{props.label}</Button><p>bushidaoo</p></div>)
}
export default Index;