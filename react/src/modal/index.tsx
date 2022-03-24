import React from "react";
import {ModalProps, Modal} from 'antd'
import {FormattedMessage} from 'react-intl'

const Index: React.FC<ModalProps> = (props: ModalProps | any) => {
    return (
        <Modal
            width={props.width ?? 800}
            style={props.style}
            destroyOnClose
            title={props.title}
            visible={props.visible}
            onOk={props.onOk}
            okText={<FormattedMessage id={"common.ok"} defaultMessage={""}/>}
            onCancel={props.onCancel}
            cancelText={<FormattedMessage id={"common.cancel"} defaultMessage={""}/>}
            {...props}
        >
            {props.children}
        </Modal>
    );
};

export default Index;
