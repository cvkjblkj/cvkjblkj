import { ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { CommonRequestService } from './../../../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../../../core/common-service/request-method.service';
import { CommonService } from './../../../../../core/common-service/common.service';
import { Input, OnChanges, Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'add-echarts',
  templateUrl: './add-echarts.component.html',
  styleUrls: ['./add-echarts.component.scss'],
  // providers: [CommonService, CommonRequestMethodService, CommonRequestService, ConfirmationService]
})
export class AddEchartsComponent implements OnInit, OnChanges, AfterViewInit {
  private yAxisColors = ['#5793f3', '#d14a61', '#675bba', '#0F0'];
  private dataList: any; // 图表数据列表
  private options: any = {}; // echarts 图表 
  private attributeValue: any; // 最新的属性值
  private sampling: boolean = false;  // 采样频率是否显示
  private samplingFrequency: any; // 页面上修改的采样频率的值
  @Input() addEchartsParams: any; // 查询图表数据的参数 options
  @Input() frequency: any; // 采样频率 


  @ViewChild('currentDate') currentDate: any; // 当前时间
  private showLoading: boolean = true;  // 与echarts组件通讯 显示loading

  constructor(
    private commonService: CommonService
  ) {
    // echarts配置项
    this.options = {
      color: this.yAxisColors,
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '20%'
      },
      legend: {
        data: [],
      },
      yAxis: [],
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: [],
      }

    }
  }

  ngOnChanges() {

  }

  ngOnInit() {
    
    this.xAxisData();
    this.setYAxisQuantily();
  }
  ngAfterViewInit() {
    //页面显示数据
    this.getCurrentDate();

  }

  //////////////   采样频率的修改  ///////////   
  /**
   * 修改采样频率
   * 
   * @memberof AddEchartsComponent
   */
  update() {
    this.sampling = true;
    this.samplingFrequency = this.frequency;
  }
  /**
   * 保存采样频率，并发请求重新获取改变后的数据
   * 
   * @memberof AddEchartsComponent
   */
  saveSampling() {
    this.frequency = this.samplingFrequency;
    this.sampling = false;

  }
  /**
   * 取消 修改的采样频率
   * 
   * @returns 
   * @memberof AddEchartsComponent
   */
  cancle() {
    this.sampling = false;
  }


  /**
   * 判断折线的数量
   * 
   * @returns 返回不同单位的数组
   * @memberof AddEchartsComponent
   */
  judgLineQuantily() {
    let lineArr;

    if (this.addEchartsParams.length == 1) {  // 只有一条折线的数据
      lineArr = this.addEchartsParams;
    } else {
      for (let i = 0; i < this.addEchartsParams.length; i++) {
        lineArr = this.commonService.arrUnique(this.addEchartsParams, 'unit');
      }
    }
    return lineArr;
  }

  /**
   * 根据不同的单位设置不同的Y轴
   * 
   * @memberof AddEchartsComponent
   */
  setYAxisQuantily() {
    let lineArr = this.judgLineQuantily();
    let itemYaxis = {
      type: 'value',
      name: '',
      min: 0,
      max: '',
      position: '',
      offset: 0,
      axisLine: {
        lineStyle: {
          color: ''
        }
      },
      axisLabel: {
        formatter: '',
      }
    };
    if (lineArr.length == 1) {
      // 只有一条Y轴  （属性单位都相同）legend以设备名字为准
      // Y轴的名字
      itemYaxis.name = lineArr[0].attribute;
      // Y轴的颜色
      itemYaxis.axisLine.lineStyle.color = this.yAxisColors[0];
      // y轴单位
      itemYaxis.axisLabel.formatter = '{value} ' + lineArr[0].unit;
      this.options.yAxis.push(itemYaxis);
      // title
      this.options.title.text = lineArr[0].monitorName ? lineArr[0].monitorName : '';
      for (let i = 0; i < this.addEchartsParams.length; i++) {
        // legend 
        this.options.legend.data.push(this.addEchartsParams.deviceName)
      }
    } else {
      // 不止一条Y轴,legend以属性名字为准
      for (let i = 0; i < lineArr.length; i++) {
        // 属性名字
        itemYaxis.name = lineArr[i].attribute;
        itemYaxis.axisLine.lineStyle.color = this.yAxisColors[i];
        itemYaxis.axisLabel.formatter = '{value} ' + lineArr[i].unit;
        // legend
        this.options.legend.data.push(lineArr[i].attribute);
        // title
        this.options.title.text = lineArr.monitorName ? lineArr.monitorName : '';
        if (i <= Math.floor(lineArr.length / 2)) {
          itemYaxis.position = 'left';
          itemYaxis.offset = 0 + 50 * i;
        } else {
          itemYaxis.position = 'right';
          itemYaxis.offset = 0 + 50 * (i - Math.ceil(lineArr.length / 2));
        }
        this.options.grid.left = 10 + Math.floor(lineArr.length / 2) * 5 + '%';

        this.options.yAxis.push(itemYaxis);
      }
    }

  }


  /**
   * 获取图表的初始化数据
   * 
   * @memberof AddEchartsComponent
   */
  getInitEchartsData() {
    this.dataList = [];
    this.attributeValue = Math.random() * 100;

  }


  // 接收的数据为那种类型的数据，即固定的数值的数据，
  /**
   * 动态请求获取数据
   * 
   * @memberof AddEchartsComponent
   */
  private requestfrequency() {
    setInterval(() => {
      this.getInitEchartsData();
      this.options.xAxis.data.shift();
      this.options.xAxis.data.push(Math.random() * 100);
    }, this.frequency * 1000)
  }

  /**
   * 页面上显示的计时器
   * 
   * @memberof AddEchartsComponent
   */
  private getCurrentDate() {
    var timer = null;
    timer = setInterval(() => {
      let dt = new Date();
      let date = this.commonService.formatDate(dt).formatTime;
      this.currentDate.nativeElement.innerHTML = '当前时间为：' + date;
    }, 1000); //开始执行
  }
  /**
   * x轴上 前两个小时显示的节点
   * 
   * @memberof AddEchartsComponent
   */
  xAxisData() {
    let dt = new Date().getTime();
    let startDate = dt - 3600 * 2 * 1000;
    let dateNode = startDate;
    let xAxis = [this.commonService.formatDate(startDate).formatTime];
    while (dateNode < dt) {
      dateNode = dateNode + Number(this.frequency) * 1000;
      let currentSecond = this.commonService.formatDate(dateNode).formatTime;
      xAxis.push(currentSecond);
    }
    xAxis.splice(xAxis.length - 1, 1, this.commonService.formatDate(dt).formatTime);
    // 前两个小时的X轴坐标节点
    this.options.xAxis.data = xAxis;

    this.requestfrequency();
  }

}
