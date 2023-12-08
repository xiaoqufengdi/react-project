import {useState, useCallback, useEffect, memo} from 'react';
import {Row, Col, Input, Button, Table, Modal, Checkbox, message} from 'antd';
import moment from 'moment';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {BarsOutlined, SearchOutlined, DatabaseOutlined } from '@ant-design/icons';
import {NODE_TYPE, ComponentProps, IResult} from '../interface';
import request from '@src/container/page/api';
import dictionaryIcon from '@src/assert/dictionary.svg';
import './index.less';

interface IDictionary {
    app_id: string;
    dict_id: string;
    dictionary_name: string;
    Dictionary: Record<string, unknown>
}

interface IConnectDictionary {
    id: number;
    index_id: string;
    dict_id: string;
    dict_name: string;
    status: string;
    task_id: number,
    create_time: string,
    update_time: string
}

const Dictionary = (props: ComponentProps): JSX.Element=>{
    console.log('Dictionary');
    const [isIndex, setIsIndex] = useState<boolean>(false); // 左侧是否选中了项目节点
    const [dataSource, setDataSource] = useState<IConnectDictionary[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [dictionaryList, setDictionaryList] = useState<IDictionary[]>([]);
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);

    const columns = [
        {
            title: '',
            dataIndex: 'order',
            key: 'order',
            width: 50,
            render: (text: string, record: IConnectDictionary, index: number)=>{
                return `${index + 1}`
            }
        },
        {
            title: '字典名称',
            dataIndex: 'dict_name',
            key: 'dict_name',
        },
        {
            title: '最近一次更新',
            dataIndex: 'update_time',
            key: 'update_time',
            render: (text: string)=>{
                return moment(text).format('YYYY-MM-DDTHH:mm:ss');
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: string, record: IConnectDictionary)=>{
                if (text === 'update') {
                    return <Button type='link' onClick={()=>handleUpdate(record)}>可更新</Button>;
                }
                return text;
            }
        }
    ];

    useEffect(()=>{ // 初始化
        if (props.app_id && props.selectedNode && props.selectedNode.type === NODE_TYPE.ITEM) {
            setIsIndex(true);
            fetchIndexDictionary({index_id: props.selectedNode.key as string });
        } else {
            setDataSource([]);
            setCheckedList([]);
            setIsIndex(false);
        }
    }, [props.app_id, props.selectedNode]);

    // 获取项目下关联的字典
    const fetchIndexDictionary = useCallback(async(params: {index_id: string})=>{
        try {
            const res: IConnectDictionary[] = await request.projectInfo.queryDictionaryByIndex(params);
            console.log('fetchIndexDictionary res', res);
            if (res && res.length) {
                setDataSource(res);
                const keys: string[] = res.map(obj=>obj.dict_id);
                setCheckedList(keys);
            } else {
                setDataSource([]);
            }
        }catch (e) {
            console.log(e);
        }
    }, []);

    // 添加关联字典
    const handleClick = async()=>{
        setVisible(true);
        try {
            const res : IDictionary[] = await request.projectInfo.queryDictionary({ app_id: props.app_id});
            if (res.length) {
                setDictionaryList(res);
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 表格里-字典更新响应
    const handleUpdate = async(record: IConnectDictionary)=>{
        message.info('已提交更新，请稍后...');
        try {
            const params: Record<string, unknown> = {
                app_id: props.app_id,
                index_id: props.selectedNode?.item_id || '', // 索引集合ID
                dict_id: record.dict_id // 需要应用的字典ID
            }
            const res : IResult = await request.projectInfo.updateDictionaryByIndex(params);
            if (res.errcode === 0) {
                message.info('更新成功');
                fetchIndexDictionary({index_id: props.selectedNode?.item_id || '' });
            } else {
                message.error('更新失败');
            }
        }catch (e) {
            console.log(e);
        }
    }

    // 全选
    const onCheckAllChange = () => {
        const keys: string[] = dictionaryList.map(dict=>dict.dict_id);
        setCheckedList(keys);
    };

    // 改变选择
    const onChangeSelectDict = (list: CheckboxValueType[]) => {
        setCheckedList(list);
    };

    // 添加关联字典响应函数
    const handleOk = async()=>{
        setVisible(false);
        try {
            const params = {
                app_id: props.app_id,
                index_id: props.selectedNode?.item_id || '',
                dict_id: checkedList
            }
            const res: IResult = await request.projectInfo.connectDictionary(params);
            if (res.errcode === 0) {
                message.info('添加成功');
                fetchIndexDictionary({index_id: props.selectedNode?.item_id || '' });
            } else {
                message.error('添加失败');
            }
        }catch (e) {
            console.log(e);
        }
    }

    return(
        <div className='search-engine-dictionary'>
            {
                isIndex ? (<>
                    <Row className='search-engine-dictionary-title'>
                        <Col span={2}><BarsOutlined style={{marginRight: '10px'}} />关联字典</Col>
                        <Col span={22}><Button type='link' onClick={handleClick} >关联字典</Button></Col>
                    </Row>
                    <Row className='search-engine-dictionary-content'>
                        <Col span={24}>
                            <Table rowKey='field_name' pagination={false}  dataSource={dataSource} columns={columns} />
                        </Col>
                    </Row>
                </>): null
            }
            {
                visible ? <Modal
                    open={visible}
                    title='字典列表'
                    okText='确定'
                    width={360}
                    onOk={() => handleOk()}
                    onCancel={() => setVisible(false)}
                    className='modal-basic-style search-engine-dictionary-modal'
                    footer={[
                        <Button key='back' type='text' className='search-engine-dictionary-selected-count'>
                            { `已选择${checkedList.length}项` }
                        </Button>,
                        <Button
                            key='ok'
                            type='primary'
                            onClick={handleOk}
                        >
                            确认
                        </Button>,
                    ]}
                >
                    <div style={{maxHeight: '300px', overflow: 'auto' }}>
                    {
                        dictionaryList.length ? (<>
                                <div style={{height: '32px', lineHeight: '32px'}}><Button type='link' onClick={onCheckAllChange}>全选</Button> </div>
                                <Checkbox.Group style={{ display: 'block', padding: '10px 20px' }} onChange={onChangeSelectDict} value={checkedList}>
                                    {dictionaryList.map((option) => (
                                        <Checkbox key={option.dict_id} value={option.dict_id}>
                                            <div style={{height: '24px', lineHeight: '24px'}}>
                                                <img src={dictionaryIcon} width={24} height={24} style={{marginRight: '10px', position: 'relative', top: '-2px'}} /> {option.dictionary_name}
                                            </div>
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </>
                        ) : null
                    }
                    </div>
                </Modal> : null
            }
        </div>
    )
}

export default memo(Dictionary);