export function formatter(row, column) {
  return (row[column.property] / 1).toFixed(2);
}

export const baseLongColumns = [
  {
    prop: 'date',
    label: '日期',
    fixed: true
  },
  {
    prop: 'product',
    label: '软件名称',
    fixed: true
  },
  {
    prop: 'channel_name',
    label: '投放媒体',
    fixed: true
  },
  {
    prop: 'agent_name',
    agent_id: 'agent_id',
    name: '',
    label: '代理商'
  },
  {
    prop: 'account',
    label: '账户'
  },
  {
    prop: 'active',
    label: '激活数量'
  },
  {
    prop: 'yday_active_pr',
    label: '比昨日'
  },
  {
    prop: 'per_cost',
    label: '首日人均成本',
    formatter
  },
  {
    prop: 'cost',
    label: '消费金额（返点前）',
    formatter
  },
  {
    prop: 'yday_cost_pr',
    label: '比昨日'
  },
  {
    prop: 'r_cost',
    label: '消费金额（返点后）',
    formatter
  },
  {
    prop: 'show',
    label: '展现数量'
  },
  {
    prop: 'yday_show_pr',
    label: '比昨日'
  },
  {
    prop: 'click',
    label: '点击数量'
  },
  {
    prop: 'yday_click_pr',
    label: '比昨日'
  },
  {
    prop: 'download_start',
    label: '开始下载数量'
  },
  {
    prop: 'yday_dstart_pr',
    label: '比昨日'
  },
  {
    prop: 'download_finish',
    label: '下载完成数量'
  },
  {
    prop: 'yday_dfinish_pr',
    label: '比昨日'
  }
];

export const baseShortColumns = [
  {
    prop: 'date',
    label: '日期',
    fixed: true
  },
  {
    prop: 'product',
    label: '软件名称',
    fixed: true
  },
  {
    prop: 'channel_name',
    label: '投放媒体',
    fixed: true
  },
  {
    prop: 'agent_name',
    agent_id: 'agent_id',
    name: '',
    label: '代理商'
  },
  {
    prop: 'account',
    label: '账户'
  },
  {
    prop: 'active',
    label: '激活数量'
  },
  {
    prop: 'per_cost',
    label: '首日人均成本',
    formatter
  },
  {
    prop: 'account',
    label: '账户'
  },
  {
    prop: 'cost',
    label: '消费金额（返点前）',
    formatter
  },
  {
    prop: 'r_cost',
    label: '消费金额（返点后）',
    formatter
  },
  {
    prop: 'show',
    label: '展现数量'
  },
  {
    prop: 'click',
    label: '点击数量'
  },
  {
    prop: 'download_start',
    label: '开始下载数量'
  },
  {
    prop: 'download_finish',
    label: '下载完成数量'
  }
];
