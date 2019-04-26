import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

@connect(({ loading, user }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
}))
class Center extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    // dispatch({
    //   type: 'list/fetch',
    //   payload: {
    //     count: 8,
    //   },
    // });
    // dispatch({
    //   type: 'project/fetchNotice',
    // });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'articles':
        router.push(`${match.url}/articles`);
        break;
      case 'applications':
        router.push(`${match.url}/applications`);
        break;
      case 'projects':
        router.push(`${match.url}/projects`);
        break;
      default:
        break;
    }
  };

  render() {
    const { currentUser, currentUserLoading, match, location, children } = this.props;

    const operationTabList = [
      {
        key: 'articles',
        tab: (
          <span>
            文章 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'applications',
        tab: (
          <span>
            应用 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'projects',
        tab: (
          <span>
            项目 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>没有写个人说明</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <Icon type="idcard" />
                      {currentUser.job_number}
                    </p>
                    <p>
                      <i className={styles.title} />
                      {(currentUser.bank &&
                        currentUser.job &&
                        `${currentUser.bank.name}-${currentUser.job.title}-${
                          currentUser.job.post
                        }`) ||
                        '尚未加入银行部门'}
                    </p>
                    <p>
                      <i className={styles.group} />
                    </p>
                    <p>
                      <i className={styles.address} />
                      {currentUser.address || '未填写家庭住址'}
                    </p>
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>所属银行</div>
                    <Spin spinning={currentUserLoading}>
                      <Row gutter={36}>
                        {currentUser.bank && (
                          <Col key={currentUser.id} lg={24} xl={12}>
                            <Link to={`/banks/${currentUser.bank.id}`}>
                              <Avatar
                                size="small"
                                src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                              />
                              {currentUser.bank.name}
                            </Link>
                          </Col>
                        )}
                      </Row>
                    </Spin>
                  </div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            {/* <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card> */}
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
