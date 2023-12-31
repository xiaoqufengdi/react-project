import { useState, useRef, useCallback, useEffect, useMemo, memo } from 'react';
import {Button, Row, Col, Form, Input, Layout, message, Modal, Tree, Tabs, Dropdown, Menu} from 'antd';
import {
    PlusOutlined,
    MoreOutlined,
    CloseOutlined
} from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import request from '@src/container/page/api';
import Config from './config';
import { IResult, NODE_TYPE } from './interface';
import Dictionary from './dictionary';
import Log from './log';
import SearchInfo from './search';
import expandIcon from '@src/assert/expand.svg';

import './index.less';

const { TreeNode } = Tree;
const { Sider, Content } = Layout;

// 分类下拉菜单
enum OPERATOR_TYPE {
    ADD_TYPE = 'ADD_TYPE',  // 添加分类
    ADD_PROJECT = 'ADD_PROJECT', // 添加项目

    RENAME_TYPE = 'RENAME_NAME',
    DELETE_TYPE = 'DELETE_TYPE' // 删除分类
}
interface Action {
    id: OPERATOR_TYPE,
    name: string
}
const ACTION_DROP_LIST: Action[] = [
    {id: OPERATOR_TYPE.ADD_TYPE, name: '创建分类' },
    { id: OPERATOR_TYPE.ADD_PROJECT, name: '创建项目' },
];
const ACTION_DROP_LIST2: Action[] = [
    {id: OPERATOR_TYPE.RENAME_TYPE, name: '重命名' },
    { id: OPERATOR_TYPE.DELETE_TYPE, name: '删除分类' }
];

// 接口返回结果

// 树节点的数据结构
export interface INode extends DataNode {
    // key?: string | number,
    // title: string,
    app_id: string;
    class_id: string; // 分类id
    item_id: string; // 索引项目id
    pid: string; // 父级id
    type: NODE_TYPE,
    children?: Array<INode>
}
// 传给各个子组件的属性

