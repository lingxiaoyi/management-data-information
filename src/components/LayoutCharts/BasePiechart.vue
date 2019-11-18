<template>
  <ve-pie
    ref="chart"
    legend-position="bottom"
    :height="height + 'px'"
    :data="chartData"
    :settings="chartSettings"
    :extend="chartExtend"
    :data-empty="isEmpty"
  ></ve-pie>
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
      chartSettings: {
        radius: 82,
        label: {
          show: true,
          formatter: d => {
            return d.data.name + ' : ' + d.percent.toFixed(2) + '%';
          }
        }
      },
      chartExtend: {
        series: {
          center: ['50%', '40%']
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
