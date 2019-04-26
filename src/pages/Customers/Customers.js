import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Form, Input, Button, Divider, Tag } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Customers.less';

const tabList = [
  {
    key: 'person',
    tab: '自然人客户',
  },
  {
    key: 'department',
    tab: '企业客户',
  },
];
/* eslint react/no-multi-comp:0 */
@connect(({ customers, loading }) => ({
  total: customers.total,
  page: customers.page,
  pageSize: customers.pageSize,
  data: customers.data,
  loading: loading.models.customers,
}))
@Form.create()
class Customers extends PureComponent {
  state = {
    selectedRows: [],
    tabKey: 'person',
  };

  columns = [
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: sex => this.getSex(sex),
    },
    {
      title: '客户经理',
      dataIndex: 'manager',
      render: manager => (manager && manager.name) || <Tag color="red">无客户经理</Tag>,
    },
    {
      title: '操作',
      render: item => (
        <Fragment>
          <Link to={`/customers/${item.id}?type=person`}>编辑</Link>
          <Divider type="vertical" />
          <a>删除</a>
        </Fragment>
      ),
    },
  ];

  departmentColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '机构名字',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      render: type => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '客户经理',
      dataIndex: 'manager',
      render: manager => (manager && manager.name) || <Tag color="red">无客户经理</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '法人',
      dataIndex: 'owner',
    },
    {
      title: '操作',
      render: item => (
        <Fragment>
          <Link to={`/customers/${item.id}?type=department`}>编辑</Link>
          <Divider type="vertical" />
          <a>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      location: {
        query: { page = 1, pageSize = 10 },
      },
    } = this.props;
    const { tabKey } = this.state;
    this.fetchData(page, pageSize, tabKey);
  }

  handleTabChange = async key => {
    const { pageSize } = this.props;
    await this.fetchData(1, pageSize, key);
    this.setState(state => ({
      ...state,
      tabKey: key,
    }));
  };

  handleSearch = value => {
    // eslint-disable-next-line
    console.log(value);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  getSex = sex => {
    const map = {
      male: '男',
      female: '女',
    };
    return map[sex];
  };

  handleCreateCustomer = () => {
    const { tabKey: type } = this.state;
    router.push(`/customers/new?type=${type}`);
  };

  async fetchData(page, pageSize, type) {
    const { dispatch } = this.props;
    if (type === 'person') {
      await dispatch({
        type: 'customers/getCustomers',
        payload: {
          page,
          pageSize,
        },
      });
    } else {
      await dispatch({
        type: 'customers/getDepartmentCustomers',
        payload: {
          page,
          pageSize,
        },
      });
    }
  }

  render() {
    const { data, loading, page, pageSize, total } = this.props;
    const { selectedRows, tabKey } = this.state;
    const dataSource = {
      list: data,
      pagination: { total, pageSize, current: page, showSizeChanger: false },
    };
    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入客户名"
          enterButton="搜索"
          size="large"
          onSearch={this.handleSearch}
          style={{ width: 522 }}
        />
      </div>
    );
    return (
      <PageHeaderWrapper
        title="客户列表"
        content={mainSearch}
        tabList={tabList}
        tabActiveKey={tabKey}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleCreateCustomer}>
                {tabKey === 'person' ? '添加客户' : '添加企业客户'}
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={dataSource}
              columns={tabKey === 'person' ? this.columns : this.departmentColumns}
              onSelectRow={this.handleSelectRows}
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Customers;
