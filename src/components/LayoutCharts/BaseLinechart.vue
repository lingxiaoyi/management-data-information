<template>
  <ve-histogram
    ref="chart"
    :height="height + 'px'"
    :data="chartData"
    :data-empty="isEmpty"
    :legend-visible="false"
    :extend="chartExtend"
  ></ve-histogram>
</template>

<script>
export default {
  props: {
    dataSource: {
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    height: {
      type: Number,
      default: 260
    }
  },
  data() {
    return {
      chartExtend: {
        series: {
          type: 'bar',
          barMaxWidth: '18px',
          itemStyle: {
            color: '#409EFF'
          }
        },
        xAxis: {
          axisLabel: {
            fontSize: 11
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              color: '#ebeef5'
            }
          }
        },
        grid: {
          left: 25,
          right: 15,
          top: 30,
          bottom: 30
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter:
            '<span style="display: inline-block;width: 12px;height: 12px;border-radius: 100%;background-color: #409EFF;"></span>  {b0}: {c0}'
        }
      }
    };
  },
  computed: {
    chartData() {
      return {
        columns: this.columns,
        rows: this.dataSource
      };
    },
    isEmpty() {
      return !(this.chartData.rows && this.chartData.rows.length > 0);
    }
  },
  watch: {
    dataSource(val) {
      if (val && val.length > 0) {
        this.$set(this.chartData, 'columns', this.columns);
        this.$set(this.chartData, 'rows', this.dataSource);
        this.$nextTick(() => {
          this.$refs.chart.resize();
        });
      } else {
        this.$set(this.chartData, 'columns', []);
        this.$set(this.chartData, 'rows', []);
      }
    }
  }
};
</script>
