import { useState, useCallback, useEffect } from 'react';
import { Row, Col, Button, Table, Slider, message } from 'antd';
import {BarsOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { NODE_TYPE, ComponentProps, IDetail, IData, IResult } from '../interface';
import request from '@src/container/page/api';
import DataSourceModal, { ifsModelCollection } from '@components/data-source-pane/data-source-modal';
import './index.less';
import {ifsModelCollectionField} from 'ancillarySystem/interface';

// 使用接口描述函数类型
interface Fun {
    (): void
}

const NO_DATA_SOURCE = 'nodatasource'; // 没有绑定数据
const Config = (props: ComponentProps): JSX.Element=>{
    console.log('Config', props);
    const [isIndex, setIsIndex] = useState<boolean>(false); // 左侧是否选中了项目节点
    const [detail, setDetail] = useState<IDetail|null>(null); // 索引集合（项目）详情数据
    const [showModal, setShowModal] = useState(false);
    const [modelInfo, setModelInfo] = useState<ifsModelCollection | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [dataSource, setDataSource] = useState<IData[]>([]);
    // const isInit = useRef<boolean>(false);  // 是否初始化

    const columns = [
        {
            title: '字段',
            dataIndex: 'field_name',
            key: 'field_name',
            render: (text: string)=>{
                return (<div style={{display: 'flex', alignItems: 'center'}}>
                    <ConsoleSqlOutlined style={{ marginRight: '10px' }} />
                    <div style={{height: '32px', lineHeight: '32px'}}> {text} </div>
                </div>)
            }
        },
        {
            title: '检索优先级',
            dataIndex: 'relevancy',
            key: 'relevancy',
            render: (num: number, record: IData)=>{
                if (record.field_name !== '_id' && selectedRowKeys.includes(record.field_name)) {
                    return (<div style={{display: 'flex', alignItems: 'center'}}>
                        <Slider min={1} max={100} value={num}  onChange={ (value)=>onChange(value, record)}/>
                        <div style={{height: '32px', lineHeight: '32px'}}> {num} </div>
                    </div>)
                }
                return '';
            }
        }
    ];

    // 滑动条数值改变响应
    const onChange = (newValue: number, record:IData) => {
        const _dataSource: IData[] = dataSource.map(obj=>{
            if (obj.field_name === record.field_name) {
                return {...obj, relevancy: newValue};
            }
            return obj;
        });

        setDataSource(_dataSource);
    };

    useEffect(()=>{ // 初始化
        if (props.app_id && props.selectedNode && props.selectedNode.type === NODE_TYPE.ITEM) {
            setIsIndex(true);
            fetchIndexDetail({index_id: props.selectedNode.key as string, app_id: props.app_id });
        } else {
            setIsIndex(false);
        }
    }, [props]);

    // 获取项目下数据源详情
    const fetchIndexDetail = useCallback(async(params: {index_id: string, app_id: string})=>{
        try {
            const res: IDetail = await request.projectInfo.detailIndex(params);
            console.log('fetchIndexDetail res', res);
            if (res) {
                setDetail(res as IDetail);
                const { field_list,  field_relevancy} = res;
                updateTable(field_list || [] , field_relevancy);

            } else {
                setDetail(null);
            }
        }catch (e) {
            console.log(e);
        }
    }, []);

    const getCheckboxProps = (record: ifsModelCollectionField) => {
        // _id那行置灰
        if (record.field_name === '_id') {
            return {
                disabled: true,
                style: { color: 'gray' },
            };
        }
        return {};
    };

    const rowSelection: Record<string, any> = {
        type: 'checkbox',
        getCheckboxProps,
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: ifsModelCollectionField[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as string[]);

        }
    }

    const handleClick = ()=>{
        setShowModal(true);
    }

    // 绑定数据源
    const bindDataSource = useCallback(async(modelInfo, field_relevancy?: IData[], callback?: Fun)=>{
        try{
            const params = {
                app_id: props.app_id,
                index_id: props.selectedNode?.item_id || '',
                model_instance_id: modelInfo?.instance_id || detail?.model_instance_id,
                primary_key: '_id',
                field_list: modelInfo?.field_list || detail?.field_list,
                collection_name: modelInfo?.collection_title,
                field_relevancy
            };

            const res: IResult = await request.projectInfo.bindDataSource(params);
            console.log('bindDataSource res', res);
            if (!field_relevancy) {

                if (res.errcode === 0) {
                    message.info('绑定成功');
                } else {
                    message.error('绑定失败');
                }
            }
            if (callback) {
                callback();
            }
        } catch (e) {
            console.log(e);
        }
    }, [props, detail]);

    // 获取索引状态的显示文本
    const getStatusText = useCallback((status: string): string=>{
        // 'processing' / 'succeeded', nodatasource状态才可绑定数据源
        let str = '未索引';
        switch(status) {
            case 'processing':
                str = '索引中';
                break;
            case 'succeeded':
                str = '完成';
                break;
            default:
        }
        return str;
    }, []);

    // 更新表格数据
    const updateTable = (fieldList: any[] , fieldRelevancy?: IData[])=> {
        console.log('updateTable', fieldList, fieldRelevancy);
        const _dataSource : IData[] = fieldList.map(obj=>{
            let _relevancy = 50;
            if (fieldRelevancy) {
                const res = fieldRelevancy.find(obj2=>obj2.field_name ===obj.field_name);
                _relevancy = res ? res.relevancy : 50
            }
            return {
                field_name: obj.field_name,
                relevancy: _relevancy
            }
        })
        setDataSource(_dataSource);
        let _keys : string [] = [];
        if (fieldRelevancy && fieldRelevancy.length) {
            _keys = fieldRelevancy.map(obj=>obj.field_name);
        } else {
            // 默认选中id
            const obj : IData | undefined = _dataSource.find(obj=>obj.field_name === '_id');
            if (obj) {
                _keys = [obj.field_name];
                // setSelectedRowKeys([obj.field_name]);
            }
        }
        setSelectedRowKeys(_keys);


        const _fieldRelevancy : IData[] = _dataSource.filter(obj=>_keys.includes(obj.field_name));
        bindDataSource(modelInfo, _fieldRelevancy);
    }

    return(
        <div className='search-engine-config'>
            {
                isIndex ? (<>
                    <Row>
                        <Col span={4}><BarsOutlined style={{marginRight: '10px'}} /> 数据源</Col>
                        <Col span={20}>
                            {detail && detail.status !== NO_DATA_SOURCE  ?  detail.collection_name : <Button type='link' onClick={handleClick} style={{textAlign: 'left', paddingLeft: 0}} >未选择</Button>}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}><BarsOutlined style={{marginRight: '10px'}} />配置字段</Col>
                        <Col span={20}>
                            {
                                dataSource.length ? (
                                    <Table rowKey='field_name' pagination={false} rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
                                ): null
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}><BarsOutlined style={{marginRight: '10px'}}/> 索引状态</Col>
                        <Col span={20}> {getStatusText(detail?.status || '')} </Col>
                    </Row>
                </>) : null
            }

            {showModal && (
                <DataSourceModal
                    source={null}
                    onCancel={() => setShowModal(false)}
                    onOk={async(info) => {
                        console.log('info---', info);
                        setModelInfo(info);
                        setShowModal(false);

                        // updateTable(info.field_list)
                        const fieldList = info.field_list || [];
                        const _dataSource : IData[] = fieldList.map(obj=>{
                            const _relevancy = 50;
                            return {
                                field_name: obj.field_name,
                                relevancy: _relevancy
                            }
                        })
                        setDataSource(_dataSource)
                        // 默认选中id
                        const obj : IData | undefined = _dataSource.find(obj=>obj.field_name === '_id');
                        if (obj) {
                            setSelectedRowKeys([obj.field_name]);
                        }

                        bindDataSource(info, undefined, ()=>{
                            fetchIndexDetail({index_id: props.selectedNode?.key as string, app_id: props.app_id });
                        });
                    }}
                />
            )}
        </div>
    )
}

export default Config;