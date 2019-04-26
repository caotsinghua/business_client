import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import { connect } from 'dva';
import { Form, Input, DatePicker, Button, message, Tag, Tooltip, Modal } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import styles from './Sales.less';

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const formatStatus = status => {
  const map = {
    created: {
      text: '未开始',
      color: 'blue',
    },
    online: {
      text: '已上线',
      color: 'green',
    },
    offline: {
      text: '已下线',
      color: 'red',
    },
  };
  return map[status];
};

@connect(({ loading, sales }) => ({
  currentActivity: sales.currentActivity,
  loading: loading.effects['sales/getActivity'],
  loadingChangeStatus: loading.effects['sales/changeStatus'],
}))
@Form.create()
class SaleForm extends Component {
  constructor(props) {
    super(props);
    const {
      params: { saleActivityId },
    } = props.match;
    this.saleActivityId = saleActivityId;
  }

  async componentDidMount() {
    await this.fetchData();
    this.setFormFields();
  }

  fetchData = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'sales/getActivity',
      payload: {
        activityId: this.saleActivityId,
      },
    });
  };

  setFormFields = () => {
    const { currentActivity, form } = this.props;
    const obj = {};
    Object.keys(form.getFieldsValue()).forEach(key => {
      obj[key] = currentActivity[key];
      if (key.indexOf('time') !== -1) {
        obj[key] = moment(obj[key]);
      }
    });
    form.setFieldsValue(obj);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(async (error, values) => {
      if (!error) {
        const response = await dispatch({
          type: 'sales/updateActivity',
          payload: { ...values, activityId: this.saleActivityId },
        });
        if (response) {
          message.success('更新完成');
          router.goBack();
        }
      }
    });
  };

  checkEndTime = (rule, value, callback) => {
    const { form } = this.props;
    const prevTime = form.getFieldValue('start_time');
    if (!value) {
      callback(Error('结束时间不能为空'));
    } else if (!value.isAfter(prevTime, 'day')) {
      callback(Error('结束时间不能早于开始时间'));
    } else {
      callback();
    }
  };

  handleUpdateStatus = async () => {
    const { currentActivity, dispatch } = this.props;
    if (currentActivity.status === 'online') {
      Modal.confirm({
        title: '确定下线此活动吗？',
        content: '下线后此活动将不可用',
        okText: '下线',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const response = await dispatch({
            type: 'sales/changeStatus',
            payload: {
              status: 'offline',
              activityId: this.saleActivityId,
            },
          });
          if (response) {
            message.success('已下线该活动');
          }
        },
      });
    } else {
      const response = await dispatch({
        type: 'sales/changeStatus',
        payload: {
          status: 'online',
          activityId: this.saleActivityId,
        },
      });
      if (response) {
        message.success('上线成功');
      }
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentActivity,
      loading,
      loadingChangeStatus,
    } = this.props;
    const { group } = currentActivity;
    return (
      <PageHeaderWrapper title="营销活动" content={<div>营销活动详情</div>} loading={loading}>
        <Form {...formItemLayout} className={styles.saleForm} onSubmit={this.handleSubmit}>
          <Form.Item label="活动名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '必须输入活动名称',
                },
              ],
            })(<Input placeholder="输入活动名称..." />)}
          </Form.Item>
          <Form.Item label="目标客户群">
            <Input value={group && group.name} disabled />
          </Form.Item>
          <Form.Item label="开始时间">
            {getFieldDecorator('start_time', {
              rules: [
                {
                  required: true,
                  message: '开始时间不能为空',
                },
              ],
              initialValue: moment(),
            })(<DatePicker />)}
          </Form.Item>
          <Form.Item label="结束时间">
            {getFieldDecorator('end_time', {
              rules: [
                {
                  required: true,
                  validator: this.checkEndTime,
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
          <Form.Item label="活动内容">
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: '必须输入活动内容',
                },
              ],
            })(<Input.TextArea placeholder="输入活动名称..." />)}
          </Form.Item>
          <Form.Item label="活动目标">
            {getFieldDecorator('target', {
              rules: [
                {
                  required: true,
                  message: '必须输入活动目标',
                },
              ],
            })(<Input.TextArea placeholder="输入活动名称..." />)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('other_data')(<Input placeholder="输入活动名称..." />)}
          </Form.Item>
          <Form.Item label="所属银行">
            <Input value={currentActivity.bank && currentActivity.bank.name} disabled />
          </Form.Item>
          <Form.Item label="创建者">
            <Input value={currentActivity.creater && currentActivity.creater.name} disabled />
          </Form.Item>
          <Form.Item label="活动状态">
            <Tooltip title="下方工具栏修改状态">
              <Tag
                color={currentActivity.status && formatStatus(currentActivity.status).color}
                onClick={this.handleUpdateStatus}
              >
                {currentActivity.status && formatStatus(currentActivity.status).text}
              </Tag>
            </Tooltip>
          </Form.Item>
          <Form.Item label="客户经理">
            <Input
              value={(currentActivity.manager && currentActivity.manager.name) || '无'}
              disabled
            />
          </Form.Item>
        </Form>
        <FooterToolbar extra="表单操作">
          <Button type="primary" icon="edit" onClick={this.handleSubmit}>
            更新
          </Button>
          <Button
            type={currentActivity.status === 'online' ? 'danger' : 'primary'}
            onClick={this.handleUpdateStatus}
            loading={loadingChangeStatus}
            disabled={!(currentActivity.verify_data&&currentActivity.verify_data.verify_status==='pass')}
          >
            {currentActivity.status === 'online' ? '下线' : '上线'}
          </Button>
          <Button
            onClick={() => {
              router.goBack();
            }}
          >
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default SaleForm;