const SearchEngineProjectInfo: React.FC= ()=>{
    const [dataSource, setDataSource] = useState<INode[]>([]);
    // const treeRef = useRef<HTMLDivElement|null>(null);
    // const treeRef = useRef<typeof Tree>(null);
    const treeRef = useRef<any>(null);
    // const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);  // 创建分类|项目
    const [modalType, setModalType] = useState<OPERATOR_TYPE>(OPERATOR_TYPE.ADD_TYPE); // 分类的下拉菜单
    const [operatorNode , setOperatorNode] = useState<INode|null>(null);  // 在哪个分类节点上-下拉菜单
    const [form] = Form.useForm();
    const app_id = useMemo(()=>{
        // test code
        localStorage.setItem('app_id', '3e8bef1c-a8f1-4997-9a29-6fadb5138c01');

        const app_id: string = localStorage.getItem('app_id') || '';
        return app_id;
    }, []);

    const [editingKey, setEditingKey] = useState<string | null>(null); // 编辑节点
    const [selectedNode, setSelectedNode] = useState< INode|null>(null); // 记录选中的节点数据
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // 记录选中的节点key
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 树节点key
    const [isExpand, setIsExpand] = useState<boolean>(false);

    // 初始化取左侧树的数据
    useEffect(()=>{
        fetchTreeData();
    }, [app_id]);

    // 获取左侧树数据
    const fetchTreeData = useCallback(async()=>{
        try{
            const result = await request.projectInfo.queryTypeAll({app_id, type: 'index'});
            console.log('result', result);
            const keys: string[] = [];
            // 给节点数据加上key属性
            const fun = function (arr: Array<INode>){
                return arr.map((obj: INode)=>{
                    const _obj: INode = {
                        ...obj,
                        key: (obj.type === NODE_TYPE.CLASS ? obj.class_id : obj.item_id) || ''
                    };
                    if (obj.children?.length) {
                       _obj.children = fun(obj.children);
                    }
                    keys.push(_obj.key as string);
                    return _obj
                })
            }
            const _data: Array<INode> = fun(result as INode[]);
            console.log('_data', _data);
            setDataSource(_data);
            const _expandedKeys = expandedKeys.filter(key=>keys.includes(key));
            console.log('_expandedKeys', _expandedKeys);
            setExpandedKeys(_expandedKeys);
            if (selectedKeys.length) {
                if (!keys.includes(selectedKeys[0])) {
                    setSelectedKeys([]);
                    setSelectedNode(null);
                }
            }
        } catch(e) {
            console.log(e);
        }
    }, [app_id, expandedKeys, selectedKeys]);

    // 自定义树title
    const renderTreeNodes = (treeData: INode[]) => {
        // console.log('renderTreeNodes', treeData);
        return treeData.map((node: INode)=>{
            const isEditing = editingKey === node.key;
            if (node.children) {
                return (
                    <TreeNode key={node.key} title={
                        isEditing ?  (
                            <Input
                                autoFocus
                                defaultValue={node.title as string}
                                onPressEnter={(event) => handleSave(node, (event.target as HTMLInputElement).value)}
                                onBlur={() => handleSave(node, node.title as string)}
                            />
                        ) : (
                            <div onDoubleClick={() => handleDoubleClick(node.key as  string)}>
                                {node.title}
                            </div>
                        )
                    }
                              data={node}>
                        {renderTreeNodes(node.children)}
                    </TreeNode>
                );
            }
            return (<TreeNode key={node.key}
                             title={ isEditing ?  (
                                 <Input
                                     autoFocus
                                     defaultValue={node.title as string}
                                     onPressEnter={(event) => handleSave(node, (event.target as HTMLInputElement).value)}
                                     onBlur={() => handleSave(node, node.title as string)}
                                 />
                             ) : (
                                 <div onDoubleClick={() => handleDoubleClick(node.key as  string)}>
                                     {node.title}
                                 </div>
                             )
                             }
                             data={node} />
            );
        })
    };

    // 双击重命名
    const handleDoubleClick = (key: string) => {
        setEditingKey(key);
    };

    // 修改名字后保存
    const handleSave = async(node: INode, newName: string) => {
        if (!newName) {
            message.warn('不允许输入空字符串');
            return
        }
        console.log('handleSave', node, newName);
        if(node.type === NODE_TYPE.CLASS) { // 修改分类名保存
            try{
                const params: {class_id: string, class_name: string, pid: string} = {
                    class_id: node.class_id,
                    class_name: newName,
                    pid: node.pid ||''
                }
                const res: IResult = await request.projectInfo.updateType(params);
                if (res.errcode === 0) {
                    message.info('重命名成功');
                    // 更新左侧树数据
                    fetchTreeData();
                } else {
                    message.error('重命名失败')
                }
            } catch(e){
                console.log(e);
            }
        } else {  // 修改项目名保存
            try{
                const params: {class_id: string, index_name: string, item_id: string} = { class_id: node.pid || '', item_id: node.item_id, index_name: newName  }
                const res: IResult = await request.projectInfo.changeIndexType(params);
                if (res.errcode === 0) {
                    message.info('重命名成功');
                    // 更新左侧树数据
                    fetchTreeData();
                } else {
                    message.error('重命名失败');
                }
            } catch (e) {
                console.log(e);
            }
        }
        setEditingKey(null);
    };

    // 删除索引集合
    const handleDeleteIndex = async(node: INode)=>{
        console.log('handleDeleteIndex', node);
        try{
           const params: {app_id: string, index_id: string } = { app_id, index_id: node.item_id };
           const res : IResult = await request.projectInfo.deleteIndex(params);
           console.log('handleDeleteIndex res', res);
            if (res.errcode === 0) {
                message.info('删除成功');
                // 更新左侧树数据
                fetchTreeData();
            } else {
                message.error('删除失败');
            }
        }catch(e) {
            console.log(e);
        }
    }

    // 自定义树节点title
    const renderTreeNode = (treeNode: TreeNodeNormal & { data: INode}) => {
        // console.log('renderTreeNode', treeNode);
        const menu: any = (
            <Menu>
                {
                    ACTION_DROP_LIST.map((obj: Action)=>{
                        return (
                            <Menu.Item
                                key={obj.id}
                                onClick={() => dropMenuClick(obj, treeNode.data)}
                            >{obj.name}</Menu.Item>
                        )
                    })
                }
            </Menu>
        );

        const menu2: any = (
            <Menu>
                {
                    ACTION_DROP_LIST2.map((obj: Action)=>{
                        return (
                            <Menu.Item
                                key={obj.id}
                                onClick={() => dropMenuClick(obj, treeNode.data)}
                            >{obj.name}</Menu.Item>
                        )
                    })
                }
            </Menu>
        );

        const renderTitle = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
                <span>{treeNode.title}</span>
                {
                    treeNode.data.type === NODE_TYPE.CLASS ? (<div>
                        <Dropdown
                            trigger={["hover"]}
                            overlay={menu}
                            placement='bottomRight'
                        >
                            <span><PlusOutlined style={{fontSize: '18px', padding: '1px'}}/></span>
                        </Dropdown>
                        <Dropdown
                            trigger={["hover"]}
                            overlay={menu2}
                            placement='bottomRight'
                        >
                            <span><MoreOutlined rotate={90} style={{fontSize: '18px', padding: '1px'}} /></span>
                        </Dropdown>
                    </div> ) : <CloseOutlined onClick={()=>handleDeleteIndex(treeNode.data)} />
                }
            </div>
        );

        return renderTitle;
    };

    // 点击右键菜单响应函数
    const dropMenuClick = async (obj: Action, node: INode) => {
        console.log('dropMenuClick', obj, node);
        setModalType(obj.id);
        setVisible(true);
        setOperatorNode(node);
        if (obj.id === OPERATOR_TYPE.RENAME_TYPE) {
            form.setFieldsValue({title: node.title });
        }

    };
    // 创建分类
    const handleOnAdd = ()=>{
        setVisible(true);
        setModalType(OPERATOR_TYPE.ADD_TYPE);
        setOperatorNode(null);
    };

    const onDrop = async (info: any) => {
        console.log("onDrop info", info);
        console.log(info);
        const {node, dragNode, dropToGap} = info;

        const dropPos = info.node.pos.split('-');
        // const dropKey = info.node.key;     // 参照节点
        // const dragKey = info.dragNode.key; // 拖动节点
        // const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        let parentKey = '';
        if (dropToGap) {
            if (dragNode.data.type === NODE_TYPE.CLASS) {
                parentKey = node.props.data.data.pid;
            } else {
                // parentKey = node.props.data.key;
                parentKey = node.props.data.data.pid;
            }
        } else {
            parentKey = node.props.data?.key || ''
        }
        console.log('parentKey', parentKey);

        if (dragNode.data.type === NODE_TYPE.CLASS) { // 拖动分类
            try {
                const params = {
                    class_id: dragNode.key,
                    pid: parentKey
                }
                const res: IResult = await request.projectInfo.updateType(params);
                if (res.errcode === 0) {
                    fetchTreeData();
                }
            } catch (e){
                console.log(e);
            }
        } else { // 拖动项目
            if (!parentKey) {
                message.warn('禁止将项目拖到最外层');
                return;
            }
            try {
                const params = {
                    class_id: parentKey,
                    index_id: dragNode.key,
                }
                const res : IResult = await request.projectInfo.changeIndexType(params);
                if (res.errcode === 0) {
                    fetchTreeData();
                }
            }catch (e) {
                console.log(e);
            }
        }
    };

    // 选中节点响应函数
    const handleOnSelect = (selectedKeys: any[], event: any)=>{
        console.log('handleOnSelect', selectedKeys, event);
        if(event.selected){
            setSelectedNode(event.node.data);
            setSelectedKeys([event.node.key]);
        }
        else{
            setSelectedNode(null);
            setSelectedKeys([]);
        }
    }

    // 获取分类下拉菜单弹窗里面的内容
    const getModalContent = (modalType: OPERATOR_TYPE):JSX.Element|null=>{
        switch(modalType){
            case OPERATOR_TYPE.ADD_TYPE:  // 添加分类
            case OPERATOR_TYPE.RENAME_TYPE: // 分类重命名
                return (
                    <Form form={form} name='project-form'
                          layout='vertical'
                    >
                        <Form.Item
                            label='分类名称'
                            name='title'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入分类名称'
                                }
                            ]}
                        >
                            <Input placeholder='请输入' />
                        </Form.Item>
                    </Form>
                )
            case OPERATOR_TYPE.ADD_PROJECT: // 添加项目
                return (
                    <Form className='modal-form' form={form}
                          name='project-form'
                          layout='vertical'
                    >
                        <Form.Item
                            label='项目名称'
                            name='title'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入项目名称'
                                }
                            ]}
                        >
                            <Input placeholder='请输入' />
                        </Form.Item>
                    </Form>
                )
            case OPERATOR_TYPE.DELETE_TYPE:  // 删除分类
                return <div style={{padding: '10px'}}>删除后此分类及项目将一并删除，删除后不可恢复，确定要删除?</div>
            default:
                return null;
        }
    }

    // 弹窗响应函数（创建分类、项目、删除分类）
    const handleOk = async()=>{
        console.log('handleOk');
        switch(modalType){
            case OPERATOR_TYPE.ADD_TYPE:  // 创建分类
                try{
                    const res: {title: string}  = await form.validateFields();
                    form.resetFields();
                    setVisible(false);
                    try{
                        const params: { app_id: string, pid: string, class_name: string, type: string } = {
                            app_id,
                            pid: operatorNode ? operatorNode.class_id : '0',
                            class_name: res.title,
                            type: 'index'
                        }
                        await request.projectInfo.createType(params);
                        message.info('创建分类成功');
                        // 更新左侧树数据
                        fetchTreeData();
                    } catch(e){
                        console.log(e);
                        message.error('创建分类失败')
                    }
                } catch(e) {
                    console.log(e);
                }
                break;
            case OPERATOR_TYPE.ADD_PROJECT:  // 创建项目
                try{
                    const res: {title: string}  = await form.validateFields();
                    form.resetFields();
                    setVisible(false);
                    try{
                        const params: { app_id: string, class_id: string, index_name: string } = {
                            app_id,
                            index_name: res.title,
                            class_id: operatorNode ? operatorNode?.class_id : '0',
                        }
                        await request.projectInfo.createIndex(params);
                        message.info('创建项目成功');
                        // 更新左侧树数据
                        fetchTreeData();
                    } catch(e){
                        console.log(e);
                        message.error('创建项目失败')
                    }
                } catch(e) {
                    console.log(e);
                }
                break;
            case OPERATOR_TYPE.DELETE_TYPE:  // 删除分类
                try{
                    const params: {class_id: string} = {class_id: operatorNode?.class_id || ''};
                    await request.projectInfo.deleteType(params);
                    setVisible(false);
                    message.info('删除分类成功');
                    // 更新左侧树数据
                    fetchTreeData();
                } catch(e) {
                    console.log(e);
                    message.error('删除分类失败')
                }
                break;
            case OPERATOR_TYPE.RENAME_TYPE: // 重命名
                try{
                    const res: {title: string} = await form.validateFields();
                    form.resetFields();
                    setVisible(false);
                    handleSave(operatorNode as INode, res.title);
                } catch (e) {
                    console.log(e);
                }
               break;
            default:
        }
    };

    const handleCancel = ()=>{
        setVisible(false);
    };

    // 展开收起树节点
    const handleExpand = ()=>{
        setIsExpand(val=>!val);
    }

    useEffect(()=>{
        if (!isExpand) {
            setExpandedKeys([]);
        } else if(dataSource.length){
            const keys = []
            const fun = (arr: INode[], keys: string[])=>{
                return arr.forEach(obj=>{
                    keys.push(obj.key as string);
                    if(obj.children && obj.children.length) {
                        return fun(obj.children, keys);
                    }
                })
            }
            fun(dataSource, keys);
            console.log('keys', keys);
            setExpandedKeys(keys);
        }
    }, [isExpand])

    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue);
        setExpandedKeys(expandedKeysValue as string[]);
    };

    return (
       <Layout className='search-engine-project'>
           <Sider className='search-engine-project-left'
                  width={280}
           >
               <div className='search-engine-project-title'>
                   <span>全部项目</span> <img onClick={handleExpand} src={expandIcon} alt='pic' width={16} height={16} />
               </div>
               <Tree
                   ref={treeRef }
                   // // checkable
                   className='search-engine-project-tree'
                   // // defaultExpandedKeys={expandedKeys}
                   draggable
                   blockNode
                   expandedKeys={expandedKeys}
                   // onDragEnter={onDragEnter}
                   onDrop={onDrop}
                   titleRender={renderTreeNode}
                   autoExpandParent={true}
                   onSelect={(selectedKeys: any[], event: any)=>{ handleOnSelect(selectedKeys, event) }}
                   selectedKeys={ selectedKeys }
                   onExpand={onExpand}
               >
                   {
                       renderTreeNodes(dataSource)
                   }
               </Tree>
               <Button type='link' size='large' onClick={ handleOnAdd } style={{color: '#1B9AEE'}} >创建分类</Button>
           </Sider>
           <Layout>
               <Content className='search-engine-project-right'>
                   <Row className='search-engine-project-right-title'>
                   <Col span={24} className='search-engine-project-right-name' >{ selectedNode ? selectedNode.title : '' } </Col> </Row>
                   <Row className='search-engine-project-right-content'>
                       <Col span={24}>
                           <Tabs  defaultActiveKey='config' tabBarGutter={50}   >
                               <Tabs.TabPane tab='配置' key='config' >
                                   <Config selectedNode ={selectedNode} app_id={app_id}/>
                               </Tabs.TabPane>
                               <Tabs.TabPane tab='搜索' key='search' >
                                   <SearchInfo selectedNode ={selectedNode} app_id={app_id}/>
                               </Tabs.TabPane>
                               <Tabs.TabPane tab='字典' key='dictionary' >
                                   <Dictionary selectedNode ={selectedNode} app_id={app_id}/>
                               </Tabs.TabPane>
                               <Tabs.TabPane tab='日志' key='log' >
                                   <Log selectedNode ={selectedNode} app_id={app_id}/>
                               </Tabs.TabPane>
                           </Tabs>
                       </Col>
                   </Row>
                   {
                       visible ? <Modal
                           open={visible}
                           title={ ACTION_DROP_LIST.concat(ACTION_DROP_LIST2).find((obj:Action)=>obj.id===modalType)?.name || '' }
                           okText='确定'
                           onOk={() => handleOk()}
                           onCancel={() => handleCancel()}
                           className='modal-basic-style'
                       >
                           { getModalContent(modalType)}
                       </Modal> : null
                   }

               </Content>
           </Layout>
       </Layout>
    )
}

export default memo(SearchEngineProjectInfo);