import {useState, useCallback, useEffect} from 'react';
import { Row, Col, Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import { NODE_TYPE, ComponentProps, IDetail } from '../interface';
import './index.less';
import request from '@src/container/page/api';


const SearchInfo = (props: ComponentProps): JSX.Element=>{
    const [isIndex, setIsIndex] = useState<boolean>(false); // 左侧是否选中了项目节点
    const [value, setValue] = useState<string>('')
    const [count, setCount] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [detail, setDetail] = useState<IDetail|null>(null); // 索引集合（项目）详情数据


    useEffect(()=>{ // 初始化
        if (props.app_id && props.selectedNode && props.selectedNode.type === NODE_TYPE.ITEM) {
            setIsIndex(true);
            fetchIndexDetail({index_id: props.selectedNode.key as string, app_id: props.app_id });
        } else {
            setDetail(null);
            setIsIndex(false);
        }
    }, [props]);

    useEffect(()=>{
        if (detail && props.selectedNode) {
            const params = {
                app_id: props.app_id,
                index_id: props.selectedNode.key, // 索引集合id
                keyword: value, // 关键字
                page: 1, // 页数
                page_size: 9999, // 单页数量
                sort: ['field:asc']
            }
            query(params);
        }
    }, [detail, value]);

    // 获取项目下数据源详情
    const fetchIndexDetail = useCallback(async(params: {index_id: string, app_id: string})=>{
        try {
            const res: IDetail = await request.projectInfo.detailIndex(params);
            console.log('fetchIndexDetail res', res);
            if (res) {
                setDetail(res as IDetail);
            } else {
                setDetail(null);
            }
        }catch (e) {
            console.log(e);
        }
    }, []);

    // 查询
    const query = useCallback((params)=>{
        console.log(11);
    }, [])

    const onChange = (value: any) => {
        console.log(value);
        setValue(value.trim());
    }

    return(
        <div className='project-search'>
            {
                isIndex ? (<>
                    <Row className='project-search-title'>
                        <Col span={20}>
                            <Input value={value} prefix={<SearchOutlined />} placeholder='请输入' onChange={onChange} style={{ width: 200 }} />
                        </Col>
                        <Col span={4}>结果数量</Col>
                    </Row>
                    <Row className='project-search-content'>
                        <Col span={24}>
                           content
                        </Col>
                    </Row>
                </>): null
            }
        </div>
    )
}

export default SearchInfo;