import React from "react";
import {ModalProps, Modal} from 'antd'
import _ from 'lodash'
import intl from "../intl"

const Index: React.FC<ModalProps> = (props: ModalProps | any) => {
    return (
        <Modal
            width={props.width ?? 800}
            style={props.style}
            destroyOnClose
            title={props.title}
            visible={props.visible}
            onOk={props.onOk}
            okText={<intl.FormatMessage id={"common.ok"}/>}
            onCancel={props.onCancel}
            cancelText={<intl.FormatMessage id={"common.cancel"}/>}
            {..._.omit(props, ['children'])}
        >
            {props.children}
        </Modal>
    );
};

export default Index;
