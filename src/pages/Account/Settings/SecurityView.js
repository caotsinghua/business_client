import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { List, Modal, Form, Progress, Popover, Input, message } from 'antd';
import { connect } from 'dva';
import styles from './SecurityView.less';
// import { getTimeDistance } from '@/utils/utils';
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};

@connect(({ loading }) => ({
  submitting: loading.effects['user/updateUserPassword'],
}))
@Form.create()
class SecurityView extends Component {
  state = {
    updatePasswordModalVisible: false,
    visible: false,
    help: '',
  };

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a onClick={this.openModal}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
  ];

  openModal = () => {
    this.setState({
      updatePasswordModalVisible: true,
    });
  };

  closeModal = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      updatePasswordModalVisible: false,
    });
  };

  checkPassword = (rule, value, callback) => {
    const { visible } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleUpdatePassword = () => {
    const { dispatch, form } = this.props;
    form.validateFields(async (error, values) => {
      if (!error) {
        const success = await dispatch({
          type: 'user/updateUserPassword',
          payload: values,
        });

        if (success) {
          this.closeModal();
          message.success('修改密码完成，请重新登录');
          dispatch({
            type: 'login/logout',
          });
        }
      }
    });
  };

  render() {
    const { updatePasswordModalVisible, visible, help } = this.state;
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <Modal
          title="修改密码"
          visible={updatePasswordModalVisible}
          onCancel={this.closeModal}
          onOk={this.handleUpdatePassword}
          confirmLoading={submitting}
        >
          <Form>
            <Form.Item label="旧密码">
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                  },
                ],
              })(<Input type="password" placeholder="输入旧密码"/>)}
            </Form.Item>
            <Form.Item help={help} label="新密码">
              <Popover
                getPopupContainer={node => node.parentNode}
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      <FormattedMessage id="validation.password.strength.msg" />
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                {getFieldDecorator('newPassword', {
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(<Input type="password" placeholder="输入新密码" />)}
              </Popover>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default SecurityView;
