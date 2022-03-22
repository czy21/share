import React from "react";
import {Button} from "antd";

export interface ButtonProps {
    label: string;
}

const Index = (props: ButtonProps) => {
    return <Button>{props.label}</Button>;
};

export default Index;