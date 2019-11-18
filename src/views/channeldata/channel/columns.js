export function formatter(row, column) {
  return (row[column.property] / 1).toFixed(2);
}
function formatter2(row, column) {
  return row[column.property] / 1 + '%';
}
export const columns = [
  {
    prop: 'date',
    label: '日期',
    fixed: true
  },
  {
    prop: 'product_name',
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
    label: '代理商',
    fixed: true
  },
  {
    prop: 'account',
    label: '账号',
    fixed: true
  },
  /* {
    prop: 'channel_name',
    label: '广告组'
  }, */
  {
    prop: 'qid',
    label: '渠道号',
    'class-name': 'link-row',
    fixed: true
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
    prop: 'click_rate',
    label: '点击率',
    formatter: formatter2
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
  }
];
export const zhangyuColumns = [
  ...columns,
  {
    prop: 'all_dau',
    label: 'DAU'
  },
  {
    prop: 'old_dau',
    label: 'DAU(去新增)'
  },
  {
    prop: 'dayinstall',
    label: '当日安装'
  },
  {
    prop: 'newinstall',
    label: '全库去重安装'
  },
  {
    prop: 'apprentice_install_new',
    label: '新安装且有拜师行为的用户数'
  },
  {
    prop: 'day1_remain',
    label: '1日键盘启动留存数'
  },
  {
    prop: 'day1_remain_rate',
    label: '1日键盘启动留存率'
  },
  {
    prop: 'day1_remain_per_cost',
    label: '1日键盘启动留存成本'
  },
  {
    prop: 'day2_remain',
    label: '2日键盘启动留存数'
  },
  {
    prop: 'day2_remain_rate',
    label: '2日键盘启动留存率'
  },
  {
    prop: 'day2_remain_per_cost',
    label: '2日键盘启动留存成本'
  },
  {
    prop: 'day3_remain',
    label: '3日键盘启动留存数'
  },
  {
    prop: 'day3_remain_rate',
    label: '3日键盘启动留存率'
  },
  {
    prop: 'day3_remain_per_cost',
    label: '3日键盘启动留存成本'
  },
  {
    prop: 'day7_remain',
    label: '7日键盘启动留存数'
  },
  {
    prop: 'day7_remain_rate',
    label: '7日键盘启动留存率'
  },
  {
    prop: 'day7_remain_per_cost',
    label: '7日键盘启动留存成本'
  },
  {
    prop: 'typeuser',
    label: '打字用户数'
  },
  {
    prop: 'avg_typenum',
    label: '人均打字数'
  },
  {
    prop: 'avg_board_startnum',
    label: '人均键盘启动次数'
  },
  {
    prop: 'avg_emojipv',
    label: '人均表情包使用次数'
  },
  {
    prop: 'all_score',
    label: '总得分'
  },
  {
    prop: 'put_score',
    label: '投放得分'
  },
  {
    prop: 'active_score',
    label: '行为得分'
  },
  {
    prop: 'health_score',
    label: '健康得分'
  },
  {
    prop: 'commerce_score',
    label: '商业得分'
  }
];
export const zhangyuColumnszk = [
  ...columns,
  {
    prop: 'all_dau',
    label: 'DAU'
  },
  {
    prop: 'old_dau',
    label: 'DAU(去新增)'
  },
  {
    prop: 'dayinstall',
    label: '当日安装'
  },
  {
    prop: 'newinstall',
    label: '全库去重安装'
  },
  {
    prop: 'apprentice_install_new',
    label: '新安装且有拜师行为的用户数'
  },
  {
    prop: 'day1_remain',
    label: '1日键盘启动留存数'
  },
  {
    prop: 'day1_remain_rate',
    label: '1日键盘启动留存率'
  },
  {
    prop: 'day1_remain_per_cost',
    label: '1日键盘启动留存成本'
  },
  {
    prop: 'day2_remain',
    label: '2日键盘启动留存数'
  },
  {
    prop: 'day2_remain_rate',
    label: '2日键盘启动留存率'
  },
  {
    prop: 'day2_remain_per_cost',
    label: '2日键盘启动留存成本'
  },
  {
    prop: 'day3_remain',
    label: '3日键盘启动留存数'
  },
  {
    prop: 'day3_remain_rate',
    label: '3日键盘启动留存率'
  },
  {
    prop: 'day3_remain_per_cost',
    label: '3日键盘启动留存成本'
  },
  {
    prop: 'day7_remain',
    label: '7日键盘启动留存数'
  },
  {
    prop: 'day7_remain_rate',
    label: '7日键盘启动留存率'
  },
  {
    prop: 'day7_remain_per_cost',
    label: '7日键盘启动留存成本'
  },
  {
    prop: 'typeuser',
    label: '打字用户数'
  },
  {
    prop: 'avg_typenum',
    label: '人均打字数'
  },
  {
    prop: 'avg_board_startnum',
    label: '人均键盘启动次数'
  },
  {
    prop: 'avg_emojipv',
    label: '人均表情包使用次数'
  },
  {
    prop: 'all_score',
    label: '总得分'
  },
  {
    prop: 'put_score',
    label: '投放得分'
  },
  {
    prop: 'put_install_per_cost',
    label: '人均激活成本'
  },
  {
    prop: 'put_day1_keyboard_per_cost',
    label: '首日键盘激活成本'
  },
  {
    prop: 'put_day2_keyboard_per_cost',
    label: '次日键盘激活成本'
  },
  {
    prop: 'active_score',
    label: '行为得分'
  },
  {
    prop: 'active_day15_keyboard',
    label: '章鱼输入法-15留'
  },
  {
    prop: 'active_counts_uv',
    label: '打字用户占比'
  },
  {
    prop: 'active_emoji_uv',
    label: '表情包用户占比'
  },
  {
    prop: 'active_skin_uv',
    label: '启用皮肤占比'
  },
  {
    prop: 'active_makemoney_uv',
    label: '赚钱用户占比'
  },
  {
    prop: 'health_score',
    label: '健康得分'
  },
  {
    prop: 'health_cheat_uv',
    label: '作弊用户占比'
  },
  {
    prop: 'commerce_score',
    label: '商业得分'
  }
];
export const bddColumns = [
  ...columns,
  {
    prop: 'all_dau',
    label: 'DAU'
  },
  {
    prop: 'old_dau',
    label: 'DAU（去新增）'
  },
  {
    prop: 'dayinstall',
    label: '当日安装'
  },
  {
    prop: 'newinstall',
    label: '全库去重安装'
  },
  {
    prop: 'day1_remain',
    label: '1日留存数'
  },
  {
    prop: 'day1_remain_rate',
    label: '1日留存率'
  },
  {
    prop: 'day1_remain_per_cost',
    label: '1日留存数成本'
  },
  {
    prop: 'day2_remain',
    label: '2日留存数'
  },
  {
    prop: 'day2_remain_rate',
    label: '2日留存率'
  },
  {
    prop: 'day2_remain_per_cost',
    label: '2日留存数成本'
  },
  {
    prop: 'day3_remain',
    label: '3日留存数'
  },
  {
    prop: 'day3_remain_rate',
    label: '3日留存率'
  },
  {
    prop: 'day3_remain_per_cost',
    label: '3日留存数成本'
  },
  {
    prop: 'day7_remain',
    label: '7日留存数'
  },
  {
    prop: 'day7_remain_rate',
    label: '7日留存率'
  },
  {
    prop: 'day7_remain_per_cost',
    label: '7日留存数成本'
  },
  {
    prop: 'all_score',
    label: '总得分'
  },
  {
    prop: 'put_score',
    label: '投放得分'
  },
  {
    prop: 'active_score',
    label: '行为得分'
  },
  {
    prop: 'health_score',
    label: '健康得分'
  },
  {
    prop: 'commerce_score',
    label: '商业得分'
  }
];
export const bddColumnszk = [
  ...columns,
  {
    prop: 'all_dau',
    label: 'DAU'
  },
  {
    prop: 'old_dau',
    label: 'DAU（去新增）'
  },
  {
    prop: 'dayinstall',
    label: '当日安装'
  },
  {
    prop: 'newinstall',
    label: '全库去重安装'
  },
  {
    prop: 'day1_remain',
    label: '1日留存数'
  },
  {
    prop: 'day1_remain_rate',
    label: '1日留存率'
  },
  {
    prop: 'day1_remain_per_cost',
    label: '1日留存数成本'
  },
  {
    prop: 'day2_remain',
    label: '2日留存数'
  },
  {
    prop: 'day2_remain_rate',
    label: '2日留存率'
  },
  {
    prop: 'day2_remain_per_cost',
    label: '2日留存数成本'
  },
  {
    prop: 'day3_remain',
    label: '3日留存数'
  },
  {
    prop: 'day3_remain_rate',
    label: '3日留存率'
  },
  {
    prop: 'day3_remain_per_cost',
    label: '3日留存数成本'
  },
  {
    prop: 'day7_remain',
    label: '7日留存数'
  },
  {
    prop: 'day7_remain_rate',
    label: '7日留存率'
  },
  {
    prop: 'day7_remain_per_cost',
    label: '7日留存数成本'
  },
  {
    prop: 'all_score',
    label: '总得分'
  },
  {
    prop: 'put_score',
    label: '投放得分'
  },
  {
    prop: 'put_install_per_cost',
    label: '人均激活成本'
  },
  {
    prop: 'active_score',
    label: '行为得分'
  },
  {
    prop: 'active_day15_open',
    label: '步多多-15留'
  },
  {
    prop: 'active_walkstep_uv',
    label: '走路用户占比'
  },
  {
    prop: 'active_walkstep_per',
    label: '人均步数'
  },
  {
    prop: 'active_walkbonus_uv',
    label: '走路金币用户占比'
  },
  {
    prop: 'active_walkbonus_per',
    label: '走路金币人均领取次数'
  },
  {
    prop: 'active_shortvideo_uv',
    label: '小视频观看用户占比'
  },
  {
    prop: 'active_shortvideo_per',
    label: '小视频观看用户深度'
  },
  {
    prop: 'health_score',
    label: '健康得分'
  },
  {
    prop: 'health_cheat_uv',
    label: '作弊用户占比'
  },
  {
    prop: 'commerce_score',
    label: '商业得分'
  }
];
zhangyuColumns.forEach(item => {
  changeWidth(item);
});
bddColumns.forEach(item => {
  changeWidth(item);
});
zhangyuColumnszk.forEach(item => {
  changeWidth(item);
});
bddColumnszk.forEach(item => {
  changeWidth(item);
});
function changeWidth(item) {
  if (
    item.prop === 'cost' ||
    item.prop === 'download_start' ||
    item.prop === 'download_finish' ||
    item.prop === 'per_cost' ||
    item.prop === 'put_install_per_cost' ||
    item.prop === 'active_counts_uv' ||
    item.prop === 'active_emoji_uv' ||
    item.prop === 'active_skin_uv' ||
    item.prop === 'active_makemoney_uv' ||
    item.prop === 'health_cheat_uv' ||
    item.prop === 'active_day15_open' ||
    item.prop === 'active_walkstep_uv'||
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
