export function formatter(row, column) {
  return (row[column.property] / 1).toFixed(2);
}
/* function formatter2(row, column) {
  return row[column.property] / 1 + '%';
} */
function formatterDate(row, column) {
  return row[column.property].split(' ')[0];
}
function formatteros(row, column) {
  if (row[column.property] == 0) {
    return '全部';
  } else if (row[column.property] == 1) {
    return 'IOS';
  } else if (row[column.property] == 2) {
    return 'Android';
  }
}
export const columns = [
  {
    prop: 'date',
    label: '日期',
    fixed: true,
    formatter: formatterDate
  },
  {
    prop: 'product_name',
    label: '软件名称'
  },
  {
    prop: 'channel_name',
    label: '投放媒体'
  },
  {
    prop: 'agent_name',
    label: '代理商'
  },
  // {
  //   prop: 'qid',
  //   label: '渠道号' /* ,
  //   'class-name': 'link-row' */
  // },
  {
    prop: 'os_id',
    label: '系统',
    formatter: formatteros
  },
  {
    prop: 'cost',
    label: '消费金额(返点前)'
  },
  {
    prop: 'r_cost',
    label: '消费金额(返点后)'
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
    label: '下载量'
  },
  {
    prop: 'download_finish',
    label: '安装量'
  },
  {
    prop: 'active',
    label: '激活数量'
  },
  {
    prop: 'per_cost',
    label: '人均成本',
    formatter
  }
];
columns.forEach(item => {
  changeWidth(item);
});
function changeWidth(item) {
  if (
    item.prop === 'cost' ||
    item.prop === 'download_start' ||
    item.prop === 'download_finish' ||
    item.prop === 'per_cost' ||
    item.prop === 'r_cost' ||
    item.prop === 'put_install_per_cost' ||
    item.prop === 'active_counts_uv' ||
    item.prop === 'active_emoji_uv' ||
    item.prop === 'active_skin_uv' ||
    item.prop === 'active_makemoney_uv' ||
    item.prop === 'health_cheat_uv' ||
    item.prop === 'active_day15_open' ||
    item.prop === 'active_walkstep_uv' ||
    item.prop === 'active_walkbonus_uv'
  ) {
    item.width = '130';
  } else if (
    item.prop === 'old_dau' ||
    item.prop === 'day1_remain_per_cost' ||
    item.prop === 'day2_remain_per_cost' ||
    item.prop === 'day3_remain_per_cost' ||
    item.prop === 'day7_remain_per_cost' ||
    item.prop === 'day1_remain' ||
    item.prop === 'day2_remain' ||
    item.prop === 'day3_remain' ||
    item.prop === 'day7_remain' ||
    item.prop === 'day1_remain_rate' ||
    item.prop === 'day2_remain_rate' ||
    item.prop === 'day3_remain_rate' ||
    item.prop === 'day7_remain_rate' ||
    item.prop === 'avg_board_startnum' ||
    item.prop === 'avg_emojipv' ||
    item.prop === 'put_day1_keyboard_per_cost' ||
    item.prop === 'put_day2_keyboard_per_cost' ||
    item.prop === 'active_day15_keyboard' ||
    item.prop === 'put_day2_keyboard_per_cost' ||
    item.prop === 'active_walkbonus_per' ||
    item.prop === 'active_shortvideo_uv' ||
    item.prop === 'active_shortvideo_per'
  ) {
    item.width = '150';
  } else if (item.prop === 'agent_name') {
    item.width = '170';
  } else if (item.prop === 'apprentice_install_new') {
    item.width = '180';
  } else {
    item.width = '100';
  }
}
