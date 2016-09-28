/**
 * Created by jacky on 2016/6/19.
 */
import '../../../css/iconfont.css';
import React,{Component,PropTypes} from 'react';
import ReactDOM from 'react-dom';
import CommonDialog from './CommonDialog.jsx';
import CommonTree from '../../tree/component/CommonTree.jsx';
import * as action from '../../componentAction.js';
import * as event from '../../componentEvent.js';
import VersionSelectDialog from './VersionSelectDialog.jsx';

export default class KnowledgeTreeDialog extends Component {
    constructor(props){
        super(props);
        this.state={title:'选择资源'};
    }
    componentDidMount(){
        event.eventEmitter.on(event.OPEN_KNOWLEDGE_TREE_DIALOG,(config)=>{
            this.callback=config.callback;
            action.loadResourceTreeData({project:config.project,forLib:config.forLib,fileType:config.fileType},function(data){
                if(config.fileType && config.fileType==='DIR'){
                    this.setState({data,fileType:config.fileType,title:"选择目录"});
                }else{
                    this.setState({data,fileType:config.fileType});
                }
                $("#_knowledge_tree_dialog_container").children('.modal').modal('show');
            }.bind(this));
        });
        event.eventEmitter.on(event.HIDE_KNOWLEDGE_TREE_DIALOG,()=>{
            $("#_knowledge_tree_dialog_container").children('.modal').modal('hide');
        });
        event.eventEmitter.on(event.TREE_NODE_CLICK,(nodeData)=>{
            this.currentNodeData=nodeData;
        });
        event.eventEmitter.on(event.TREE_DIR_NODE_CLICK,(nodeData)=>{
            this.currentNodeData=nodeData;
        });
    }
    componentWillUnmount(){
        event.eventEmitter.removeAllListeners(event.OPEN_KNOWLEDGE_TREE_DIALOG);
        event.eventEmitter.removeAllListeners(event.HIDE_KNOWLEDGE_TREE_DIALOG);
        event.eventEmitter.removeAllListeners(event.TREE_NODE_CLICK);
    }
    render(){
        const body=(
            <div className='tree' style={{marginLeft:'10px'}}>
                <CommonTree data={this.state.data} selectDir={this.props.selectDir}/>
            </div>
        );
        const fileType=this.state.fileType || '';
        const buttons=[
            {
                name:'确定',
                className:'btn btn-danger',
                icon:'glyphicon glyphicon-floppy-saved',
                click:function () {
                    if(this.currentNodeData){
                        this.callback(this.currentNodeData.fullPath,'LATEST');
                        event.eventEmitter.emit(event.HIDE_KNOWLEDGE_TREE_DIALOG);
                    }else{
                        if(fileType==='DIR'){
                            bootbox.alert("请先选择一个目录");
                        }else{
                            bootbox.alert("请先选择一个文件");
                        }
                    }
                }.bind(this)
            }
        ];
        if(fileType!=='DIR'){
            buttons.unshift({
                name:'选择版本',
                className:'btn btn-primary',
                icon:'glyphicon glyphicon-hand-up',
                click:function () {
                    if(this.currentNodeData){
                        event.eventEmitter.emit(event.OPEN_VERSION_SELECT_DIALOG,{file:this.currentNodeData.fullPath,callback:this.callback});
                    }else{
                        bootbox.alert("请先选择一个文件");
                    }
                }.bind(this)
            });
        }
        if(fileType==='DIR'){
            return (
                <div id="_knowledge_tree_dialog_container">
                    <CommonDialog title={this.state.title} body={body} buttons={buttons}/>
                </div>
            );
        }else{
            return (
                <div>
                    <VersionSelectDialog/>
                    <div id="_knowledge_tree_dialog_container">
                        <CommonDialog title={this.state.title} body={body} buttons={buttons}/>
                    </div>
                </div>
            );
        }
    }
}