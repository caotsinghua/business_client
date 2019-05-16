import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Form, Input, Button, Tag, Upload, Modal, Table, message, notification } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { saveCustomers, saveDepartmentCustomers } from '@/services/customers';

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
          <Link to={`/customers/${item.id}?type=person`}>查看</Link>
          {/* <Divider type="vertical" />
          <a>删除</a> */}
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
          <Link to={`/customers/${item.id}?type=department`}>查看</Link>
          {/* <Divider type="vertical" />
          <a>删除</a> */}
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props);
     const {
      location: {
        query: { tabKey = 'person' },
      },
    } = props;
    this.state = {
      selectedRows: [],
      tabKey,
      fileList: [],
      uploadList: [],
      filename: '',
      uploadTableVisible: false,
      fileKey: '',
      loadingSaving: false,
    };
  }

  componentDidMount() {
    const {
      location: {
        query: { page = 1, pageSize = 10, tabKey = 'person' },
      },
    } = this.props;
    this.page = page;
    this.pageSize = pageSize;
    this.fetchData(page, pageSize, tabKey);
  }

  handleTabChange = async key => {
    const { pageSize } = this.props;
    router.replace(`/customers/list?tabKey=${key}&page=1&pageSize=${pageSize}`);
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

  handleFileChange = info => {
    let fileList = [];
    let uploadSuccess = false;
    const list = info.fileList.slice(-1);
    fileList = list.map(file => {
      const temp = file;
      if (file.response && file.response.success) {
        // Component will show file.url as link
        temp.url = file.response.url;
        const {
          result: { data, filename, key: fileKey },
        } = file.response;
        this.setState({
          uploadList: data,
          filename,
          fileKey,
        });
        uploadSuccess = true;
      } else if (file.response && !file.response.success) {
        uploadSuccess = false;
        const { error_code: status, error_message: errortext } = file.response;
        notification.error({
          message: `请求错误 ${status}`,
          description: errortext,
        });
      }
      return temp;
    });

    if (uploadSuccess) {
      this.setState({ fileList, uploadTableVisible: true });
    } else {
      this.setState({ fileList, uploadTableVisible: false });
    }
  };

  closeUploadModal = () => {
    this.setState({
      uploadTableVisible: false,
    });
  };

  handleSubmitUpload = async () => {
    const { fileKey, tabKey } = this.state;
    this.setState({
      loadingSaving: true,
    });
    const response =
      tabKey === 'person' ? await saveCustomers(fileKey) : await saveDepartmentCustomers(fileKey);

    if (response && response.success) {
      message.success('导入成功');
      const {
        location: {
          query: { page = 1, pageSize = 10 },
        },
      } = this.props;
      this.fetchData(page, pageSize, tabKey);
    }
    this.setState({
      loadingSaving: false,
      fileList: [],
    });
    this.closeUploadModal();
  };

  handlePageChange = async (page, pageSize) => {
    const { tabKey } = this.state;
    router.replace(`/customers/list?tabKey=${tabKey}&page=${page}&pageSize=${pageSize}`);
    this.fetchData(page, pageSize, tabKey);
  };

  fetchData = async (page, pageSize, type) => {
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
  };

  render() {
    const { data, loading, page, pageSize, total } = this.props;
    const {
      selectedRows,
      tabKey,
      fileList,
      uploadList,
      filename,
      uploadTableVisible,
      loadingSaving,
    } = this.state;
    const dataSource = {
      list: data,
      pagination: {
        total,
        pageSize,
        current: page,
        showSizeChanger: false,
        onChange: this.handlePageChange,
      },
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
              <Upload
                name="customersFile"
                action="http://localhost:4000/upload/uploadCustomers"
                onChange={this.handleFileChange}
                fileList={fileList}
                withCredentials
              >
                <Button icon="upload">导入客户源</Button>
              </Upload>
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
        <Modal
          visible={uploadTableVisible}
          onCancel={this.closeUploadModal}
          onOk={this.handleSubmitUpload}
          title={filename}
          width="800px"
          confirmLoading={loadingSaving}
        >
          <Table
            rowKey="name"
            dataSource={uploadList}
            pagination={{ pageSize: 6 }}
            columns={
              tabKey === 'person'
                ? [
                    {
                      title: '姓名',
                      dataIndex: 'name',
                    },
                    {
                      title: '性别',
                      dataIndex: 'sex',
                      render: sex => {
                        return { male: '男', female: '女' }[sex];
                      },
                    },
                    {
                      title: '出生日期',
                      dataIndex: 'birthday',
                    },
                    {
                      title: '住址',
                      dataIndex: 'address',
                    },
                    {
                      title: '职业',
                      dataIndex: 'job',
                    },
                    {
                      title: '工作年限',
                      dataIndex: 'work_time',
                    },
                  ]
                : [
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
                      title: '描述',
                      dataIndex: 'description',
                    },
                    {
                      title: '法人',
                      dataIndex: 'owner',
                    },
                  ]
            }
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Customers;
