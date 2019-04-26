import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Button, Icon, Modal, Form, Input, Mention, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import Link from 'umi/link';
import styles from './Users.less';

const { toContentState, Nav } = Mention;
const { Description } = DescriptionList;

@connect(({ loading, banks }) => ({
  searchingUser: loading.effects['user/searchUserByName'],
  loading: loading.models.banks,
  staffs: banks.staffs,
  currentBank: banks.currentBank,
}))
class Users extends Component {
  constructor(props) {
    super(props);
    const {
      query: { bankId, jobId },
    } = props.location;
    this.bankId = bankId;
    this.jobId = jobId;
    this.state = {
      job: {},
      userSuggestions: [],
      suggestion: toContentState(''),
      addUserId: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  handleUserSuggestionChange = async searchWord => {
    const { dispatch } = this.props;
    const { result: users } = await dispatch({
      type: 'user/searchUserByName',
      payload: {
        searchWord,
      },
    });
    const suggestions = users.map(user => (
      <Nav value={user.name} data={user}>
        {user.id} - {user.name}
      </Nav>
    ));
    this.setState({
      userSuggestions: suggestions,
    });
  };

  handleSelectSugesstion = (_, data) => {
    this.setState({
      addUserId: data.id,
    });
  };

  handleMentionChange = value => {
    this.setState({
      suggestion: value,
    });
  };

  handleAddUser = async () => {
    const { addUserId } = this.state;
    if (!addUserId) return;
    const { dispatch } = this.props;
    const response = await dispatch({
      type: 'banks/addStaffToJob',
      payload: {
        userId: addUserId,
        jobId: this.jobId,
      },
    });
    if (response) {
      await this.fetchData();
      message.success('添加完成');
    } else {
      message.error('添加失败');
    }
    this.setState({
      suggestion: toContentState(''),
      addUserId: '',
    });
  };

  handleDeleteUser = ({ id: userId }) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '警告',
      content: '确认删除用户吗？（会删除用户职位导致无法登录）',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const response = await dispatch({
          type: 'banks/deleteStaffJob',
          payload: {
            userId,
          },
        });
        if (response) {
          await this.fetchData();
          message.success('删除完成');
        } else {
          message.error('删除失败');
        }
      },
    });
  };

  async fetchData() {
    const { dispatch } = this.props;
    await Promise.all([
      dispatch({
        type: 'banks/getBankJobStaffs',
        payload: {
          bankId: this.bankId,
          jobId: this.jobId,
        },
      }),
      dispatch({
        type: 'banks/getBank',
        payload: {
          bankId: this.bankId,
        },
      }),
    ]);
    const { currentBank } = this.props;
    this.setState({
      job: currentBank.jobs.find(job => job.id === +this.jobId),
    });
  }

  render() {
    const { currentBank, staffs, searchingUser, loading } = this.props;
    const { job, userSuggestions, suggestion } = this.state;
    return (
      <PageHeaderWrapper
        title={`${currentBank.name}-${job.post}-岗位详情`}
        loading={loading}
        content={job.title}
      >
        <Card bordered={false}>
          <DescriptionList size="large" title="岗位详情" style={{ marginBottom: 32 }}>
            <Description term="岗位id">{job.id}</Description>
            <Description term="职称">{job.title}</Description>
            <Description term="岗位名称">{job.post}</Description>
            <Description term="权限角色">{job.role}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />

          <div className={styles.tableHeader}>
            <div className={styles.title}>职位列表</div>
            <div className={styles.suggestion}>
              <Mention
                className={styles.mention}
                suggestions={userSuggestions}
                placeholder="输入@搜索用户名..."
                value={suggestion}
                onSearchChange={this.handleUserSuggestionChange}
                onSelect={this.handleSelectSugesstion}
                onChange={this.handleMentionChange}
                loading={searchingUser}
              />
              <Button type="primary" onClick={this.handleAddUser}>
                添加用户
              </Button>
            </div>
          </div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={staffs}
            columns={[
              {
                title: 'id',
                dataIndex: 'id',
                align: 'center',
              },
              {
                title: '工号',
                dataIndex: 'job_number',
                align: 'center',
              },
              {
                title: '名字',
                dataIndex: 'name',
                align: 'center',
              },
              {
                title: '性别',
                dataIndex: 'sex',
                align: 'center',
                render: sex => {
                  const map = {
                    male: '男',
                    female: '女',
                  };
                  return map[sex];
                },
              },
              {
                title: '操作',
                width: 200,
                align: 'center',
                render: item => (
                  <div className={styles.tableActions}>
                    {/* <a>修改</a> */}
                    <Button
                      type="danger"
                      onClick={() => {
                        this.handleDeleteUser(item);
                      }}
                    >
                      删除
                    </Button>
                  </div>
                ),
              },
            ]}
            rowKey="id"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Users;
