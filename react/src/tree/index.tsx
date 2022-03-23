import React from "react";
import {Tree} from 'antd'

export interface TreeProps {
    value?: any[];
    onChange?: (value: any) => void;
}

const Index: React.FC<TreeProps> = ({value, onChange}) => {

    const [options, setOptions] = React.useState<any>(value);

    const onLoadChange = (node: any) => {

        return []
    }

    return (
        <Tree
            height={300}
            checkable
            fieldNames={{"title": "label", "key": "value"}}
            // onSelect={onSelect}
            // onCheck={onCheck}
            treeData={value}
        />
    );
};
export default Index