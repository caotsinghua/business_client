import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Mention, Avatar, message } from 'antd';
import router from 'umi/router';
import { searchVerifyer } from '@/services/user';
import styles from './style.less';

const { toContentState } = Mention;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
@connect(({ sales }) => ({
  currentActivity: sales.currentActivity,
  group: sales.group,
}))
@Form.create()
class Step4 extends React.PureComponent {
  state = {
    selectVerifyerId: '',
    suggestions: [],
    searching: false,
  };

  prevStep = () => {
    router.push('/sales/step-form/target');
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { selectVerifyerId } = this.state;
    const { currentActivity, dispatch } = this.props;
    if (!selectVerifyerId) {
      message.error('没有选择审核人id');
      return;
    }
    if (!currentActivity.id) {
      message.error('没有创建中的活动');
      return;
    }
    const response = await dispatch({
      type: 'sales/bindVerifyer',
      payload: {
        activityId: currentActivity.id,
        verifyerId: selectVerifyerId,
      },
    });
    if (response) router.push(`/sales/step-form/result?activityId=${currentActivity.id}`);
    else message.error('提交失败');
  };

  handleSearchChange = async value => {
    this.setState({
      searching: true,
    });
    const response = await searchVerifyer(value);
    if (response) {
      const suggestions = response.result.map(item => (
        <Mention.Nav value={item.name} data={item} disabled={item.disabled}>
          <Avatar
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            size="small"
            style={{
              width: 14,
              height: 14,
              marginRight: 8,
              top: -1,
              position: 'relative',
            }}
          />
          {item.name} - {item.job.post}
        </Mention.Nav>
      ));
      this.setState({
        suggestions,
      });
    }
    this.setState({
      searching: false,
    });
  };

  handleSelect = (suggestion, data) => {
    this.setState({
      selectVerifyerId: data.id,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      group,
    } = this.props;
    const { suggestions, searching, selectVerifyerId } = this.state;

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} {...formItemLayout}>
          <Form.Item label="指定审核人">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '必须输入活动名称',
                },
              ],
              initialValue: toContentState(''),
            })(
              <Mention
                placeholder="输入@搜索审批人"
                suggestions={suggestions}
                onSearchChange={this.handleSearchChange}
                loading={searching}
                onSelect={this.handleSelect}
              />
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <div className={styles.step2Actions}>
              <Button onClick={this.prevStep} style={{ marginRight: 10 }}>
                上一步
              </Button>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                disabled={!group.name || !selectVerifyerId}
              >
                下一步
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Step4;
