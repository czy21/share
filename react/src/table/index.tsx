import React from "react";
import _ from 'lodash'
import {Button, Dropdown, Menu, Space, Table, TableProps as AntdTableProps} from 'antd'
import {DashOutlined} from '@ant-design/icons'
import {PageModel} from "./data";

export interface ColumnProp {
    key: string
    header: string | any
    primaryKey?: boolean
}

export interface TableProp extends AntdTableProps<any> {
    page?: {
        pageIndex?: number,
        pageSize?: number,
        total?: number
    }
    columns: ColumnProp[]
    list: any[]
}

const Index: React.FC<TableProp> = (props: TableProp) => {

    const [page, setPage] = React.useState<PageModel>(props.page)

    return (
        <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
            <Table
                size={"small"}
                columns={props.columns.map((t: any) => _.omit({...t, title: t.header, dataIndex: t.key}, ["key", "header"]))}
                rowKey={(r: any) => {
                    const k = props.columns.filter(t => t.primaryKey)[0]?.key
                    return k ? r[k] : r.id
                }}
                dataSource={props.list}
                pagination={(page ?? false) && {
                    total: page.total,
                    current: page.pageIndex,
                    pageSize: page.pageSize,
                    showTotal: ((t: any, r: any) => `第 ${r[0]}-${r[1]} 条/总共 ${t} 条`),
                    onChange: (pageIndex, pageSize) => setPage({pageIndex, pageSize})
                }}
                {..._.omit(props, ["page", "list", "columns"])}
            />
        </Space>
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