/**
 * Created by Jacky.gao on 2016/8/8.
 */
import React,{Component,PropTypes} from 'react';
import ReactDOM from 'react-dom';
import * as event from '../event.js';
import * as action from '../action.js';
import * as componentEvent from '../../components/componentEvent.js';
import CommonDialog from '../../components/dialog/component/CommonDialog.jsx';

export default class RenameDialog extends Component{
    constructor(props){
        super(props);
        this.state={name:''};
    }
    componentDidMount(){
        event.eventEmitter.on(event.SHOW_RENAME_DIALOG,data=>{
            $(ReactDOM.findDOMNode(this)).modal('show');
            const fullPath=data.fullPath,name=data.name,pos=fullPath.lastIndexOf('/');
            const parentPath=fullPath.substring(0,pos);
            this.setState({name,parentPath,fullPath});
        });
        event.eventEmitter.on(event.HIDE_RENAME_DIALOG,()=>{
            $(ReactDOM.findDOMNode(this)).modal('hide');
        });
        const _this=this;
        $(ReactDOM.findDOMNode(this)).bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields:{
                newFileNameForRename:{
                    validators: {
                        notEmpty: {
                            message: '文件名不能为空'
                        },
                        regexp: {
                            regexp: "^(?!_)(?!-)[0-9a-zA-Z_-](\.){1,}$",
                            message: '名称只能包含英文字母、数字、下划线、中划线,且不能以下划线、中划线开头'
                        },
                        remote:{
                            message:'文件名已存在',
                            type:"POST",
                            url:window._server+"/frame/fileExistCheck",
                            data: function(validator) {
                                return {
                                    fullFileName: _this.state.parentPath+'/'+validator.getFieldElements('newFileNameForRename').val()
                                };
                            }
                        }
                    }
                }
            }
        });
    }
    render(){
        const dispatch=this.props.dispatch;
        const buttons=[{
            name:'确定',
            className:'btn btn-success',
            icon:'rf rf-save',
            click:function () {
                $(ReactDOM.findDOMNode(this)).data('bootstrapValidator').validate();
                const isValid=$(ReactDOM.findDOMNode(this)).data('bootstrapValidator').isValid();
                if(!isValid){
                    return;
                }
                const {parentPath,fullPath}=this.state;
                const newName=parentPath+'/'+this.state.name;
                componentEvent.eventEmitter.emit(componentEvent.SHOW_LOADING);
                setTimeout(function () {
                    dispatch(action.rename(fullPath,newName));
                },100);
            }.bind(this)
        }];
        const body=(
            <div className="form-group">
                <label>名称</label>
                <input type="text" className="form-control" name="newFileNameForRename" value={this.state.name} onChange={function(e) {
                    this.setState({name:e.target.value});
                }.bind(this)}></input>
            </div>
        );
        return (<CommonDialog body={body} buttons={buttons} title='重命名'/>);
    }
};