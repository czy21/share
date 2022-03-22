import React from "react";
import lodash from 'lodash'
import * as antd from 'antd'
import * as intl from 'react-intl'
import styles from "./index.m.less";

export interface FilterProp {
    onSearch: (query?: any) => void
    page?: {
        pageIndex?: number,
        pageSize?: number,
        total?: number
    }
    filters: any[]
}

export interface TagValue {
    label: string,
    value?: any
}

const DefaultCurrent: any = ["", undefined]
const DefaultTag = {}

const Filter: React.FC<FilterProp> = (props: FilterProp) => {
    const [current, setCurrent] = React.useState<[string, any]>(DefaultCurrent)
    const [tag, setTag] = React.useState<any>(DefaultTag)
    const [menuVisible, setMenuVisible] = React.useState<boolean>()

    const putTag = (value: {}) => {
        setTag({...tag, ...value})
    }

    const removeTag = (key: string) => {
        if (current[0] === key) {
            clearCurrent()
        }
        setTag(lodash.omit(tag, [key]))
        inputRef.current.focus()
    }

    const renderTag = () => {
        return ((Object.entries(tag) as any[])
            .map(([k, v]) => {
                return (
                    <antd.Tag
                        key={k}
                        color={k === current[0] ? "#87d068" : "default"}
                        style={{borderRadius: "20px", fontSize: "14px"}}
                        closable={true}
                        onClick={() => {
                            setCurrent([k, v.value])
                            inputRef.current.focus()
                        }}
                        onClose={() => removeTag(k)}
                    >
                        {[v.label, v.value].join(":")}
                    </antd.Tag>
                )
            }))
    }

    const validateTag = (): boolean => {
        let validateRules: string = lodash.filter(tag, (v: TagValue, k) => lodash.isEmpty(v?.value)).map(t => t.label).join(",")
        if (validateRules) {
            antd.message.warn([validateRules, "不能为空"].join(" "))
        }
        return lodash.isEmpty(validateRules)
    }

    const transformTagToQuery = (query: any): {} => {
        return {...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, (v as TagValue)?.value])), ...props.page}
    }

    const renderFilter = () => {
        return (
            <antd.Menu
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
                {props.filters.map(t => (<antd.Menu.Item key={t.key}>{t.label}</antd.Menu.Item>))}
            </antd.Menu>
        )
    }

    const clearCurrent = () => {
        setCurrent(DefaultCurrent)
    }
    const clearTag = () => {
        setTag(DefaultTag)
    }
    const inputRef = React.useRef<any>()

    return (
        <antd.Row gutter={8}>
            <antd.Col span={22}>
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        {renderTag()}
                        <antd.Dropdown
                            overlay={renderFilter()}
                            overlayStyle={{minWidth: "160px"}}
                            trigger={['click']}
                            visible={menuVisible}
                            onVisibleChange={setMenuVisible}
                        >
                            <antd.Input
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
                        </antd.Dropdown>
                    </div>
                </div>
            </antd.Col>
            <antd.Col span={2}>
                <antd.Space>
                    <antd.Button type={"default"} onClick={() => {
                        clearTag()
                        clearCurrent()
                        props.onSearch(transformTagToQuery({}))
                    }}>{<intl.FormattedMessage id={"common.filter.reset"} defaultMessage={""}/>}
                    </antd.Button>
                    <antd.Button type={"primary"} onClick={() => {
                        if (validateTag()) {
                            clearCurrent()
                            props.onSearch(transformTagToQuery(tag))
                        }
                    }}>{<intl.FormattedMessage id={"common.filter.search"} defaultMessage={""}/>}
                    </antd.Button>
                </antd.Space>
            </antd.Col>
        </antd.Row>
    )
}

export default Filter