import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Tag,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Popover,
  Form,
  Mention,
  Modal,
  message,
  Tooltip,
  Select,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { searchVerifyer, searchManagers } from '@/services/user';
import styles from './Sales.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

const formatStatus = status => {
  const map = {
    created: {
      text: '未开始',
      color: 'blue',
    },
    online: {
      text: '已上线',
      color: 'green',
    },
    offline: {
      text: '已下线',
      color: 'red',
    },
  };
  return map[status];
};

const formatVerifyStatus = status => {
  const map = {
    unverified: {
      text: '未提审',
      color: 'volcano',
    },
    verifying: {
      text: '审批中',
      color: 'geekblue',
    },
    pass: {
      text: '通过',
      color: 'green',
    },
    nopass: {
      text: '未通过',
      color: 'red',
    },
  };
  return map[status];
};

@connect(({ sales, loading }) => ({
  list: sales.list,
  total: sales.total,
  page: sales.page,
  pageSize: sales.pageSize,
  loading: loading.effects['sales/getActivities'],
}))
@Form.create()
class Sales extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props) {
    super(props);
    this.state = {
      filterActivities: props.list,
      filterType: 'ALL',
      visible: false,
      formKey: '',
      currentItem: {},
      suggestions: [],
      searching: false,
      selectedId: '',
      verifyStatus: 'pass',
      nopassReason: '',
    };
  }

  async componentDidMount() {
    await this.fetchData();
    const { list } = this.props;
    this.setState({
      filterActivities: list,
    });
  }

  fetchData = async (page = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'sales/getActivities',
      payload: {
        page,
        pageSize,
      },
    });
  };

  handleCreateActivity = () => {
    router.push('/sales/step-form/model');
  };

  toStatistic = item => {
    const { verify_status: status } = item.verify_data;
    if (status === 'pass' || status === 'nopass') {
      router.push(`/sales/${item.id}/statistic`);
    } else {
      router.push(`/sales/step-form/result?activityId=${item.id}`);
    }
  };

  handleChangeType = e => {
    const { value } = e.target;
    const { list } = this.props;
    const data = { ...this.state };
    switch (value) {
      case 'ALL':
        data.filterActivities = list;
        break;
      case 'CREATED':
        data.filterActivities = list.filter(item => item.status === 'created');
        break;
      case 'UNVERIFIED':
        data.filterActivities = list.filter(
          item => item.verify_data.verify_status === 'unverified'
        );
        break;
      case 'ONLINE':
        data.filterActivities = list.filter(item => item.status === 'online');
        break;
      case 'OFFLINE':
        data.filterActivities = list.filter(item => item.status === 'offline');
        break;
      default:
        data.filterActivities = list;
        break;
    }
    this.setState({
      ...data,
      filterType: value,
    });
  };

  handleVerifyStatusChange = value => {
    this.setState({
      verifyStatus: value,
    });
  };

  handleReasonChange = e => {
    this.setState({
      nopassReason: e.target.value,
    });
  };

  renderModalForm = () => {
    const { formKey, suggestions, searching, verifyStatus, nopassReason } = this.state;
    if (formKey.indexOf('bind') != -1) {
      return (
        <Mention
          suggestions={suggestions}
          onSearchChange={
            formKey === 'bindVerifyer' ? this.handleSearchVerifyers : this.handleSearchManagers
          }
          loading={searching}
          onSelect={this.handleSelect}
          placeholder="输入@进行搜索"
        />
      );
    }
    return (
      <Form>
        <Form.Item label="审批状态">
          <Select value={verifyStatus} onChange={this.handleVerifyStatusChange}>
            <Select.Option value="pass">通过</Select.Option>
            <Select.Option value="nopass">不通过</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="拒绝理由">
          <Input.TextArea
            disabled={verifyStatus === 'pass'}
            placeholder="输入不通过的原因..."
            value={nopassReason}
            onChange={this.handleReasonChange}
          />
        </Form.Item>
      </Form>
    );
  };

  handleSearchVerifyers = async value => {
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

  handleSearchManagers = async value => {
    this.setState({
      searching: true,
    });
    const response = await searchManagers(value);
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
      selectedId: data.id,
    });
  };

  handleOk = async () => {
    const { formKey, currentItem, selectedId, verifyStatus, nopassReason } = this.state;
    const { dispatch, page, pageSize } = this.props;
    if (formKey === 'bindVerifyer') {
      const response = await dispatch({
        type: 'sales/bindVerifyer',
        payload: {
          verifyerId: selectedId,
          activityId: currentItem.id,
        },
      });
      if (response) {
        message.success('提交审批成功');
      }
    }

    if (formKey === 'bindManager') {
      const response = await dispatch({
        type: 'sales/bindManager',
        payload: {
          managerId: selectedId,
          activityId: currentItem.id,
        },
      });
      if (response) {
        message.success('分配客户经理成功');
      }
    }

    if (formKey === 'verify') {
      const response = await dispatch({
        type: 'sales/changeVerifyStatus',
        payload: {
          status: verifyStatus,
          nopass_reason: nopassReason,
          activity: currentItem,
        },
      });

      if (response) {
        const { list } = this.props;
        this.setState({
          filterActivities: list,
        });
        message.success('审核完成');
      }
    }
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      formKey: '',
      currentItem: {},
      suggestions: [],
      searching: false,
      selectedId: '',
      visible: false,
    });
  };

  handleChangePage = async (page, pageSize) => {
    await this.fetchData(page, pageSize);
    const { list } = this.props;
    this.setState({
      filterActivities: list,
    });
  };

  render() {
    const { total, page, pageSize, loading } = this.props;
    const { filterActivities, filterType, visible } = this.state;
    const handleMenuClick = (key, currentItem) => {
      this.setState({
        formKey: key,
        visible: true,
        currentItem,
      });
    };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup value={filterType} onChange={this.handleChangeType}>
          <RadioButton value="ALL">全部</RadioButton>
          <RadioButton value="UNVERIFIED">未提审</RadioButton>
          <RadioButton value="CREATED">未上线</RadioButton>
          <RadioButton value="ONLINE">已上线</RadioButton>
          <RadioButton value="OFFLINE">已下线</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const ListContent = ({
      data: {
        creater,
        start_time: startTime,
        end_time: entTime,
        latest_update_time: latestUpdateTime,
        status,
        verify_data: verifyData,
      },
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>创建者</span>
          <p>{creater.name}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>活动时间</span>
          <p>
            {`${moment(startTime).format('YYYY-MM-DD')}~${moment(entTime).format('YYYY-MM-DD')}`}
          </p>
        </div>
        <div className={styles.listContentItem}>
          <span>最后修改时间</span>
          <p>{moment(latestUpdateTime).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Tag color={formatStatus(status).color}>{formatStatus(status).text}</Tag>
          <Popover
            content={
              <div>
                <div>审批人:{(verifyData.verifyer && verifyData.verifyer.name) || '无审批人'}</div>
                {verifyData.verify_status === 'nopass' && (
                  <div>不通过原因：{verifyData.nopass_reason}</div>
                )}
              </div>
            }
            trigger="hover"
            title="审核信息"
          >
            <Tag color={formatVerifyStatus(verifyData.verify_status).color}>
              {formatVerifyStatus(verifyData.verify_status).text}
            </Tag>
          </Popover>
        </div>
      </div>
    );

    const MoreBtn = ({ current }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => handleMenuClick(key, current)}>
            <Menu.Item
              key="bindVerifyer"
              disabled={current.verify_data.verify_status !== 'unverified'}
            >
              提交审批
            </Menu.Item>
            <Menu.Item key="verify" disabled={current.verify_data.verify_status !== 'verifying'}>
              审批
            </Menu.Item>
            <Menu.Item key="bindManager">指定客户经理</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的营销活动" value="188个活动" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="待处理活动" value="8个活动" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="进行中活动" value="24个活动" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="营销活动列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.handleCreateActivity}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加营销活动
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize,
                total,
                current: page,
                onChange: this.handleChangePage,
              }}
              dataSource={filterActivities}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.toStatistic(item);
                      }}
                    >
                      查看营销数据
                    </a>,
                    <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.poster}
                        shape="square"
                        size="large"
                        style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                      >
                        {item.name && item.name[0]}
                      </Avatar>
                    }
                    title={
                      <Tooltip title="查看并编辑">
                        <Link to={`/sales/${item.id}`}>{item.name}</Link>
                      </Tooltip>
                    }
                    description={item.other_data}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          visible={visible}
          title="表单"
          okText="提交"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.renderModalForm()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Sales;
