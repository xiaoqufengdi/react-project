import {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Table, message, Slider} from 'antd';
import {BarsOutlined, SearchOutlined } from '@ant-design/icons';
import {ComponentProps, IResult, NODE_TYPE} from '@src/container/page/service-content/project/interface';
import moment from 'moment';
import './index.less';
import request from '@src/container/page/api';

// 任务状态
enum STATUS{
    unknown = '未知',
    enqueued = '排队中',
    processing='处理中',
    succeeded = '成功',
    failed = '失败',
    canceled = '取消'
}

// 日志类型
enum LOG_TYPE{
    create_index = '创建索引集合',
    recreate_index = '重新创建索引集合',
    update_dictionary = '更新字典',
    data_sync = '数据同步'
}

interface ILog{
    task_id: number;
    app_id: string;
    index_id: string;
    index_name: string;
    status: string;
    task_type: string;
    task_name: string;
    create_time: string;
    update_time: string;
    content: string;
}

const Log = (props: ComponentProps): JSX.Element=>{
    const [isIndex, setIsIndex] = useState<boolean>(false); // 左侧是否选中了项目节点
    const [value, setValue] = useState<string>('')
    const [dataSource, setDataSource] = useState<ILog[]>([]);

    const columns = [
        {
            title: '',
            dataIndex: 'order',
            key: 'order',
            width: 50,
            render: (text: string, record: ILog, index: number)=>{
                return `${index + 1}`
           }
        },
        {
            title: '时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (text: string)=>{
                return moment(text).format('YYYY-MM-DDTHH:mm:ss');
            }
        },
        {
            title: '类型',
            dataIndex: 'task_type',
            key: 'task_type',
            render: (text: string)=>{
                return LOG_TYPE[text];
            }
        },
        {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            render: (text:undefined , record: ILog)=>{
                return `${LOG_TYPE[record.task_type]}${record.task_name}`;
            }
        }
    ];

    useEffect(()=>{ // 初始化
        if (props.app_id && props.selectedNode && props.selectedNode.type === NODE_TYPE.ITEM) {
            setIsIndex(true);
            fetchIndexLog({index_id: props.selectedNode.key as string, app_id: props.app_id, keyword: '' });
        } else {
            setIsIndex(false);
            setValue('');
        }
    }, [props]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e.target.value);
        const _value: string = e.target.value.trim();
        setValue(_value);
        fetchIndexLog({index_id: props.selectedNode?.key as string, app_id: props.app_id, keyword: _value});
    }

    // 获取项目下数据源详情
    const fetchIndexLog = useCallback(async(params: {index_id: string, app_id: string, keyword: string})=>{
        try {
            const res: IResult = await request.projectInfo.queryLog({page:1, page_size: 9999, ...params});
            console.log('fetchIndexLog res', res);
            if (res.errcode === 0) {
                setDataSource(res?.data?.list as ILog[] || []);
            } else {
                setDataSource([]);
            }
        }catch (e) {
            console.log(e);
        }
    }, []);

    return(
        <div className='search-engine-log'>
            {
                isIndex ? (<>
                    <Row className='search-engine-log-title'>
                        <Col span={2}><BarsOutlined style={{marginRight: '10px'}} />日志</Col>
                        <Col span={22} style={{textAlign: 'right'}}>
                            <Input value={value} prefix={<SearchOutlined />} placeholder='请输入' onChange={onChange} style={{ width: 200 }} allowClear />
                        </Col>
                    </Row>
                    <Row className='search-engine-log-content'>
                        <Col span={24}>
                            <Table rowKey='create_time' pagination={false}  dataSource={dataSource} columns={columns} />
                        </Col>
                    </Row>
                </>): null
            }
        </div>
    )
}

export default Log;