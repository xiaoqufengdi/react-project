import { useState, useRef, useCallback, useEffect } from 'react';
import {Button, Row, Col, Form, Input, Layout, message, Modal,  Space, Table, Tree, Select, Dropdown, Menu} from "antd";
import IconFont from "@src/container/page/components/iconFont";
import type { DataNode, TreeProps } from 'antd/es/tree';
const { TreeNode } = Tree;


import request from '@src/container/page/api';
import './index.less';



// 分类右键菜单
const OPERATOR_TYPE: Record<string, string> = {
    ADD_TYPE: 'ADD_TYPE',
    ADD_PROJECT: 'ADD_PROJECT',
    DELETE_TYPE: 'DELETE_TYPE'
};
interface Action {
    id: string,
    name: string
}
const ACTION_DROP_LIST: Action[] = [
    {id: OPERATOR_TYPE.ADD_TYPE, name: '创建分类' },
    { id: OPERATOR_TYPE.ADD_PROJECT, name: '创建项目' },
    { id: OPERATOR_TYPE.DELETE_TYPE, name: '删除分类' }
];
// interface ProjectInfoProps{
//     name: string
// }

// 接口返回结果
export interface IResult{
    errcode: number;
    msg: string;
    data: unknown
}

// 节点类型-分类|项目节点
enum NODE_TYPE {
    CLASS = 'class',
    ITEM = 'item'
}
// 树节点的数据结构
interface INode extends DataNode {
    // key?: string | number,
    // title: string,
    app_id: string;
    class_id: string; // 分类id
    index_id: string; // 索引项目id
    pid: string; // 父级id
    type: NODE_TYPE,
    children?: Array<INode>
}

