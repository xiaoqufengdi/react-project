import {useState, useCallback, useEffect, ReactNode} from 'react';
import { Row, Col, Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import { NODE_TYPE, ComponentProps, IResult, IDetail } from '../interface';
import request from '@src/container/page/api';
import searchNoDataIcon from '@src/assert/searchNoData.svg';
import './index.less';

const SearchInfo = (props: ComponentProps): JSX.Element=>{
    const [isIndex, setIsIndex] = useState<boolean>(false); // 左侧是否选中了项目节点
    const [value, setValue] = useState<string>('')
    const [total, setTotal] = useState<number>(0);
    const [detail, setDetail] = useState<IDetail|null>(null); // 索引集合（项目）详情数据
    const [highlightField, setHighlightField] = useState<string[]>([]); // 高亮字段
    const [list, setList] = useState<Record<string, unknown>[]>([]);    //   查询结果

    useEffect(()=>{ // 初始化
        if (props.app_id && props.selectedNode && props.selectedNode.type === NODE_TYPE.ITEM) {
            setIsIndex(true);
            fetchIndexDetail({index_id: props.selectedNode.key as string, app_id: props.app_id });
        } else {
            setDetail(null);
            setIsIndex(false);
            setValue('');
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
                // sort: ['field:asc']
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
    const query = useCallback(async(params)=>{
        try {
           const res : any = await request.projectInfo.search(params);
           // test code
/*
           const res: any = {
               "list": [
                   {
                       // 高亮标记格式化后数据
                       "_formatted": {
                           "_id": "6568554bfc95882add2e2343",
                           "create_by": "",
                           "create_time": "2023-11-30T09:26:35.692851586Z",
                           "numeric07799552": "`999`9",
                           "string93870336": "ps",
                           "update_by": "",
                           "update_time": "2023-11-30T09:26:35.692852646Z"
                       },
                       // 高亮格式化前数据
                       "_id": "6568554bfc95882add2e2343",
                       "create_by": "",
                       "create_time": "2023-11-30T09:26:35.692851586Z",
                       "numeric07799552": 9999,
                       "string93870336": "ps",
                       "update_by": "",
                       "update_time": "2023-11-30T09:26:35.692852646Z"
                   }
               ],
               "total": 1,
               "highlight_field": [
                   "create_time",
                   "update_time",
                   "create_by",
                   "update_by",
                   "_id",
                   "string93870336",
                   "numeric07799552"
               ],
               // 高亮标记
               "highlight_pre_tag": "`",
               "highlight_post_tag": "`"
           }
*/

            console.log('search, res', res);
            setHighlightField(res.highlight_field as string[]);
            setTotal(res.total);
            setList(res.list || []);

        } catch (e) {
            console.log(e);
        }

    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value: string = e.target.value.trim();
        setValue(_value);
        if (detail && props.selectedNode) {
            const params = {
                app_id: props.app_id,
                index_id: props.selectedNode.key, // 索引集合id
                keyword: _value, // 关键字
                page: 1, // 页数
                page_size: 9999, // 单页数量
                // sort: ['field:asc']
            }
            query(params);
        }
    }

    // 获取展示内容
    const getContent = ():JSX.Element[] =>{
        return (
            list.map((obj: Record<string, unknown>, index: number)=>{
                return (<div key={index} className='search-engine-search-content-list'>
                    {
                        highlightField.map(field=>{

                            const fieldInfo: Record<string, any>|undefined = (detail?.field_list as Record<string, unknown>[]) .find(fieldInfo=>fieldInfo.field_name === field);
                            if (fieldInfo) {
                                const title: string = fieldInfo?.widget_info?.name || '';
                                const _value = (obj[field] as string|number).toString();
                                const dangerouslySetInnerHTML: { __html: string } = { __html: _value.replace(value, `<span class="high-light" }>${value}</span>`) }

                                return (
                                    <li key={field}>
                                        <span className='field-key'>{title}</span>: <span className='field-value' dangerouslySetInnerHTML={dangerouslySetInnerHTML}></span>
                                    </li>
                                )
                            }
                            return null
                    })
                }
                </div> )
            })
        );
    };

    return(
        <div className='search-engine-search'>
            {
                isIndex ? (<>
                    <Row className='search-engine-search-title'>
                        <Col span={20}>
                            <Input value={value} prefix={<SearchOutlined />} placeholder='请输入' onChange={onChange} style={{ width: 200 }} />
                        </Col>
                        <Col span={4}>结果数量 {total}</Col>
                    </Row>
                    <Row className='search-engine-search-content'>
                        <Col span={24}>
                                {
                                    (list.length && detail) ? getContent() : <div className='search-engine-search-no-data' style={{display: 'flex'}}>
                                            <img width={218} height={198} src={searchNoDataIcon} alt='pic' />
                                            <div className='search-engine-search-no-title'><span>请在搜索框输入关键字</span> </div>
                                        </div>
                                }
                        </Col>
                    </Row>
                </>): null
            }
        </div>
    )
}

export default SearchInfo;