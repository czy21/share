import React from "react";
import _ from 'lodash'
import {Space, Table, Dropdown, Menu, Button} from 'antd'
import {DashOutlined} from '@ant-design/icons'
import {PageModel} from "./data";

export interface TableProp {
    list: any[]
    page?: {
        pageIndex?: number,
        pageSize?: number,
        total?: number
    }
    columns: any[]
}

const Index: React.FC<TableProp> = (props: TableProp) => {

    const [page, setPage] = React.useState<PageModel>({pageIndex: 1, pageSize: 10, ...props.page})

    return (
        <div>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Table
                    size={"small"}
                    columns={props.columns?.map((t: any) => _.omit({...t, title: t.header, dataIndex: t.key}, ["key", "header"]))}
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
            </Space>
        </div>
    )
}

export default Index

export const OperationRender = (text: any, record: any, actions: any[]) => (
    <Dropdown
        overlay={
            <Menu>
                {
                    actions.map((t: any) =>
                        <Menu.Item onClick={() => t.onClick(text, record)} key={t.key} icon={(t as any).icon}><span>{t.label}</span></Menu.Item>
                    )
                }
            </Menu>
        }
    >
        <Button icon={<DashOutlined/>} type={"text"} size={"small"}/>
    </Dropdown>

)