import React from "react";
import {FormattedMessage} from "react-intl";

export interface FormatMessageProp {
    id: string
}

const Index: React.FC<FormatMessageProp> = (props: FormatMessageProp) => {
    const {id, ...other} = props
    return (<FormattedMessage id={id} {...other}/>);
};
export default Index