import * as dateUtil from '@/utils/date-util';
import { setNumberColor } from '@/utils/util';

export const formatter = setNumberColor;

export const toFixed = num => {
  return Number(num).toFixed(2);
};

export const pickerOptions = {
  shortcuts: [
    {
      text: '今天',
      onClick(picker) {
        let start = dateUtil.prevDate(new Date(), 0);
        start = new Date(start).getTime();
        let end = new Date().getTime();
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '昨天',
      onClick(picker) {
        let start = dateUtil.prevDate(new Date(), 1);
        start = new Date(start).getTime();
        let end = dateUtil.prevDate(new Date(), 0);
        end = new Date(end).getTime() - 1000;
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '过去7天',
      onClick(picker) {
        let start = dateUtil.prevDate(new Date(), 7);
        start = new Date(start).getTime();
        let end = dateUtil.prevDate(new Date(), 0);
        end = new Date(end).getTime() - 1000;
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '过去30天',
      onClick(picker) {
        let start = dateUtil.prevDate(new Date(), 30);
        start = new Date(start).getTime();
        let end = dateUtil.prevDate(new Date(), 0);
        end = new Date(end).getTime() - 1000;
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '本周',
      onClick(picker) {
        const day = new Date();
        const num = day.getDay() - 1;
        day.setDate(day.getDate() - num); // 本周第一天
        const start = dateUtil.clearTime(day).getTime();
        const end = new Date().getTime();
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '本月',
      onClick(picker) {
        let start = new Date();
        start = dateUtil.modifyDate(start, start.getFullYear(), start.getMonth(), 1);
        start = dateUtil.clearTime(start).getTime();
        const end = new Date().getTime();
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '上月',
      onClick(picker) {
        let start = new Date();
        let end = new Date();
        start = dateUtil.prevMonth(start);
        start = dateUtil.getFirstDateOfMonth(start);
        start = dateUtil.clearTime(start).getTime();

        end = dateUtil.getFirstDateOfMonth(end);
        end = dateUtil.clearTime(end).getTime() - 1;
        picker.$emit('pick', [start, end]);
      }
    }
  ]
};

export const columns = [
  {
    label: '日期',
    prop: 'date'
  },
  {
    label: '消费金额',
    prop: 'cost',
    formatter: toFixed
  },
  {
    label: '激活数量',
    prop: 'active'
  },
  {
    label: '激活成本',
    prop: 'p_cost'
  },
  {
    label: '展现数量',
    prop: 'show'
  },
  {
    label: 'CPM',
    prop: 'cpm'
  },
  {
    label: 'CTR',
    prop: 'ctr'
  },
  {
    label: 'CVR',
    prop: 'cvr'
  }
];

export const panelConfig = [
  [
    {
      title: '消费',
      value: 'cost',
      tips: '截至今日上个整点时刻的消费<br/>（每30分钟更新一次）',
      children: [
        {
          name: '日环比',
          prop: 'cost_day_circle',
          formatter
        },
        {
          name: '周环比',
          prop: 'cost_week_yoy',
          formatter
        },
        {
          name: '昨日总计',
          prop: 'cost_yestday'
        },
        {
          name: '前日总计',
          prop: 'cost_before_yestday'
        }
      ]
    },
    {
      title: '实时激活成本',
      value: 'p_cost',
      tips: '截至今日上个整点时刻的内部激活成本，<br/>计算公式：实时激活成本=消费/实时激活<br/>（每30分钟更新一次）',
      children: [
        {
          name: '日环比',
          prop: 'p_cost_day_circle',
          formatter
        },
        {
          name: '周环比',
          prop: 'p_cost_week_yoy',
          formatter
        },
        {
          name: '昨日总计',
          prop: 'p_cost_yestday'
        },
        {
          name: '前日总计',
          prop: 'p_cost_before_yestday'
        }
      ]
    },
    {
      title: '实时激活',
      value: 'active',
      tips: '截至到最近更新时刻的累计实时内部激活数<br/>（每30分钟更新一次）',
      children: [
        {
          name: '日环比',
          prop: 'active_day_circle',
          formatter
        },
        {
          name: '周环比',
          prop: 'active_week_yoy',
          formatter
        },
        {
          name: '昨日总计',
          prop: 'active_yestday'
        },
        {
          name: '前日总计',
          prop: 'active_before_yestday'
        }
      ]
    }
  ],
  [
    {
      title: 'CPM',
      value: 'cpm',
      tips: '截至今天上个整点时刻的千次曝光成本，<br/>计算公式：CPM=消费/UV*1000<br/>（每30分钟更新一次）',
      children: [
        {
          name: '日环比',
          prop: 'cpm_day_circle',
          formatter
        },
        {
          name: '周环比',
          prop: 'cpm_week_yoy',
          formatter
        },
        {
          name: '昨日总计',
          prop: 'cpm_yestday'
        },
        {
          name: '前日总计',
          prop: 'cpm_before_yestday'
        }
      ]
    },
    {
      title: 'CTR',
      value: 'ctr',
      tips: '截至今天上个整点时刻的曝光转化率，<br/>计算公式：CTR=点击/曝光<br/>（每30分钟更新一次）',
      children: [
        {
          name: '日环比',
          prop: 'ctr_day_circle',
          formatter
        },
        {
          name: '周环比',
          prop: 'ctr_week_yoy',
          formatter
        },
        {
          name: '昨日总计',
          prop: 'ctr_yestday'
        },
        {
          name: '前日总计',
          prop: 'ctr_before_yestday'
        }
      ]
    },
    {
      title: 'CVR',
      value: 'cvr',
      tips: '截至今天上个整点时刻的点击转化率，<br/>计算公式：CVR=激活/点击<br/>（每30分钟更新一次）',
      children: [
        {
          name: '日环比',
          prop: 'cvr_day_circle',
          formatter
        },
        {
          name: '周环比',
          prop: 'cvr_week_yoy',
          formatter
        },
        {
          name: '昨日总计',
          prop: 'cvr_yestday'
        },
        {
          name: '前日总计',
          prop: 'cvr_before_yestday'
        }
      ]
    }
  ]
];

export const typeList = [
  {
    name: '消费金额',
    prop: 'cost'
  },
  {
    name: '激活数量',
    prop: 'active'
  },
  {
    name: '激活成本',
    prop: 'p_cost'
  },
  {
    name: '展现数量',
    prop: 'show'
  },
  {
    name: 'CPM',
    prop: 'cpm'
  },
  {
    name: 'CTR',
    prop: 'ctr'
  },
  {
    name: 'CVR',
    prop: 'cvr'
  }
];
