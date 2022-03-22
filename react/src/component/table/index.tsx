import React from "react";
import lodash from 'lodash'
import * as antd from 'antd'
import * as icon from '@ant-design/icons'
import {PageModel} from "./data";

export interface TableProp {
    list: any[]
    page?: {
        pageIndex?: number,
        pageSize?: number,
        total?: number
    }
    columns: any[]
    filter?: any
    extension?: any
}

const Index: React.FC<TableProp> = (props: TableProp) => {

    const [page, setPage] = React.useState<PageModel>({pageIndex: 1, pageSize: 10, ...props.page})

    return (
        <div>
            <antd.Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                {props.filter}
                {props.extension}
                <antd.Table
                    size={"small"}
                    columns={props.columns?.map((t: any) => lodash.omit({...t, title: t.header, dataIndex: t.key}, ["key", "header"]))}
                    rowKey={(r: any) => r.id}
                    dataSource={props.list}
                    pagination={page && {
                        total: page?.total,
                        current: page?.pageIndex,
                        pageSize: page?.pageSize,
                        showTotal: ((t: any, r: any) => `第 ${r[0]}-${r[1]} 条/总共 ${t} 条`),
                        onChange: (pageIndex, pageSize) => setPage({pageIndex, pageSize})
                    }}
                />
            </antd.Space>
        </div>
    )
}

export default Index

export const OperationRender = (text: any, record: any, actions: any[]) => (
    <antd.Dropdown
        overlay={
            <antd.Menu>
                {
                    actions.map((t: any) =>
                        <antd.Menu.Item onClick={() => t.onClick(text, record)} key={t.key} icon={(t as any).icon}><span>{t.label}</span></antd.Menu.Item>
                    )
                }
            </antd.Menu>
        }
    >
        <antd.Button icon={<icon.DashOutlined/>} type={"text"} size={"small"}/>
    </antd.Dropdown>

)