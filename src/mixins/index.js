import { dateIsWeekend } from '@/utils/index';

// 全局 mixins
export default {
  methods: {
    // 表格数据 转百分比
    formatRate(r, c, v) {
      return v || v === 0 ? `${Number(v * 100).toFixed(2)}%` : '';
    },
    // 表格数据 +百分号
    addPercent(r, c, v) {
      return v || v === 0 ? `${Number(v).toFixed(2)}%` : '';
    },
    // 表格周末数据标红
    weekendRowClass({ row }) {
      return row.dt && dateIsWeekend(row.dt) ? 'weekend-row' : '';
    }
  }
};
