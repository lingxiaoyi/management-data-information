// 代理商
const agentColumns = [
  {
    type: 'index',
    label: '序号'
  },
  {
    label: '代理商名称',
    prop: 'agent_name'
  },
  {
    label: '账号数',
    prop: 'account_amount'
  },
  {
    label: '操作',
    key: 'handles'
  }
];

// 日志
const logColumns = [
  {
    label: '时间',
    prop: 'date_time'
  },
  {
    label: '操作',
    prop: 'operation'
  },
  {
    label: '操作人',
    prop: 'user_name'
  }
];

const accountColumns = [
  {
    label: '序号',
    prop: '1'
  },
  {
    label: '账号',
    prop: '2'
  },
  {
    label: '账号ID',
    prop: '3'
  },
  {
    label: '操作',
    prop: '4'
  }
];

export { agentColumns, accountColumns, logColumns };
