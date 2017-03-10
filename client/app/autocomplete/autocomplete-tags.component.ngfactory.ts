/**
 * This file is generated by the Angular 2 template compiler.
 * Do not edit.
 */
 /* tslint:disable */

import * as import0 from '@angular/core/src/render/api';
import * as import1 from '@angular/core/src/linker/view';
import * as import2 from '@angular/core/src/linker/element';
import * as import3 from './autocomplete-datasource.service';
import * as import4 from './autocomplete-tags.component';
import * as import5 from '@angular/core/src/linker/view_utils';
import * as import6 from '@angular/core/src/di/injector';
import * as import7 from '@angular/core/src/linker/view_type';
import * as import8 from '@angular/core/src/change_detection/change_detection';
import * as import9 from '@angular/http/src/http';
import * as import10 from '../error_handling/error.service';
import * as import11 from '@angular/core/src/metadata/view';
import * as import12 from '@angular/core/src/linker/component_factory';
import * as import13 from '@angular/common/src/directives/ng_if';
import * as import14 from './autocomplete.component';
import * as import15 from '@angular/common/src/directives/ng_for';
import * as import16 from '@angular/core/src/linker/template_ref';
import * as import17 from './autocomplete.component.ngfactory';
import * as import18 from '@angular/core/src/linker/element_ref';
import * as import19 from '@angular/core/src/change_detection/differs/iterable_differs';
var renderType_AutoCompleteTagsComponent_Host:import0.RenderComponentType = (null as any);
class _View_AutoCompleteTagsComponent_Host0 extends import1.AppView<any> {
  _el_0:any;
  /*private*/ _appEl_0:import2.AppElement;
  _AutocompleteDatasourceService_0_4:import3.AutocompleteDatasourceService;
  _AutoCompleteTagsComponent_0_5:import4.AutoCompleteTagsComponent;
  constructor(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement) {
    super(_View_AutoCompleteTagsComponent_Host0,renderType_AutoCompleteTagsComponent_Host,import7.ViewType.HOST,viewUtils,parentInjector,declarationEl,import8.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import2.AppElement {
    this._el_0 = this.selectOrCreateHostElement('app-autocomplete-tags',rootSelector,(null as any));
    this._appEl_0 = new import2.AppElement(0,(null as any),this,this._el_0);
    var compView_0:any = viewFactory_AutoCompleteTagsComponent0(this.viewUtils,this.injector(0),this._appEl_0);
    this._AutocompleteDatasourceService_0_4 = new import3.AutocompleteDatasourceService(this.parentInjector.get(import9.Http),this.parentInjector.get(import10.ErrorService));
    this._AutoCompleteTagsComponent_0_5 = new import4.AutoCompleteTagsComponent(this._AutocompleteDatasourceService_0_4);
    this._appEl_0.initComponent(this._AutoCompleteTagsComponent_0_5,[],compView_0);
    compView_0.create(this._AutoCompleteTagsComponent_0_5,this.projectableNodes,(null as any));
    this.init([].concat([this._el_0]),[this._el_0],[],[]);
    return this._appEl_0;
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import3.AutocompleteDatasourceService) && (0 === requestNodeIndex))) { return this._AutocompleteDatasourceService_0_4; }
    if (((token === import4.AutoCompleteTagsComponent) && (0 === requestNodeIndex))) { return this._AutoCompleteTagsComponent_0_5; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    if (((this.numberOfChecks === 0) && !throwOnChange)) { this._AutoCompleteTagsComponent_0_5.ngOnInit(); }
    this.detectContentChildrenChanges(throwOnChange);
    this.detectViewChildrenChanges(throwOnChange);
  }
}
function viewFactory_AutoCompleteTagsComponent_Host0(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement):import1.AppView<any> {
  if ((renderType_AutoCompleteTagsComponent_Host === (null as any))) { (renderType_AutoCompleteTagsComponent_Host = viewUtils.createRenderComponentType('',0,import11.ViewEncapsulation.None,[],{})); }
  return new _View_AutoCompleteTagsComponent_Host0(viewUtils,parentInjector,declarationEl);
}
export const AutoCompleteTagsComponentNgFactory:import12.ComponentFactory<import4.AutoCompleteTagsComponent> = new import12.ComponentFactory<import4.AutoCompleteTagsComponent>('app-autocomplete-tags',viewFactory_AutoCompleteTagsComponent_Host0,import4.AutoCompleteTagsComponent);
const styles_AutoCompleteTagsComponent:any[] = [];
var renderType_AutoCompleteTagsComponent:import0.RenderComponentType = (null as any);
class _View_AutoCompleteTagsComponent0 extends import1.AppView<import4.AutoCompleteTagsComponent> {
  _el_0:any;
  _text_1:any;
  _el_2:any;
  _text_3:any;
  _text_4:any;
  _el_5:any;
  _text_6:any;
  _anchor_7:any;
  /*private*/ _appEl_7:import2.AppElement;
  _TemplateRef_7_5:any;
  _NgIf_7_6:import13.NgIf;
  _text_8:any;
  _el_9:any;
  /*private*/ _appEl_9:import2.AppElement;
  _AutoCompleteComponent_9_4:import14.AutoCompleteComponent;
  _text_10:any;
  _text_11:any;
  _text_12:any;
  _text_13:any;
  _el_14:any;
  _text_15:any;
  _anchor_16:any;
  /*private*/ _appEl_16:import2.AppElement;
  _TemplateRef_16_5:any;
  _NgFor_16_6:import15.NgFor;
  _text_17:any;
  /*private*/ _expr_0:any;
  /*private*/ _expr_6:any;
  /*private*/ _expr_7:any;
  /*private*/ _expr_8:any;
  /*private*/ _expr_9:any;
  /*private*/ _expr_10:any;
  /*private*/ _expr_11:any;
  /*private*/ _expr_12:any;
  /*private*/ _expr_13:any;
  /*private*/ _expr_14:any;
  constructor(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement) {
    super(_View_AutoCompleteTagsComponent0,renderType_AutoCompleteTagsComponent,import7.ViewType.COMPONENT,viewUtils,parentInjector,declarationEl,import8.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import2.AppElement {
    const parentRenderNode:any = this.renderer.createViewRoot(this.declarationAppElement.nativeElement);
    this._el_0 = this.renderer.createElement(parentRenderNode,'div',(null as any));
    this.renderer.setElementAttribute(this._el_0,'class','form-group row');
    this._text_1 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    this._el_2 = this.renderer.createElement(this._el_0,'label',(null as any));
    this.renderer.setElementAttribute(this._el_2,'class','col-xs-2 col-form-label');
    this._text_3 = this.renderer.createText(this._el_2,'Tags',(null as any));
    this._text_4 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    this._el_5 = this.renderer.createElement(this._el_0,'div',(null as any));
    this.renderer.setElementAttribute(this._el_5,'class','col-xs-10');
    this._text_6 = this.renderer.createText(this._el_5,'\n        ',(null as any));
    this._anchor_7 = this.renderer.createTemplateAnchor(this._el_5,(null as any));
    this._appEl_7 = new import2.AppElement(7,5,this,this._anchor_7);
    this._TemplateRef_7_5 = new import16.TemplateRef_(this._appEl_7,viewFactory_AutoCompleteTagsComponent1);
    this._NgIf_7_6 = new import13.NgIf(this._appEl_7.vcRef,this._TemplateRef_7_5);
    this._text_8 = this.renderer.createText(this._el_5,'\n        ',(null as any));
    this._el_9 = this.renderer.createElement(this._el_5,'app-autocomplete',(null as any));
    this._appEl_9 = new import2.AppElement(9,5,this,this._el_9);
    var compView_9:any = import17.viewFactory_AutoCompleteComponent0(this.viewUtils,this.injector(9),this._appEl_9);
    this._AutoCompleteComponent_9_4 = new import14.AutoCompleteComponent(new import18.ElementRef(this._el_9));
    this._appEl_9.initComponent(this._AutoCompleteComponent_9_4,[],compView_9);
    this._text_10 = this.renderer.createText((null as any),'\n        ',(null as any));
    compView_9.create(this._AutoCompleteComponent_9_4,[],(null as any));
    this._text_11 = this.renderer.createText(this._el_5,'\n    ',(null as any));
    this._text_12 = this.renderer.createText(this._el_0,'\n',(null as any));
    this._text_13 = this.renderer.createText(parentRenderNode,'\n\n',(null as any));
    this._el_14 = this.renderer.createElement(parentRenderNode,'div',(null as any));
    this.renderer.setElementAttribute(this._el_14,'class','form-group row col-xs-offset-2');
    this._text_15 = this.renderer.createText(this._el_14,'\n    ',(null as any));
    this._anchor_16 = this.renderer.createTemplateAnchor(this._el_14,(null as any));
    this._appEl_16 = new import2.AppElement(16,14,this,this._anchor_16);
    this._TemplateRef_16_5 = new import16.TemplateRef_(this._appEl_16,viewFactory_AutoCompleteTagsComponent2);
    this._NgFor_16_6 = new import15.NgFor(this._appEl_16.vcRef,this._TemplateRef_16_5,this.parentInjector.get(import19.IterableDiffers),this.ref);
    this._text_17 = this.renderer.createText(this._el_14,'\n',(null as any));
    this._expr_0 = import8.UNINITIALIZED;
    var disposable_0:Function = this.renderer.listen(this._el_9,'notifySelectedItem',this.eventHandler(this._handle_notifySelectedItem_9_0.bind(this)));
    var disposable_1:Function = this.renderer.listen(this._el_9,'clearErrorStr',this.eventHandler(this._handle_clearErrorStr_9_1.bind(this)));
    var disposable_2:Function = this.renderer.listen(this._el_9,'notifyError',this.eventHandler(this._handle_notifyError_9_2.bind(this)));
    var disposable_3:Function = this.renderer.listenGlobal('document','click',this.eventHandler(this._handle_click_9_3.bind(this)));
    var disposable_4:Function = this.renderer.listen(this._el_9,'keydown',this.eventHandler(this._handle_keydown_9_4.bind(this)));
    this._expr_6 = import8.UNINITIALIZED;
    this._expr_7 = import8.UNINITIALIZED;
    this._expr_8 = import8.UNINITIALIZED;
    this._expr_9 = import8.UNINITIALIZED;
    this._expr_10 = import8.UNINITIALIZED;
    this._expr_11 = import8.UNINITIALIZED;
    this._expr_12 = import8.UNINITIALIZED;
    this._expr_13 = import8.UNINITIALIZED;
    const subscription_0:any = this._AutoCompleteComponent_9_4.notifySelectedItem.subscribe(this.eventHandler(this._handle_notifySelectedItem_9_0.bind(this)));
    const subscription_1:any = this._AutoCompleteComponent_9_4.clearErrorStr.subscribe(this.eventHandler(this._handle_clearErrorStr_9_1.bind(this)));
    const subscription_2:any = this._AutoCompleteComponent_9_4.notifyError.subscribe(this.eventHandler(this._handle_notifyError_9_2.bind(this)));
    this._expr_14 = import8.UNINITIALIZED;
    this.init([],[
      this._el_0,
      this._text_1,
      this._el_2,
      this._text_3,
      this._text_4,
      this._el_5,
      this._text_6,
      this._anchor_7,
      this._text_8,
      this._el_9,
      this._text_10,
      this._text_11,
      this._text_12,
      this._text_13,
      this._el_14,
      this._text_15,
      this._anchor_16,
      this._text_17
    ]
    ,[
      disposable_0,
      disposable_1,
      disposable_2,
      disposable_3,
      disposable_4
    ]
    ,[
      subscription_0,
      subscription_1,
      subscription_2
    ]
    );
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import16.TemplateRef) && (7 === requestNodeIndex))) { return this._TemplateRef_7_5; }
    if (((token === import13.NgIf) && (7 === requestNodeIndex))) { return this._NgIf_7_6; }
    if (((token === import14.AutoCompleteComponent) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 10)))) { return this._AutoCompleteComponent_9_4; }
    if (((token === import16.TemplateRef) && (16 === requestNodeIndex))) { return this._TemplateRef_16_5; }
    if (((token === import15.NgFor) && (16 === requestNodeIndex))) { return this._NgFor_16_6; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    var changes:{[key: string]:import8.SimpleChange} = (null as any);
    const currVal_0:any = this.context.error;
    if (import5.checkBinding(throwOnChange,this._expr_0,currVal_0)) {
      this._NgIf_7_6.ngIf = currVal_0;
      this._expr_0 = currVal_0;
    }
    changes = (null as any);
    const currVal_6:any = this.context.allowCustomValues;
    if (import5.checkBinding(throwOnChange,this._expr_6,currVal_6)) {
      this._AutoCompleteComponent_9_4.allowUserEnteredValues = currVal_6;
      if ((changes === (null as any))) { (changes = {}); }
      changes['allowUserEnteredValues'] = new import8.SimpleChange(this._expr_6,currVal_6);
      this._expr_6 = currVal_6;
    }
    const currVal_7:any = this.context.allowEnterKey;
    if (import5.checkBinding(throwOnChange,this._expr_7,currVal_7)) {
      this._AutoCompleteComponent_9_4.allowEnterKey = currVal_7;
      if ((changes === (null as any))) { (changes = {}); }
      changes['allowEnterKey'] = new import8.SimpleChange(this._expr_7,currVal_7);
      this._expr_7 = currVal_7;
    }
    const currVal_8:any = this.context.itemList;
    if (import5.checkBinding(throwOnChange,this._expr_8,currVal_8)) {
      this._AutoCompleteComponent_9_4.dataSource = currVal_8;
      if ((changes === (null as any))) { (changes = {}); }
      changes['dataSource'] = new import8.SimpleChange(this._expr_8,currVal_8);
      this._expr_8 = currVal_8;
    }
    const currVal_9:any = this.context.autocompletePlaceholder;
    if (import5.checkBinding(throwOnChange,this._expr_9,currVal_9)) {
      this._AutoCompleteComponent_9_4.placeholderTerm = currVal_9;
      if ((changes === (null as any))) { (changes = {}); }
      changes['placeholderTerm'] = new import8.SimpleChange(this._expr_9,currVal_9);
      this._expr_9 = currVal_9;
    }
    const currVal_10:any = this.context.allowDirectClick;
    if (import5.checkBinding(throwOnChange,this._expr_10,currVal_10)) {
      this._AutoCompleteComponent_9_4.allowDirectClick = currVal_10;
      if ((changes === (null as any))) { (changes = {}); }
      changes['allowDirectClick'] = new import8.SimpleChange(this._expr_10,currVal_10);
      this._expr_10 = currVal_10;
    }
    const currVal_11:any = true;
    if (import5.checkBinding(throwOnChange,this._expr_11,currVal_11)) {
      this._AutoCompleteComponent_9_4.queryRequired = currVal_11;
      if ((changes === (null as any))) { (changes = {}); }
      changes['queryRequired'] = new import8.SimpleChange(this._expr_11,currVal_11);
      this._expr_11 = currVal_11;
    }
    const currVal_12:any = 4;
    if (import5.checkBinding(throwOnChange,this._expr_12,currVal_12)) {
      this._AutoCompleteComponent_9_4.queryMinLength = currVal_12;
      if ((changes === (null as any))) { (changes = {}); }
      changes['queryMinLength'] = new import8.SimpleChange(this._expr_12,currVal_12);
      this._expr_12 = currVal_12;
    }
    const currVal_13:any = 32;
    if (import5.checkBinding(throwOnChange,this._expr_13,currVal_13)) {
      this._AutoCompleteComponent_9_4.queryMaxLength = currVal_13;
      if ((changes === (null as any))) { (changes = {}); }
      changes['queryMaxLength'] = new import8.SimpleChange(this._expr_13,currVal_13);
      this._expr_13 = currVal_13;
    }
    if ((changes !== (null as any))) { this._AutoCompleteComponent_9_4.ngOnChanges(changes); }
    changes = (null as any);
    const currVal_14:any = this.context.selectedItems;
    if (import5.checkBinding(throwOnChange,this._expr_14,currVal_14)) {
      this._NgFor_16_6.ngForOf = currVal_14;
      if ((changes === (null as any))) { (changes = {}); }
      changes['ngForOf'] = new import8.SimpleChange(this._expr_14,currVal_14);
      this._expr_14 = currVal_14;
    }
    if ((changes !== (null as any))) { this._NgFor_16_6.ngOnChanges(changes); }
    if (!throwOnChange) { this._NgFor_16_6.ngDoCheck(); }
    this.detectContentChildrenChanges(throwOnChange);
    this.detectViewChildrenChanges(throwOnChange);
  }
  private _handle_notifySelectedItem_9_0($event:any):boolean {
    this.markPathToRootAsCheckOnce();
    const pd_0:any = ((<any>this.context.selectItem($event)) !== false);
    return (true && pd_0);
  }
  private _handle_clearErrorStr_9_1($event:any):boolean {
    this.markPathToRootAsCheckOnce();
    const pd_0:any = ((<any>this.context.clearErrorStr()) !== false);
    return (true && pd_0);
  }
  private _handle_notifyError_9_2($event:any):boolean {
    this.markPathToRootAsCheckOnce();
    const pd_0:any = ((<any>this.context.setErrorStr($event)) !== false);
    return (true && pd_0);
  }
  private _handle_click_9_3($event:any):boolean {
    this._appEl_9.componentView.markPathToRootAsCheckOnce();
    const pd_0:any = ((<any>this._AutoCompleteComponent_9_4.handleClick($event)) !== false);
    return (true && pd_0);
  }
  private _handle_keydown_9_4($event:any):boolean {
    this._appEl_9.componentView.markPathToRootAsCheckOnce();
    const pd_0:any = ((<any>this._AutoCompleteComponent_9_4.handleKeyDown($event)) !== false);
    return (true && pd_0);
  }
}
export function viewFactory_AutoCompleteTagsComponent0(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement):import1.AppView<import4.AutoCompleteTagsComponent> {
  if ((renderType_AutoCompleteTagsComponent === (null as any))) { (renderType_AutoCompleteTagsComponent = viewUtils.createRenderComponentType('/Users/evisa/Thematicum/client/app/autocomplete/autocomplete-tags.component.html',0,import11.ViewEncapsulation.None,styles_AutoCompleteTagsComponent,{})); }
  return new _View_AutoCompleteTagsComponent0(viewUtils,parentInjector,declarationEl);
}
class _View_AutoCompleteTagsComponent1 extends import1.AppView<any> {
  _el_0:any;
  _text_1:any;
  /*private*/ _expr_0:any;
  constructor(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement) {
    super(_View_AutoCompleteTagsComponent1,renderType_AutoCompleteTagsComponent,import7.ViewType.EMBEDDED,viewUtils,parentInjector,declarationEl,import8.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import2.AppElement {
    this._el_0 = this.renderer.createElement((null as any),'p',(null as any));
    this.renderer.setElementAttribute(this._el_0,'class','error-red-front');
    this._text_1 = this.renderer.createText(this._el_0,'',(null as any));
    this._expr_0 = import8.UNINITIALIZED;
    this.init([].concat([this._el_0]),[
      this._el_0,
      this._text_1
    ]
    ,[],[]);
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this.detectContentChildrenChanges(throwOnChange);
    const currVal_0:any = import5.interpolate(1,'',this.parent.context.error,'');
    if (import5.checkBinding(throwOnChange,this._expr_0,currVal_0)) {
      this.renderer.setText(this._text_1,currVal_0);
      this._expr_0 = currVal_0;
    }
    this.detectViewChildrenChanges(throwOnChange);
  }
}
function viewFactory_AutoCompleteTagsComponent1(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement):import1.AppView<any> {
  return new _View_AutoCompleteTagsComponent1(viewUtils,parentInjector,declarationEl);
}
class _View_AutoCompleteTagsComponent2 extends import1.AppView<any> {
  _el_0:any;
  _text_1:any;
  _el_2:any;
  _text_3:any;
  _text_4:any;
  /*private*/ _expr_1:any;
  constructor(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement) {
    super(_View_AutoCompleteTagsComponent2,renderType_AutoCompleteTagsComponent,import7.ViewType.EMBEDDED,viewUtils,parentInjector,declarationEl,import8.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import2.AppElement {
    this._el_0 = this.renderer.createElement((null as any),'button',(null as any));
    this.renderer.setElementAttribute(this._el_0,'class','btn btn-default btn-tag');
    this.renderer.setElementAttribute(this._el_0,'type','button');
    this._text_1 = this.renderer.createText(this._el_0,'',(null as any));
    this._el_2 = this.renderer.createElement(this._el_0,'span',(null as any));
    this.renderer.setElementAttribute(this._el_2,'class','badge');
    this._text_3 = this.renderer.createText(this._el_2,'X',(null as any));
    this._text_4 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    var disposable_0:Function = this.renderer.listen(this._el_0,'click',this.eventHandler(this._handle_click_0_0.bind(this)));
    this._expr_1 = import8.UNINITIALIZED;
    this.init([].concat([this._el_0]),[
      this._el_0,
      this._text_1,
      this._el_2,
      this._text_3,
      this._text_4
    ]
    ,[disposable_0],[]);
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this.detectContentChildrenChanges(throwOnChange);
    const currVal_1:any = import5.interpolate(1,'\n        ',this.context.$implicit,' ');
    if (import5.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setText(this._text_1,currVal_1);
      this._expr_1 = currVal_1;
    }
    this.detectViewChildrenChanges(throwOnChange);
  }
  private _handle_click_0_0($event:any):boolean {
    this.markPathToRootAsCheckOnce();
    const pd_0:any = ((<any>this.parent.context.deselectItem(this.context.index)) !== false);
    return (true && pd_0);
  }
}
function viewFactory_AutoCompleteTagsComponent2(viewUtils:import5.ViewUtils,parentInjector:import6.Injector,declarationEl:import2.AppElement):import1.AppView<any> {
  return new _View_AutoCompleteTagsComponent2(viewUtils,parentInjector,declarationEl);
}