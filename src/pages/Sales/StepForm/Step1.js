import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Alert, message } from 'antd';
import router from 'umi/router';
import styles from './style.less';
import InputBetween from './InputBetween';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({ loading, sales }) => ({
  loading: loading.effects['sales/createModelAndGroup'],
  groups: sales.groups,
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {
    selectedModel: '',
  };

  componentDidMount() {
    this.fetchGroups();
  }

  handleSubmit = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;

    validateFields(async (err, values) => {
      if (!err) {
        const data = {
          ...values,
          income_min: (values.income && values.income.min) || 0,
          income_max: (values.income && values.income.max) || 0,
          debt_min: (values.debt && values.debt.min) || 0,
          debt_max: (values.debt && values.debt.max) || 0,
          deposit_min: (values.deposit && values.deposit.min) || 0,
          deposit_max: (values.deposit && values.deposit.max) || 0,
          loan_min: (values.loan && values.loan.min) || 0,
          loan_max: (values.loan && values.loan.max) || 0,
          points_min: (values.points && values.points.min) || 0,
          points_max: (values.points && values.points.max) || 0,
          is_department: values.is_department === 'true',
        };
        const response = await dispatch({
          type: 'sales/createModelAndGroup',
          payload: { ...data },
        });
        if (response) {
          message.success('创建客户群成功');
          router.push('/sales/step-form/group');
        }
      }
    });
  };

  handleNext = e => {
    e.preventDefault();
    const { selectedModel } = this.state;
    const { groups, dispatch } = this.props;
    if (!selectedModel) {
      this.handleSubmit();
    } else {
      const group = groups.find(g => g.id === selectedModel);
      dispatch({
        type: 'sales/setGroup',
        payload: group || {},
      });
      router.push('/sales/step-form/group');
    }
  };

  fetchGroups = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'sales/getGroups',
    });
  };

  handleSelectModel = value => {
    this.setState({
      selectedModel: value,
    });
  };

  render() {
    const { form, loading, groups } = this.props;
    const { selectedModel } = this.state;
    const { getFieldDecorator } = form;
    console.log(groups);
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Alert
            closable
            showIcon
            message="进入下一步后，新建模版将不可修改！"
            style={{ marginBottom: 24 }}
          />
          <Form.Item label="模版" {...formItemLayout}>
            <Select value={selectedModel} placeholder="选择模版" onSelect={this.handleSelectModel}>
              {groups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {!selectedModel && (
            <Fragment>
              <Form.Item {...formItemLayout} label="模版名称/客户群名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '输入模版名称' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('description', {})(
                  <Input style={{ width: 'calc(100% - 100px)' }} placeholder="输入备注..." />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="收入区间">
                {getFieldDecorator('income', {})(<InputBetween />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="积分区间">
                {getFieldDecorator('points', {})(<InputBetween />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="欠款区间">
                {getFieldDecorator('debt', {})(<InputBetween />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="存款区间">
                {getFieldDecorator('deposit', {})(<InputBetween />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="贷款区间">
                {getFieldDecorator('loan', {})(<InputBetween />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="风险级别">
                {getFieldDecorator('danger_level', {})(
                  <Select>
                    <Option value="安全可靠">安全可靠</Option>
                    <Option value="中规中矩">中规中矩</Option>
                    <Option value="有风险">有风险</Option>
                    <Option value="风险很大">风险很大</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="信用级别">
                {getFieldDecorator('creadit_level', {})(
                  <Select>
                    <Option value="高">高</Option>
                    <Option value="中">中</Option>
                    <Option value="低">低</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="偿债能力">
                {getFieldDecorator('back_ability', {})(
                  <Select>
                    <Option value="强">强</Option>
                    <Option value="中">中</Option>
                    <Option value="弱">弱</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="是否机构客户">
                {getFieldDecorator('is_department', {
                  initialValue: 'false',
                })(
                  <Select>
                    {/* eslint-disable-next-line react/jsx-boolean-value */}
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                )}
              </Form.Item>
            </Fragment>
          )}
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={this.handleNext} loading={loading}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>模版名称</h4>
          <p>之后可以直接搜索模版来选择客户群，同样的，模版的名字也将作为客户群的名称。</p>
          <h4>数据区间</h4>
          <p>根据数据的区间来匹配客户，如果最大值为0，将不能获取到数据！</p>
          <h4>风险级别</h4>
          <p>客户的风险级别,信用级别,偿债能力</p>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
