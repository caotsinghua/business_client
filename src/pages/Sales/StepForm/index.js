import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'model':
        return 0;
      case 'group':
        return 1;
      case 'target':
        return 2;
      case 'verify':
        return 3;
      case 'result':
        return 4;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper
        title="创建营销活动"
        tabActiveKey={location.pathname}
        content="请根据步骤完成表单的填写，完成营销活动的创建"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="筛选目标客户" />
              <Step title="填写活动信息" />
              <Step title="填写活动目标" />
              <Step title="提交审批" />
              <Step title="完成" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
