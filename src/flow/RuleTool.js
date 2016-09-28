/**
 * Created by jacky on 2016/7/18.
 */
import BaseTool from './BaseTool.js';
import RuleNode from './RuleNode.js';
import * as event from '../components/componentEvent.js';

export default class RuleTool extends BaseTool{
    getType(){
        return '规则';
    }
    getIcon(){
        return `<i class="rf rf-rule" style="color:#737383"></i>`
    }
    newNode(){
        return new RuleNode();
    }
    getConfigs(){
        return {
            out:1
        };
    }
    getPropertiesProducer(){
        const _this=this;
        return function (){
            const g=$(`<div></div>`);
            const fileGroup=$(`<div class="form-group"><label>目标规则文件</label></div>`);
            const fileInputGroup=$('<div class="input-group"></div>');
            fileGroup.append(fileInputGroup);
            const fileText=$(`<input type="text" disabled class="form-control">`);
            const self=this;
            fileInputGroup.append(fileText);
            fileText.change(function(){
                self.file=$(this).val();
            });
            fileText.val(this.file);
            const fileButton=$(`<span class="input-group-btn"><button class="btn btn-default"><i class="glyphicon glyphicon-search"></i></span>`);
            fileInputGroup.append(fileButton);
            fileButton.click(function(){
                event.eventEmitter.emit(event.OPEN_KNOWLEDGE_TREE_DIALOG,{
                    project:window._project,
                    callback:function(file,version){
                        file='jcr:'+file;
                        self.file=file;
                        self.version=version;
                        fileText.val(file);
                        versionText.val(version);
                    }
                });
            });
            g.append(fileGroup);
            const versionGroup=$(`<div class="form-group"><label>文件版本</label></div>`);
            const versionText=$(`<input type="text" disabled class="form-control">`);
            versionGroup.append(versionText);
            g.append(versionGroup);
            versionText.val(this.version);
            g.append(_this.getCommonProperties(this));
            return g;
        }
    }
}