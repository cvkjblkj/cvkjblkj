import { Input, Output, EventEmitter, OnChanges, Attribute } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit, OnChanges {
  private addDeviceData: any = {}; // 新增的设备数据
  private deleteDevice: boolean = true;  // 删除这一项设备
  private addBtn: boolean = true;  // 添加按钮 默认显示
  @Input() deviceNameList: any; // 设备名称
  @Input() index: any; // 当前设备所在索引
  @Output() delItem = new EventEmitter(); // 删除某一项
  @Output() addItem = new EventEmitter(); // 新增某一项

  @Output() selectData: any = new EventEmitter(); // 选择数据
  // 假数据
  public attributesList: any = [];

  constructor() {

  }

  // SimpleChanges
  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log(this.index);
    // 假数据
    this.deviceNameList = [
      {
        label: "春天",
        value: {
          name: 'spring',
          attributes: [
            { label: '小草', value: { name: 'grass', unit: '颗' } },
            { label: '树木', value: { name: 'tree', unit: '颗' } },
          ]
        }
      },
      {
        label: "夏天",
        value: {
          name: 'summer',
          attributes: [
            { label: '荷花', value: { name: 'lotus', unit: '朵' } },
            { label: '太阳', value: { name: 'sun', unit: '个' } },
            { label: '雨水', value: { name: 'rain', unit: '量' } },
          ]
        }
      },
      {
        label: "秋天",
        value: {
          name: 'autumn',
          attributes: [
            { label: '枫叶', value: { name: 'leaf', unit: '片' } },
            { label: '小麦', value: { name: 'wheat', unit: '粒' } },
            { label: '玉米', value: { name: 'corn', unit: '颗' } },
          ]
        }
      },
    ];
  }

  ngOnInit() {

  }

  /**
   * 选择设备名称
   * 
   * @param {any} e 
   * @memberof AddDeviceComponent
   */
  onChangeDevice(e) {

    this.attributesList = e.value.attributes;
  }

  /**
   * 选择属性
   * 
   * @param {any} e 
   * @memberof AddDeviceComponent
   */
  onChangeAttribute(e) {
    this.addDeviceData.unit = e.value.unit;
    let params = {
      deviceName: this.addDeviceData.deviceName.name,
      attribute: this.addDeviceData.attribute.name,
      unit: this.addDeviceData.unit,
    }
    this.selectData.emit(params);
  }

  /**
   * 新增一项设备
   * 
   * @memberof AddDeviceComponent
   */
  addItemDevive(e) {
    let params = {
      index: this.index,
      event: e,
    }
    this.addItem.emit(e);
    this.addBtn = false;
  }

  /**
   * 删除一项设备
   * 
   * @memberof AddDeviceComponent
   */
  delItemDevice(e) {
    let params = {
      index: this.index,
      event: e,
    };
    this.delItem.emit(e);
    this.deleteDevice = false;
  }
}
