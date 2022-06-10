import React from "react";
import intl from "../intl"
import _ from 'lodash'
import {Button, Col, Dropdown, Input, Menu, message, Row, Space, Tag} from 'antd'
import util from '../config'

export interface FilterItemProp {
    key: string
    label: string
}

export interface FilterItemValue extends FilterItemProp {
    value?: any
    tag?: {
        style?: React.CSSProperties
    }
}

export interface FilterProp {
    filters: FilterItemProp[]
    tag?: {
        style?: React.CSSProperties
    }
    onSearch: (query?: any) => void
    page?: {
        pageIndex?: number,
        pageSize?: number,
        total?: number
    }
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
            resetCurrent()
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
                        style={{fontSize: "14px", ...props.tag?.style, ...v.tag?.style}}
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
        let validatedRules: string = _.filter(tag, (v: FilterItemValue, k) => _.isEmpty(v?.value)).map(t => t.label).join(",")
        if (validatedRules) {
            message.warn([validatedRules, "不能为空"].join(" "))
                .then(r => {
                })
        }
        return _.isEmpty(validatedRules)
    }

    const transformTagToQuery = (query: any): {} => {
        return {...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, (v as FilterItemValue)?.value])), ...props.page}
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
                        }
                    })
                    inputRef.current.focus()
                    setMenuVisible(false)
                }}>
                {props.filters.map(t => (<Menu.Item key={t.key}>{t.label}</Menu.Item>))}
            </Menu>
        )
    }

    const resetCurrent = () => {
        setCurrent(defaultCurrent)
    }
    const resetTag = () => {
        setTag(defaultTag)
    }
    const inputRef = React.useRef<any>()

    return (
        <Row gutter={8}>
            <Col span={20}>
                <div className={util.style.getPrefix() + "-filter-wrapper"}>
                    <div className={util.style.getPrefix() + "-filter-content"}>
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
                                            [ck]: {...tag[ck], value: current[1]} as FilterItemValue
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
                        resetTag()
                        resetCurrent()
                        props.onSearch(transformTagToQuery({}))
                    }}>{<intl.FormatMessage id={"common.filter.reset"}/>}
                    </Button>
                    <Button type={"primary"} onClick={() => {
                        if (validateTag()) {
                            resetCurrent()
                            props.onSearch(transformTagToQuery(tag))
                        }
                    }}>{<intl.FormatMessage id={"common.filter.search"}/>}
                    </Button>
                </Space>
            </Col>
        </Row>
    )
}

export default Index