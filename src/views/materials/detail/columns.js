export function formatter(row, column) {
  return (row[column.property] / 1).toFixed(2);
}
export function formatterUserType(row, column) {
  return row[column.property] === 1 ? '代理商' : '内部人员';
}
export const columns = [
  {
    prop: 'date',
    label: '日期'
  },
  {
    prop: 'product_name',
    label: '软件名称'
  },
  {
    prop: 'poster_url',
    label: '视频首帧截图'
  },
  {
    prop: 'video_id',
    label: '素材ID'
  },
  {
    prop: 'size',
    label: '视频大小'
  },
  {
    prop: 'duration',
    label: '视频时长'
  },
  {
    prop: 'user_type',
    label: '素材来源',
    formatter: formatterUserType
  },
  {
    prop: 'user_name',
    label: '内部人员姓名'
  },
  {
    prop: 'pixel',
    label: '分辨率'
  },
  {
    prop: 'creative_count',
    label: '关联创意',
    'class-name': 'link-row',
    sortable: 'custom'
  },
  {
    prop: 'cost',
    label: '消费金额',
    formatter,
    sortable: 'custom'
  },
  {
    prop: 'show',
    label: '展现数量',
    sortable: 'custom'
  },
  {
    prop: 'click',
    label: '点击数量',
    sortable: 'custom'
  },
  {
    prop: 'click_rate',
    label: '点击率',
    sortable: 'custom'
  },
  {
    prop: 'download_start',
    label: '开始下载数',
    sortable: 'custom'
  },
  {
    prop: 'download_finish',
    label: '下载完成数量',
    sortable: 'custom'
  },
  {
    prop: 'active',
    label: '激活数量',
    sortable: 'custom'
  },
  {
    prop: 'per_cost',
    label: '人均激活成本',
    formatter,
    sortable: 'custom'
  }
];

export const columnsCreative = [
  {
    prop: 'date',
    label: '日期'
  },
  {
    prop: 'creative_id',
    label: '创意ID'
  },
  {
    prop: 'ad_name',
    label: '广告计划名称'
  },
  {
    prop: 'campaign_name',
    label: '广告组名称'
  },
  {
    prop: 'account',
    label: '账号'
  },
  {
    prop: 'agent_name',
    label: '代理商'
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
    label: '开始下载数'
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
    label: '人均激活成本',
    formatter
  }
];

export const columnsImage = [
  {
    prop: 'date',
    label: '日期'
  },
  {
    prop: 'product_name',
    label: '软件名称'
  },
  {
    prop: 'url',
    label: '图片预览地址'
  },
  {
    prop: 'image_id',
    label: '素材ID'
  },
  {
    prop: 'size',
    label: '图片大小'
  },
  {
    prop: 'user_name',
    label: '内部人员姓名'
  },
  {
    prop: 'pixel',
    label: '分辨率'
  },
  {
    prop: 'creative_count',
    label: '关联创意',
    'class-name': 'link-row',
    sortable: 'custom'
  },
  {
    prop: 'cost',
    label: '消费金额',
    formatter,
    sortable: 'custom'
  },
  {
    prop: 'show',
    label: '展现数量',
    sortable: 'custom'
  },
  {
    prop: 'click',
    label: '点击数量',
    sortable: 'custom'
  },
  {
    prop: 'click_rate',
    label: '点击率',
    sortable: 'custom'
  },
  {
    prop: 'download_start',
    label: '开始下载数',
    sortable: 'custom'
  },
  {
    prop: 'download_finish',
    label: '下载完成数量',
    sortable: 'custom'
  },
  {
    prop: 'active',
    label: '激活数量',
    sortable: 'custom'
  },
  {
    prop: 'per_cost',
    label: '人均激活成本',
    formatter,
    sortable: 'custom'
  }
];

export const columnsImageCreative = [
  {
    prop: 'date',
    label: '日期'
  },
  {
    prop: 'url',
    label: '图片预览地址'
  },
  {
    prop: 'creative_id',
    label: '创意ID'
  },
  {
    prop: 'campaign_name',
    label: '广告计划名称'
  },
  {
    prop: 'ad_name',
    label: '广告组名称'
  },
  {
    prop: 'account',
    label: '账号'
  },
  {
    prop: 'agent_name',
    label: '代理商'
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
    label: '开始下载数'
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
    label: '人均激活成本',
    formatter
  }
];
