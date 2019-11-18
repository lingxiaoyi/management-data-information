export function formatter(row, column) {
  return (row[column.property] / 1).toFixed(2);
}


export const columns =  [
  {
    prop: 'date',
    label: '日期',
    fixed: true
  },
  {
    prop: 'product_name',
    label: '软件名称'
  },
  {
    prop: 'agent_name',
    label: '代理商'
  },
  {
    prop: 'account',
    label: '账号'
  },
  /* {
    prop: 'channel_name',
    label: '广告组'
  }, */
  {
    prop: 'qid',
    label: '渠道号'/* ,
    'class-name': 'link-row' */
  },
  {
    prop: 'ad_name',
    label: '广告组'
  },
  {
    prop: 'cost',
    label: '消费金额',
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
  },
  {
    prop: 'active',
    label: '激活数量'
  },
  {
    prop: 'per_cost',
    label: '首日人均成本',
    formatter
  } /* ,
  {
    prop: 'active',
    label: '次留'
  },
  {
    prop: 'active',
    label: '3留'
  },
  {
    prop: 'active',
    label: '7留'
  },
  {
    prop: 'active',
    label: '15留'
  }, */
];

