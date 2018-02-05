import {Router, Routes} from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import {TreeNodes} from '../../../app.menu';

@Injectable()
export class BaMenuService {
  menuItems = new BehaviorSubject<any[]>([]);

  protected _currentMenuItem = {};

  constructor(private _router:Router) { }

  /**
   * Updates the routes in the menu
   *
   * @param {Routes} routes Type compatible with app.menu.ts
   */
  public updateMenu(nodes: TreeNodes) {
    let convertedNodes = this.convertNodesToMenus(_.cloneDeep(nodes));
    this.menuItems.next(convertedNodes);
  }

  public convertNodesToMenus(nodes:TreeNodes):any[] {
    let items = this._convertArrayToItems(nodes);
    return this._skipEmpty(items);
  }

  public getCurrentItem():any {
    return this._currentMenuItem;
  }

  public selectMenuItem(menuItems:any[]):any[] {
    let items = [];
    menuItems.forEach((item) => {
      this._selectItem(item);

      if (item.selected) {
        this._currentMenuItem = item;
      }

      if (item.children && item.children.length > 0) {
        item.children = this.selectMenuItem(item.children);
      }
      items.push(item);
    });
    return items;
  }

  protected _skipEmpty(items:any[]):any[] {
    let menu = [];
    items.forEach((item) => {
      let menuItem;
      if (item.skip) {
        if (item.children && item.children.length > 0) {
          menuItem = item.children;
        }
      } else {
        menuItem = item;
      }

      if (menuItem) {
        menu.push(menuItem);
      }
    });

    return [].concat.apply([], menu);
  }

  protected _convertArrayToItems(nodes:any[], parent?:any):any[] {
    let items = [];
    nodes.forEach((node) => {
      items.push(this._convertObjectToItem(node, parent));
    });
    return items;
  }

  protected _convertObjectToItem(object, parent?:any):any {
    let item:any = {};
    if(object.attributes){
      item=object.attributes; 
      item.route = {path:object.attributes.route};
    }else{
      item.route={};    
    }
    if(!object.text){
      item.skip = true;
    }
    item.title=object.text;
    item.id=object.id;
 

    // we have to collect all paths to correctly build the url then
    // if (Array.isArray(item.route.path)) {
      item.route.paths = item.route.path;
    // } else {
      // item.route.paths = parent && parent.route && parent.route.paths ? parent.route.paths.slice(0) : ['/'];
      // if (!!item.route.path) item.route.paths.push(item.route.path);
    // }

    if (object.children && object.children.length > 0) {
      item.children = this._convertArrayToItems(object.children, item);
    }

    let prepared = this._prepareItem(item);

    // if current item is selected or expanded - then parent is expanded too
    if ((prepared.selected || prepared.expanded) && parent) {
      parent.expanded = true;
    }
    return prepared;
  }

  protected _prepareItem(object:any):any {
    if (!object.skip) {
      object.target = object.target || '';
      object.pathMatch = object.pathMatch  || 'full';
      return this._selectItem(object);
    }

    return object;
  }

  protected _selectItem(object:any):any {
    object.selected = this._router.isActive(this._router.createUrlTree(object.route.paths), object.pathMatch === 'full');
    return object;
  }
}

