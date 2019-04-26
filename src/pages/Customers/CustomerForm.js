import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Card, Button, message, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import numeral from 'numeral';
import styles from './CustomerForm.less';

const { Item: FormItem } = Form;
const { Group: InputGroup } = Input;
const { Option } = Select;
const { Description } = DescriptionList;
@connect(({ loading, customers }) => ({
  currentCustomer: customers.currentCustomer,
  loadingCustomer: loading.models.customers,
}))
@Form.create()
class CustomerForm extends PureComponent {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { customerId },
      },
      location: {
        query: { type },
      },
    } = props;
    this.customerId = customerId;
    this.type = type;
    this.state = {
      help: '',
      validateStatus: 'success',
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(async (error, values) => {
      if (
        !form.getFieldValue('certificate_number') ||
        !form.getFieldValue('certificate_number').trim()
      ) {
        this.setState({
          help: '证件号不能为空',
          validateStatus: 'error',
        });
        return;
      }
      this.setState({
        help: '',
        validateStatus: 'success',
      });

      if (!error) {
        const data = {
          ...values,
          birthday: moment(values.birthday)
            .utc()
            .format(),
        };
        if (this.customerId) {
          // 更新
          const response = await dispatch({
            type: 'customers/updateCustomer',
            payload: { ...data, customerId: this.customerId },
          });
          if (response) {
            message.success('更新完成');
            router.goBack();
          }
        } else {
          // 创建
          const response = await dispatch({
            type: 'customers/createCustomer',
            payload: data,
          });
          if (response) {
            message.success('创建完成');
            router.goBack();
          }
        }
      }
    });
  };

  handleSubmitDepartment = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        const data = {
          ...values,
          birthday: moment(values.birthday)
            .utc()
            .format(),
        };
        if (this.customerId) {
          // 更新
          const response = await dispatch({
            type: 'customers/updateDepartmentCustomer',
            payload: { ...data, departmentCustomerId: this.customerId },
          });
          if (response) {
            message.success('更新完成');
            router.goBack();
          }
        } else {
          // 创建
          const response = await dispatch({
            type: 'customers/createDepartmentCustomer',
            payload: data,
          });
          if (response) {
            message.success('创建完成');
            router.goBack();
          }
        }
      }
    });
  };

  handleCancel = () => {
    router.goBack();
  };

  checkBirthday = (rule, value, callback) => {
    if (!value) {
      callback(Error('出生日期不能为空'));
    } else {
      callback();
    }
  };

  renderCustomerForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { help, validateStatus } = this.state;
    return (
      <Form
        onSubmit={this.handleSubmit}
        labelCol={{ xs: 24, sm: 6 }}
        wrapperCol={{ xs: 24, sm: 10 }}
      >
        <FormItem label="姓名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '必须填写客户姓名',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="性别">
          {getFieldDecorator('sex', {
            rules: [
              {
                required: true,
                message: '必须选择性别',
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Select placeholder="选择性别">
              <Option value="male">男</Option>
              <Option value="female">女</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="出生日期">
          {getFieldDecorator('birthday', {
            initialValue: moment(),
            rules: [
              {
                required:true,
                validator: this.checkBirthday,
              },
            ],
          })(<DatePicker />)}
        </FormItem>
        <FormItem label="联系手机">
          {getFieldDecorator('phone_number', {
            rules: [
              {
                required: 'true',
                message: '必须填写联系方式',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="邮箱">{getFieldDecorator('email')(<Input />)}</FormItem>
        <FormItem label="证件" required help={help} validateStatus={validateStatus}>
          <InputGroup compact>
            {getFieldDecorator('certificate_type', {
              initialValue: '身份证',
            })(
              <Select placeholder="选择证件">
                <Option value="身份证">身份证</Option>
                <Option value="护照">护照</Option>
              </Select>
            )}
            {getFieldDecorator('certificate_number')(<Input style={{ width: '50%' }} />)}
          </InputGroup>
        </FormItem>
        <FormItem label="职业">{getFieldDecorator('work')(<Input />)}</FormItem>
        <FormItem label="职务">{getFieldDecorator('job')(<Input />)}</FormItem>
        <FormItem label="职称">{getFieldDecorator('title')(<Input />)}</FormItem>
        <FormItem label="学历">
          {getFieldDecorator('education_degree', {
            rules: [
              {
                required: true,
                message: '必须选择学历',
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Select placeholder="选择学历">
              <Option value="其他">其他</Option>
              <Option value="大专">大专</Option>
              <Option value="本科">本科</Option>
              <Option value="硕士">硕士</Option>
              <Option value="博士">博士</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="婚姻状态">
          {getFieldDecorator('marry_status')(
            <Select placeholder="选择状态">
              <Option value="已婚">已婚</Option>
              <Option value="未婚">未婚</Option>
              <Option value="离异">离异</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="户籍">
          {getFieldDecorator('household', {
            rules: [
              {
                required: true,
                message: '必须填写客户姓名',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="工作年限">
          {getFieldDecorator('work_time', {})(<InputNumber />)} 年
        </FormItem>
        <FormItem label="家庭住址">
          {getFieldDecorator('address', {
            rules: [
              {
                required: 'true',
                message: '必须填写地址',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 6 } }}>
          <div className={styles.formActions}>
            <Button type="primary" htmlType="submit">
              {this.customerId ? '更新' : '保存'}
            </Button>
            <Button onClick={this.handleCancel}>取消</Button>
          </div>
        </FormItem>
      </Form>
    );
  };

  renderDepartmentCustomerForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form
        onSubmit={this.handleSubmitDepartment}
        labelCol={{ xs: 24, sm: 6 }}
        wrapperCol={{ xs: 24, sm: 10 }}
      >
        <FormItem label="机构名字">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请填写机构名字',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="机构类型">
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择机构类型',
              },
            ],
            initialValue: '私营企业',
          })(
            <Select>
              <Option value="私营企业">私营企业</Option>
              <Option value="国营企业">国营企业</Option>
              <Option value="外资企业">外资企业</Option>
              <Option value="合资企业">合资企业</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="联系人">
          {getFieldDecorator('contact_person', {
            rules: [
              {
                required: true,
                message: '请填写联系人',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="联系电话">
          {getFieldDecorator('phone_number', {
            rules: [
              {
                required: true,
                message: '请填写联系电话',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="法人">
          {getFieldDecorator('owner', {
            rules: [
              {
                required: true,
                message: '请填写法人姓名',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="备注">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: '请填写备注',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 6 } }}>
          <div className={styles.formActions}>
            <Button type="primary" htmlType="submit">
              {this.customerId ? '更新' : '保存'}
            </Button>
            <Button onClick={this.handleCancel}>取消</Button>
          </div>
        </FormItem>
      </Form>
    );
  };

  async fetchData() {
    const { dispatch } = this.props;
    if (this.customerId) {
      if (this.type === 'person') {
        // 加载自然人信息
        await dispatch({
          type: 'customers/getCustomer',
          payload: {
            customerId: this.customerId,
          },
        });
      } else {
        await dispatch({
          type: 'customers/getDepartmentCustomer',
          payload: {
            departmentCustomerId: this.customerId,
          },
        });
      }
      const { currentCustomer, form } = this.props;
      const obj = {};
      Object.keys(form.getFieldsValue()).forEach(key => {
        obj[key] = currentCustomer[key] || null;
        if (key === 'birthday') {
          obj[key] = moment(currentCustomer[key]);
        }
      });
      form.setFieldsValue(obj);
    }
  }

  render() {
    const { loadingCustomer, currentCustomer } = this.props;
    const { account } = currentCustomer;
    const content = <div>{this.customerId ? '查看和更新客户信息' : '新建一个客户'}</div>;
    return (
      <PageHeaderWrapper title="客户表单" content={content} loading={loadingCustomer}>
        {this.customerId && account ? (
          <Card style={{ marginBottom: 32 }}>
            <DescriptionList size="large" title="账户信息">
              <Description term="账户id">{account.id}</Description>
              <Description term="开户时间">
                {moment(account.register_time).format('LL')}
              </Description>
              {this.type === 'person' && (
                <Description term="客户类型">
                  <Tag color="#108ee9">{account.type}</Tag>
                </Description>
              )}
              {this.type === 'department' && (
                <Description term="注册资金">￥{numeral(account.register_money).format('0,0')}</Description>
              )}
              <Description term="欠款">￥{numeral(account.debt).format('0,0')}</Description>
              <Description term="存款">￥{numeral(account.deposit).format('0,0')}</Description>
              <Description term="贷款">￥{numeral(account.loan).format('0,0')}</Description>
              <Description term="账户余额">￥{numeral(account.remain).format('0,0')}</Description>
              <Description term="年收入">￥{numeral(account.income).format('0,0')}</Description>
              <Description term="信用级别">
                <Tag color="#87d068">{account.creadit_level || '无'}</Tag>
              </Description>
              <Description term="风险级别">
                <Tag color="#f50">{account.danger_level}</Tag>
              </Description>
              <Description term="偿贷能力">
                <Tag color="#108ee9">{account.back_ability}</Tag>
              </Description>
            </DescriptionList>
          </Card>
        ) : null}
        <Card bordered={false}>
          {this.type === 'person' ? this.renderCustomerForm() : this.renderDepartmentCustomerForm()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerForm;
