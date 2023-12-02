import { useState, useCallback, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import {BarsOutlined} from '@ant-design/icons';

import { INode, IResult, NODE_TYPE } from '../index';

import './index.less';
import {TreeNodeNormal} from 'antd/lib/tree/Tree';

interface ComponentProps {
    selectedNode: INode | null;
}

const Config = (props: ComponentProps): JSX.Element=>{
    console.log('Config', props);
    const [isIndex, setIsIndex] = useState<boolean>(false);
    useEffect(()=>{
        if (props.selectedNode && props.selectedNode.type === NODE_TYPE.ITEM) {
            console.log(11);
            setIsIndex(true);
        } else {
            setIsIndex(false);
        }
    }, [props.selectedNode]);


    return(
        <div className='project-config'>
            {
                isIndex ? (<>
                    <Row>
                        <Col span={4}><BarsOutlined style={{marginRight: '10px'}} /> 数据源</Col>
                        <Col span={20}><Button type='primary'>目标表</Button></Col>
                    </Row>
                    <Row>
                        <Col span={4}><BarsOutlined style={{marginRight: '10px'}} /> 配置字段</Col>
                        <Col span={20}>table</Col>
                    </Row>
                    <Row>
                        <Col span={4}><BarsOutlined style={{marginRight: '10px'}}/> 索引状态</Col>
                        <Col span={20}>未索引</Col>
                    </Row>
                </>) : null
            }
        </div>
    )
}

export default Config;