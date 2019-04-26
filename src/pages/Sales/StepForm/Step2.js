import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Tag, Input, DatePicker, Table } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({ sales, loading }) => ({
  loading: loading.models.sales,
  group: sales.group,
  submitting: loading.effects['sales/createActivity'],
}))
@Form.create()
class Step2 extends PureComponent {
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
  ];

  constructor(props) {
    super(props);
    const { group } = props;
    if (group.department_customers && group.department_customers.length > 0) {
      this.state = {
        type: 'department',
        customers: group.department_customers || [],
      };
    } else {
      this.state = {
        type: 'person',
        customers: group.customers || [],
      };
    }
  }

  prevStep = () => {
    router.push('/sales/step-form/model');
  };

  getSex = sex => {
    const map = {
      male: '男',
      female: '女',
    };
    return map[sex];
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

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, group } = this.props;
    form.validateFields(async (error, values) => {
      if (!error) {
        console.log(values);
        const data = {
          ...values,
          start_time: moment(values.start_time)
            .utc()
            .format(),
          end_time: moment(values.end_time)
            .utc()
            .format(),
          groupId: group.id,
        };
        await dispatch({
          type: 'sales/createActivity',
          payload: data,
        });
        router.push('/sales/step-form/target');
      }
    });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      group,
      submitting,
    } = this.props;
    const { type, customers } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          dataSource={customers}
          columns={type === 'person' ? this.columns : this.departmentColumns}
          rowKey="id"
        />

        <Form
          layout="horizontal"
          className={styles.stepForm}
          {...formItemLayout}
          onSubmit={this.handleSubmit}
        >
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
            <Input value={group.name} disabled />
          </Form.Item>
          <Form.Item label="开始时间">
            {getFieldDecorator('start_time', {
              rules: [
                {
                  required: true,
                  message: '必须选择活动开始时间',
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
        </Form>
        <div className={styles.step2Actions}>
          <Button onClick={this.prevStep} style={{ marginRight: 10 }}>
            上一步
          </Button>
          {
            <Button
              type="primary"
              onClick={this.handleSubmit}
              loading={submitting}
              disabled={customers.length === 0}
            >
              下一步
            </Button>
          }
        </div>
      </Fragment>
    );
  }
}

export default Step2;
