import { subtractDate } from '@/utils/index';
// 全局 mixins
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick: picker => {
              let rangeDate = [subtractDate(0), subtractDate(0)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '昨天',
            onClick: picker => {
              let rangeDate = [subtractDate(1), subtractDate(1)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '过去7天',
            onClick: picker => {
              let rangeDate = [subtractDate(7), subtractDate(1)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '过去30天',
            onClick: picker => {
              let rangeDate = [subtractDate(30), subtractDate(1)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '本周',
            onClick: picker => {
              let rangeDate = [
                this.dayjs()
                  .startOf('week')
                  .add(1, 'd')
                  .format('YYYY-MM-DD'),
                subtractDate(0)
              ];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '上周',
            onClick: picker => {
              let dayjs = this.dayjs;
              let t = dayjs().subtract(1, 'w');
              let val1 = t
                .set('date', t.$D - t.$W)
                .add(1, 'd')
                .format('YYYY-MM-DD'); //上周第一天（周一）
              let val2 = t
                .set('date', t.$D + (6 - t.$W))
                .add(1, 'd')
                .format('YYYY-MM-DD'); //上周最后一天（周日）
              let rangeDate = [val1, val2];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '本月',
            onClick: picker => {
              let rangeDate = [
                this.dayjs()
                  .startOf('month')
                  .format('YYYY-MM-DD'),
                subtractDate(0)
              ];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '上月',
            onClick: picker => {
              let dayjs = this.dayjs;
              let val1 = dayjs()
                .subtract(1, 'months')
                .startOf('month')
                .format('YYYY-MM-DD'); //上周第一天（周一）
              let val2 = this.dayjs()
                .subtract(1, 'months')
                .endOf('month')
                .format('YYYY-MM-DD'); //上周最后一天（周日）
              let rangeDate = [val1, val2];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          }
        ]
      }
    };
  }
};
