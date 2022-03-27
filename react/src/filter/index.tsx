import React from "react";
import _ from 'lodash'
import {Button, Col, Dropdown, Input, Menu, message, Row, Space, Tag} from 'antd'
import util from '../util'

export interface FilterItemProp {
    key: string
    label: string
}

export interface FilterProp {
    filters: FilterItemProp[]
    onSearch: (query?: any) => void
    page?: {
        pageIndex?: number,
        pageSize?: number,
        total?: number
    }
}

export interface TagValue {
    label: string,
    value?: any
}

const defaultCurrent: any = ["", undefined]
const defaultTag = {}
const Index: React.FC<FilterProp> = (props: FilterProp) => {
    const [current, setCurrent] = React.useState<[string, any]>(defaultCurrent)
    const [tag, setTag] = React.useState<any>(defaultTag)
    const [menuVisible, setMenuVisible] = React.useState<boolean>()

    const putTag = (value: {}) => {
        setTag({...tag, ...value})
    }

    const removeTag = (key: string) => {
        if (current[0] === key) {
            clearCurrent()
        }
        setTag(_.omit(tag, [key]))
        inputRef.current.focus()
    }

    const renderTag = () => {
        return ((Object.entries(tag) as any[])
            .map(([k, v]) => {
                return (
                    <Tag
                        key={k}
                        color={k === current[0] ? "#87d068" : "default"}
                        style={{fontSize: "14px"}}
                        closable={true}
                        onClick={() => {
                            setCurrent([k, v.value])
                            inputRef.current.focus()
                        }}
                        onClose={() => removeTag(k)}
                    >
                        {[v.label, v.value].join(":")}
                    </Tag>
                )
            }))
    }

    const validateTag = (): boolean => {
        let validateRules: string = _.filter(tag, (v: TagValue, k) => _.isEmpty(v?.value)).map(t => t.label).join(",")
        if (validateRules) {
            message.warn([validateRules, "不能为空"].join(" ")).then(r => {
            })
        }
        return _.isEmpty(validateRules)
    }

    const transformTagToQuery = (query: any): {} => {
        return {...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, (v as TagValue)?.value])), ...props.page}
    }

    const renderFilter = () => {
        return (
            <Menu
                onClick={({item, key, keyPath, domEvent}) => {
                    let tagValue: any = tag[key]?.value;
                    setCurrent([key, tagValue])
                    putTag({
                        [key]: {
                            label: (props.filters.filter(t => t.key === key)[0]).label,
                            value: tagValue
                        } as TagValue
                    })
                    inputRef.current.focus()
                    setMenuVisible(false)
                }}>
                {props.filters.map(t => (<Menu.Item key={t.key}>{t.label}</Menu.Item>))}
            </Menu>
        )
    }

    const clearCurrent = () => {
        setCurrent(defaultCurrent)
    }
    const clearTag = () => {
        setTag(defaultTag)
    }
    const inputRef = React.useRef<any>()

    return (
        <Row gutter={8}>
            <Col span={22}>
                <div className={util.style.getGlobalPrefix() + "-filter-wrapper"}>
                    <div className={util.style.getGlobalPrefix() + "-filter-content"}>
                        {renderTag()}
                        <Dropdown
                            overlay={renderFilter()}
                            overlayStyle={{minWidth: "160px"}}
                            trigger={['click']}
                            visible={menuVisible}
                            onVisibleChange={setMenuVisible}
                        >
                            <Input
                                ref={inputRef}
                                type={"text"}
                                value={current[1]}
                                autoComplete={"off"}
                                onClick={() => setMenuVisible(true)}
                                onChange={(e) => {
                                    setCurrent([current[0], e.target.value])
                                    setMenuVisible(false)
                                }}
                                onPressEnter={(e: any) => {
                                    const ck: string = current[0]
                                    if (ck) {
                                        putTag({
                                            [ck]: {...tag[ck], value: current[1]} as TagValue
                                        })
                                    }
                                }}
                            />
                        </Dropdown>
                    </div>
                </div>
            </Col>
            <Col span={2}>
                <Space>
                    <Button type={"default"} onClick={() => {
                        clearTag()
                        clearCurrent()
                        props.onSearch(transformTagToQuery({}))
                    }}>重置
                    </Button>
                    <Button type={"primary"} onClick={() => {
                        if (validateTag()) {
                            clearCurrent()
                            props.onSearch(transformTagToQuery(tag))
                        }
                    }}>搜索
                    </Button>
                </Space>
            </Col>
        </Row>
    )
}

export default Index