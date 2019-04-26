import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Tag, Input, DatePicker, Table, InputNumber } from 'antd';
import { setTarget } from '@/services/statistic';
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
  currentActivity: sales.currentActivity,
  submitting: loading.effects['statistic/setTarget'],
}))
@Form.create()
class Step3 extends PureComponent {
  componentDidMount() {}

  prevStep = () => {
    router.push(`/sales/step-form/group`);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, currentActivity } = this.props;
    form.validateFields(async (error, values) => {
      if (!error) {
        const response = await setTarget({
          ...values,
          activityId: currentActivity.id,
        });
        if (response) {
          router.push('/sales/step-form/verify');
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <Fragment>
        <Form
          layout="horizontal"
          className={styles.stepForm}
          {...formItemLayout}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="目标客户数">
            {getFieldDecorator('target_customers_count', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请输入目标客户数',
                },
              ],
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="目标转入资金">
            {getFieldDecorator('target_money', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请输入目标转入资金',
                },
              ],
            })(<InputNumber min={0} />)}
          </Form.Item>
        </Form>
        <div className={styles.step2Actions}>
          <Button onClick={this.prevStep} style={{ marginRight: 10 }}>
            上一步
          </Button>
          {
            <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
              下一步
            </Button>
          }
        </div>
      </Fragment>
    );
  }
}

export default Step3;
