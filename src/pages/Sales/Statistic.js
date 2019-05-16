import React, { Component, Fragment, createRef } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';
import { baseurl } from '@/config';
import {
  Table,
  Card,
  Tag,
  Button,
  Form,
  InputNumber,
  Modal,
  message,
  Dropdown,
  Icon,
  Menu,
  Input,
  Divider,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import IntroduceRow from './IntroduceRow';
import ReactQuill from 'react-quill';
import { contactCustomer, joinActivity, exportData } from '@/services/statistic';
import 'react-quill/dist/quill.snow.css';

@connect(({ loading, statistic }) => ({
  loading: loading.effects['statistic/getStatistic'],
  customers: statistic.customers,
  statistic: statistic.statistic,
  customersWithRecords: statistic.customersWithRecords,
}))
@Form.create()
class Statistic extends Component {
  constructor(props) {
    super(props);
    const {
      params: { activityId },
    } = props.match;
    this.activityId = activityId;
    this.state = {
      visible: false,
      person: null,
      saleKey: '',
      current: null,
      saleFormVisible: false,
      recordsVisible: false,
      mailContent: '',
      subject: '',
      to: '',
      records: [],
      exportUrl: '',
      exportVisible: false,
    };
    this.quillRef = createRef();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'statistic/getStatistic',
      payload: {
        activityId: this.activityId,
      },
    });
  }

  openModal = person => {
    this.setState({
      visible: true,
      person,
    });
  };

  closeModal = () => {
    this.setState({
      visible: false,
      person: null,
    });
  };

  handleJoin = async () => {
    const { form, dispatch } = this.props;
    const { person } = this.state;
    form.validateFields(async (error, values) => {
      const response = await joinActivity({
        activityId: this.activityId,
        customerId: person.customerId,
        money: values.money,
      });
      if (response) {
        message.success('加入成功');
        this.closeModal();
        dispatch({
          type: 'statistic/getStatistic',
          payload: {
            activityId: this.activityId,
          },
        });
      }
    });
  };

  handleContact = async person => {
    const { dispatch } = this.props;
    const response = await contactCustomer({
      activityId: this.activityId,
      customerId: person.customerId,
    });
    if (response) {
      message.success('+1s');
      dispatch({
        type: 'statistic/getStatistic',
        payload: {
          activityId: this.activityId,
        },
      });
    }
  };

  handleSale = (key, current) => {
    this.setState(
      {
        current,
        saleKey: key,
      },
      () => {
        this.setState({
          saleFormVisible: true,
          to: current.customer.email,
        });
      }
    );
  };

  renderForm = () => {
    const { saleKey, current, mailContent, subject, to, recordsVisible } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    if (saleKey === 'message') {
      return (
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
          <Form.Item label="手机号">
            {getFieldDecorator('phone_number', {
              initialValue: current && current.customer.phone_number,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="短信内容">
            {getFieldDecorator('content')(<Input.TextArea autosize placeholder="输入短信内容" />)}
          </Form.Item>
        </Form>
      );
    }
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
        <Form.Item label="邮箱">
          <Input
            value={to}
            onChange={e => {
              this.handleInputChange(e, 'to');
            }}
          />
        </Form.Item>
        <Form.Item label="邮件标题">
          <Input
            placeholder="输入邮件标题"
            value={subject}
            onChange={e => {
              this.handleInputChange(e, 'subject');
            }}
          />
        </Form.Item>
        <Form.Item label="邮件内容" wrapperCol={{ span: 24 }}>
          <ReactQuill ref={this.quillRef} value={mailContent} onChange={this.handleMailChange} />
        </Form.Item>
      </Form>
    );
  };

  handleInputChange(e, name) {
    this.setState({
      [name]: e.target.value,
    });
  }

  renderJoinForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="转入资金">
          {getFieldDecorator('money', {
            rules: [
              {
                required: true,
                message: '必须填写转入资金',
              },
            ],
          })(<InputNumber min={0} />)}
        </Form.Item>
      </Form>
    );
  };

  handleMailChange = content => {
    this.setState({
      mailContent: content,
    });
  };

  handleSubmitSaleForm = async () => {
    const { saleKey, mailContent, to, subject, current } = this.state;
    const { dispatch } = this.props;
    const { activityId } = this;
    const { customerId } = current;

    if (saleKey === 'email') {
      const res = await dispatch({
        type: 'statistic/createMailRecord',
        payload: {
          activityId,
          customerId,
          html: mailContent,
          to,
          subject,
        },
      });
      if (res) {
        message.success('发送邮件成功');
        dispatch({
          type: 'statistic/getStatistic',
          payload: {
            activityId: this.activityId,
          },
        });
      } else {
        message.error('发送失败');
      }
      this.handleCloseSaleForm();
    }
  };

  handleCloseSaleForm = () => {
    this.setState({
      saleFormVisible: false,
    });
  };

  showRecords = item => {
    const { customersWithRecords } = this.props;
    const cur = customersWithRecords.find(cus => cus.customerId === item.customerId);
    if (cur) {
      const { records } = cur;
      this.setState({
        records,
      });
    }
    this.setState({
      recordsVisible: true,
    });
  };

  closeRecordsModal = () => {
    this.setState({
      recordsVisible: false,
    });
  };

  handleExport = async () => {
    const response = await exportData(this.activityId);
    if (response && response.success) {
      const { result: exportUrl } = response;
      this.setState({ exportUrl: `${baseurl}/${exportUrl}`, exportVisible: true });
    }
  };

  closeExportModal = () => {
    this.setState({
      exportVisible: false,
      exportUrl: '',
    });
  };

  render() {
    const { loading, customers, statistic } = this.props;
    const {
      visible,
      saleFormVisible,
      recordsVisible,
      records,
      exportUrl,
      exportVisible,
    } = this.state;

    const content = (
      <div>
        <p>营销活动数据管理</p>
        <div style={{ display: 'flex' }}>
          <Link to={`/sales/${this.activityId}`} style={{ marginRight: 10 }}>
            <Button>活动详情</Button>
          </Link>
          <Button type="primary" onClick={this.handleExport} icon="export">
            导出数据
          </Button>
        </div>
      </div>
    );

    const MoreButton = ({ current }) => (
      <Dropdown
        overlay={
          <Menu
            onClick={({ key }) => {
              this.handleSale(key, current);
            }}
          >
            <Menu.Item key="message">发送短信</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="email">发送邮件</Menu.Item>
          </Menu>
        }
        trigger={['click']}
      >
        <a>
          营销推荐 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderWrapper title="营销活动" content={content} loading={loading}>
        <IntroduceRow
          loading={loading}
          visitData={statistic}
          total={customers && customers.length}
        />
        <Card title="客户名单">
          <Table
            dataSource={customers}
            rowKey="customerId"
            loading={loading}
            columns={[
              {
                title: 'id',
                dataIndex: 'customerId',
              },
              {
                title: '名字',
                dataIndex: 'customer.name',
                render: (name, item) => (
                  <Link
                    to={`/customers/${item.customerId}?type=${
                      item.customer.sex ? 'person' : 'department'
                    }`}
                  >
                    {name}
                  </Link>
                ),
              },
              {
                title: '联系次数',
                dataIndex: 'contacted_count',
                render: (count, person) => (
                  <div>
                    <span>{count}次</span>{' '}
                    <Button
                      icon="plus"
                      shape="circle"
                      style={{ marginLeft: 6 }}
                      onClick={() => {
                        this.handleContact(person);
                      }}
                    />
                  </div>
                ),
              },
              {
                title: '投入资金',
                dataIndex: 'invest_money',
                render: money => <Yuan>{money}</Yuan>,
              },
              {
                title: '是否参加',
                dataIndex: 'joined',
                render: joined => (
                  <Tag color={joined ? 'green' : 'red'}>{joined ? '是' : '否'}</Tag>
                ),
              },
              {
                title: '操作',
                render: item => (
                  <Fragment>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.openModal(item);
                      }}
                      disabled={item.joined}
                      style={{ marginRight: 10 }}
                    >
                      参加
                    </Button>
                    <Divider type="vertical" />
                    <MoreButton current={item} />
                    <Divider type="vertical" />
                    <a
                      onClick={() => {
                        this.showRecords(item);
                      }}
                    >
                      查看营销记录
                    </a>
                  </Fragment>
                ),
              },
            ]}
          />
        </Card>
        <Modal
          title="设置转入资金"
          visible={visible}
          onOk={this.handleJoin}
          onCancel={this.closeModal}
        >
          {this.renderJoinForm()}
        </Modal>
        <Modal
          title="营销推荐"
          visible={saleFormVisible}
          onOk={this.handleSubmitSaleForm}
          onCancel={this.handleCloseSaleForm}
          width="600px"
        >
          {this.renderForm()}
        </Modal>
        <Modal
          title="营销记录"
          visible={recordsVisible}
          onCancel={this.closeRecordsModal}
          footer={null}
        >
          <Table
            dataSource={records}
            rowKey="id"
            columns={[
              {
                title: 'id',
                dataIndex: 'id',
              },
              {
                title: '营销方式',
                dataIndex: 'type',
              },
              {
                title: '状态',
                dataIndex: 'success',
                render: success => (
                  <Tag color={success ? 'green' : ''}>{success ? '成功' : '待定'}</Tag>
                ),
              },
            ]}
          />
        </Modal>
        <Modal
          visible={exportVisible}
          onCancel={this.closeExportModal}
          onOk={this.closeExportModal}
        >
          {exportUrl && <a href={exportUrl}>点击下载</a>}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Statistic;
