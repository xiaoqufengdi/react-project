import {Tabs} from 'antd';
import SearchEngineProjectInfo from '@src/container/page/service-content/project';
import DictionaryInfo from '@src/container/page/service-content/dictionary';
import LogInfo from '@src/container/page/service-content/log';
import './index.less';

const ServiceContent = (): JSX.Element=>{
    return (
        <div className='service-content'>
            <Tabs  defaultActiveKey='config' tabBarGutter={50} style={{ height: '100%' }}>
                <Tabs.TabPane tab='项目' key='project' >
                    <SearchEngineProjectInfo/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='字典' key='dictionary' >
                    <DictionaryInfo/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='日志' key='log' >
                    <LogInfo/>
                </Tabs.TabPane>
            </Tabs>
        </div>

    )
}

export default ServiceContent;