const ProjectInfo: React.FC= ()=>{
    const [dataSource, setDataSource] = useState<INode[]>([]);
    const [selectedKeys = [], setSelectedKeys] = useState<string[]>([]);
    // const treeRef = useRef<HTMLDivElement|null>(null);
    // const treeRef = useRef<typeof Tree>(null);
    const treeRef = useRef<any>(null);

    // 初始化取左侧树的数据
    useEffect(()=>{
        // test code
        localStorage.setItem('app_id', '3e8bef1c-a8f1-4997-9a29-6fadb5138c01');

        const app_id: string = localStorage.getItem('app_id') || '';
        const params: {app_id: string } = {app_id}
        fetchTreeData(params);
    }, []);

    // 获取左侧树数据
    const fetchTreeData = useCallback(async(params:{app_id: string })=>{
        try{
            const { data } : IResult = await request.projectInfo.queryTypeAll(params);
            // 给节点数据加上key属性
            const fun = function (arr: Array<INode>){
                return arr.map((obj: INode)=>{
                    const _obj: INode = {
                        ...obj,
                        key: (obj.type === NODE_TYPE.CLASS ? obj.class_id : obj.index_id) || ''
                    };
                    if (_obj.children?.length) {
                       return fun(_obj.children)
                    }
                    return _obj
                })
            }
            const _data: Array<INode> = fun(data as INode[]);
            setDataSource(_data);
        } catch(e) {
            console.log(e);
        }
    }, []);

    // 自定义树title
    const renderTreeNodes = (treeData: INode[]) => {
        return treeData.map((node: INode)=>{
            if (node.children) {
                return (
                    <TreeNode key={node.key} title={node.title} data={node}>
                        {renderTreeNodes(node.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={node.key} title={node.title} data={node} />;
        })
    };

    // 自定义树节点title
    const renderTreeNode = (node: any) => {
        console.log('renderTreeNode', node);
        const menu = (
            <Menu>
                {
                    ACTION_DROP_LIST.map((obj: Action)=><Menu.Item
                        key={obj.id}
                        onClick={() => dropMenuClick(obj, node)}
                    >{obj.name}</Menu.Item>)
                }
            </Menu>
        );

        const renderTitle = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{node.title}</span>
                {
                    node.type === NODE_TYPE.CLASS ? ( <Dropdown
                        trigger={["hover"]}
                        overlay={menu}
                        placement='bottomRight'
                    >
                        <span><IconFont style={{ fontSize: '12px', paddingRight: '10px' }} type="icon-more" /></span>
                    </Dropdown>) : null
                }
            </div>
        );

        return renderTitle;
    };

    // 点击右键菜单响应函数
    const dropMenuClick = async (obj: any, treeData: any) => {
        console.log('dropMenuClick', obj, treeData);

    };

    const onDragEnter = (info: any) => {
        console.log("onDragEnter", info.event);
        // 调整滚动条的位置
        const treeDOM: any = document.querySelector(".project-info-tree");
        if (treeDOM.scrollHeight > treeDOM.clientHeight) {
            // 高度有溢出的情况下
            if (info.event.pageY < 220 && treeDOM.scrollTop > 0) {
                // 靠近顶部
                treeDOM.scrollTop = (treeDOM.scrollTop - 5 > 0) ? (treeDOM.scrollTop - 5) : 0;
            }
            if(info.event.pageY + 60 > treeDOM.clientHeight + 160){
                // 靠近底部
                treeDOM.scrollTop = (treeDOM.scrollTop + 5 < treeDOM.scrollHeight) ? (treeDOM.scrollTop + 5): treeDOM.scrollHeight;
            }
        }
    };

    const onDragLeave = (info: any)=>{
        console.log("onDragLeave");
        console.log(info);
    };

    const onDrop = (info: any) => {
        console.log("onDrop");
        console.log(info);
        const dropKey = info.node.key;     // 参照节点
        const dragKey = info.dragNode.key; // 拖动节点
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        console.log("dropPosition:" , dropPosition);
        const loop = (data: Array<any>, key: string, callback: (item: any, index: number, arr: any[]) => void) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    // @ts-ignore
                    return callback(data[i], String(i), data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };
        const data = [...dataSource];

        // Find dragObject  找到拖动节点拿出来，并在原数据中删除
        let dragObj: any;
        loop(data, dragKey, (item: any, index: number, arr: any[]) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        // 通过参照节点把拖拽节点放回到树里
        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item: any, index: number, arr: any[]) => {
                if (!item.children) {
                    message.warn("禁止将不同类型的节点拖拽到一起");
                    return;
                }
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item: any, index: number, arr: any[]) => {
                if (!item.children) {
                    message.warn("禁止将不同类型的节点拖拽到一起");
                    return;
                }
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
                // in previous version, we use item.children.push(dragObj) to insert the
                // item to the tail of the children
            });
        } else {
            let ar: any[];
            let i: number;
            if (!(info.node.children && info.dragNode.children||
                !info.node.children && !info.dragNode.children)) {
                message.warn("禁止将不同类型的节点拖拽到一起");
                return;
            }

            loop(data, dropKey, (item: any, index: number, arr: any[]) => {
                ar = arr;
                i = index;
            });


            if (dropPosition === -1) {
                // @ts-ignore
                ar.splice(i, 0, dragObj);
            } else {
                // @ts-ignore
                ar.splice(i + 1, 0, dragObj);
            }
        }
        console.log('onDrop data', data);
        setDataSource(data);
        // TODO: 保存拖拽后的结果

    };

    return (
        <Row className='project-info'>
            <Col sm={8} md={6} lg={6} className='project-info-left' >
                <div className='title'><span>全部项目</span></div>
                <Tree
                    ref={treeRef }
                    // // checkable
                    className='project-info-tree'
                    // // defaultExpandedKeys={expandedKeys}
                    draggable
                    blockNode
                    // onDragEnter={onDragEnter}
                    // onDrop={onDrop}
                    titleRender={renderTreeNode}
                    autoExpandParent={true}
                    // onSelect={(selectedKeys: any[], event: any)=>{ handleOnSelect(selectedKeys, event) }}
                    selectedKeys={ selectedKeys }
                    defaultExpandAll={true}
                >
                    {
                        renderTreeNodes(dataSource)
                    }
                </Tree>
            </Col>
            <Col sm={16} md={18} lg={18}>
                <Row>选中的项目 </Row>
                <Row>
                    展示区域
                </Row>
            </Col>
        </Row>
    )
}

export default ProjectInfo;