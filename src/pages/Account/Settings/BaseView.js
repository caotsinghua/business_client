import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Upload, Select, Button, DatePicker, message, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './BaseView.less';
// import GeographicView from './GeographicView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

@connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.effects['user/fetchCurrent'],
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    const obj = {};
    Object.keys(form.getFieldsValue()).forEach(key => {
      obj[key] = currentUser[key] || null;
      if (key === 'birthday') {
        obj[key] = (currentUser[key] && moment(currentUser[key])) || null;
      }
    });
    form.setFieldsValue(obj);
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    const url = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    return currentUser.avatar || url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        await dispatch({
          type: 'user/updateUser',
          payload: {
            ...values,
            birthday: values.birthday && values.birthday.utc().format(),
          },
        });
        message.success('更新成功');
        dispatch({
          type: 'user/fetchCurrent',
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Spin spinning={loading}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
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
                })(
                  <Select style={{ maxWidth: 220 }}>
                    <Option value="male">男</Option>
                    <Option value="female">女</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="出生日期">
                {getFieldDecorator('birthday', {})(<DatePicker />)}
              </FormItem>
              <FormItem label="身份证号">
                {getFieldDecorator('certificate_card', {})(<Input />)}
              </FormItem>
              <FormItem label="学历">
                {getFieldDecorator('education_degree', {})(
                  <Select>
                    <Option value="其他">其他</Option>
                    <Option value="专科">专科</Option>
                    <Option value="本科">本科</Option>
                    <Option value="硕士">硕士</Option>
                    <Option value="博士">博士</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
                {getFieldDecorator('address', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
                {getFieldDecorator('phone_number', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <Button type="primary" htmlType="submit">
                <FormattedMessage
                  id="app.settings.basic.update"
                  defaultMessage="Update Information"
                />
              </Button>
            </Form>
          </Spin>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;
