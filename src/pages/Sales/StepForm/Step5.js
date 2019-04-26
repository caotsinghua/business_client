import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Steps, Icon, Mention, Avatar, message, Spin, Modal } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import moment from 'moment';
import styles from './style.less';
import { searchVerifyer } from '@/services/user';

const { Step } = Steps;
@connect(({ sales, loading }) => ({
  currentActivity: sales.currentActivity,
  loading: loading.effects['sales/getActivity'],
}))
class Step5 extends React.PureComponent {
  constructor(props) {
    super(props);
    const { query } = props.location;
    this.activityId = query.activityId;
    this.state = {
      visible: false,
      suggestions: [],
      verifyerId: '',
      searching: false,
    };
  }

  componentDidMount() {
    if (this.activityId) {
      console.log('加载');
      console.log(this.activityId);
      // 从列表跳转来
      const { dispatch } = this.props;
      dispatch({
        type: 'sales/getActivity',
        payload: {
          activityId: this.activityId,
        },
      });
    }
  }

  onFinish = () => {
    router.push('/sales/list');
  };

  handleSubmit = async () => {
    const { verifyerId } = this.state;
    const { currentActivity, dispatch } = this.props;
    const activityId = currentActivity.id;
    const response = await dispatch({
      type: 'sales/bindVerifyer',
      payload: {
        verifyerId,
        activityId,
      },
    });
    await dispatch({
      type: 'sales/getActivity',
      payload: {
        activityId,
      },
    });
    if (response) {
      message.success('提交审批成功');
      this.setState({
        visible: false,
        suggestions: [],
        verifyerId: '',
        searching: false,
      });
    }
  };

  handleSearchChange = async searchWord => {
    this.setState({
      searching: true,
    });
    const response = await searchVerifyer(searchWord);

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
      this.setState(
        {
          suggestions,
        },
        () => {}
      );
    }
    this.setState({
      searching: false,
    });
  };

  handleSelect = (suggestion, data) => {
    this.setState({
      verifyerId: data.id,
    });
  };

  render() {
    const { currentActivity, loading } = this.props;
    const { visible, suggestions, searching } = this.state;

    const desc1 = (
      <div style={{ fontSize: 14, position: 'relative', left: 38 }}>
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          {currentActivity.creater && currentActivity.creater.name}
          <Icon type="dingding" style={{ marginLeft: 8 }} />
        </div>
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          {moment(currentActivity.latest_update_time).format('lll')}
        </div>
      </div>
    );

    const desc2 = (
      <div style={{ fontSize: 14, position: 'relative', left: 38 }}>
        {currentActivity.verify_data && currentActivity.verify_data.verify_status === 'verifying' && (
          <div style={{ marginTop: 8, marginBottom: 4 }}>
            {currentActivity.verify_data.verifyer.name}
            <Icon type="dingding" style={{ color: '#00A0E9', marginLeft: 8 }} />
          </div>
        )}
        {currentActivity.verify_data && currentActivity.verify_data.verify_status === 'unverified' && (
          <div style={{ marginTop: 8, marginBottom: 4 }}>
            <a
              onClick={() => {
                this.setState({
                  visible: true,
                });
              }}
            >
              提交审核
            </a>
          </div>
        )}
      </div>
    );

    const extra = (
      <div>
        <div
          style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500, marginBottom: 20 }}
        >
          {currentActivity.name}
        </div>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={12} lg={12} xl={6}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>项目 ID：</span>
            {currentActivity.id}
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={6}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>创建者：</span>
            {currentActivity.creater && currentActivity.creater.name}
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>生效时间：</span>
            {`${moment(currentActivity.start_time).format('LL')}~${moment(
              currentActivity.end_time
            ).format('LL')}`}
          </Col>
        </Row>
        <Steps progressDot current={1}>
          <Step title="创建项目" description={desc1} />
          <Step title="上级审核" description={desc2} />
          <Step title="审核完成" />
        </Steps>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={this.onFinish}>
          查看营销活动
        </Button>
      </Fragment>
    );
    return (
      <Spin spinning={!!loading}>
        <Result
          type="success"
          title="创建完成"
          extra={extra}
          description="请等待审核完成"
          actions={actions}
          className={styles.result}
        />
        <Modal
          title="提交审批"
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          visible={visible}
        >
          <Mention
            suggestions={suggestions}
            onSelect={this.handleSelect}
            onSearchChange={this.handleSearchChange}
            placeholder="输入@搜索审批人"
            loading={searching}
          />
        </Modal>
      </Spin>
    );
  }
}

export default Step5;
