import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';
import { Table, Card, Tag, Button, Form, InputNumber, Modal, message } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import IntroduceRow from './IntroduceRow';
import { contactCustomer, joinActivity } from '@/services/statistic';

@connect(({ loading, statistic }) => ({
  loading: loading.effects['statistic/getStatistic'],
  customers: statistic.customers,
  statistic: statistic.statistic,
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
    };
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

  render() {
    const {
      loading,
      customers,
      statistic,
      form: { getFieldDecorator },
    } = this.props;
    const { visible } = this.state;
    return (
      <PageHeaderWrapper title="营销活动" content={<div>营销活动数据管理</div>} loading={loading}>
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
                  <Button
                    type="primary"
                    onClick={() => {
                      this.openModal(item);
                    }}
                    disabled={item.joined}
                  >
                    参加
                  </Button>
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
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Statistic;
