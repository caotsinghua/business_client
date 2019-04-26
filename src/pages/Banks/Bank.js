import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Button, Icon, Modal, Form, Input, Mention, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import Link from 'umi/link';
import styles from './Bank.less';

const { toContentState, getMentions, Nav, toString } = Mention;
const { Description } = DescriptionList;

@connect(({ banks, loading }) => ({
  bank: banks.currentBank,
  loading: loading.effects['banks/getBank'],
  searchingUser: loading.effects['user/searchUserByName'],
  searchingBank: loading.effects['bank/searchBankByName'],
}))
@Form.create()
class Bank extends Component {
  constructor(props) {
    super(props);
    const { bankId } = props.match.params;
    this.bankId = bankId;
    this.state = {
      updateBankModalVisible: false,
      userSuggestions: [],
      bankSuggestions: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { bankId: prevBankId },
      },
    } = this.props;
    const {
      match: {
        params: { bankId: currentBankId },
      },
    } = nextProps;
    if (prevBankId !== currentBankId) {
      this.bankId = currentBankId;
      this.fetchData();
    }
  }

  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banks/getBank',
      payload: {
        bankId: this.bankId,
      },
    });
  };

  handleSaveEditedBank = () => {
    const { form, dispatch } = this.props;
    form.validateFields(async (error, values) => {
      if (!error) {
        const data = {
          ...values,
          parentBankId:
            toString(values.parentBankId)
              .replace(/@/g, '')
              .trim() || null,
          leaderId:
            toString(values.leaderId)
              .replace(/@/g, '')
              .trim() || null,
        };
        const response = await dispatch({
          type: 'banks/updateBank',
          payload: {
            ...data,
            bankId: this.bankId,
          },
        });
        if (response) {
          message.success('修改成功');
          this.closeModal();
        } else {
          message.error('修改失败');
        }
      }
    });
  };

  setModalForm = () => {
    const { bank, form } = this.props;
    form.setFieldsValue({
      description: bank.description,
      phone_number: bank.phone_number,
      name: bank.name,
      address: bank.address,
      parentBankId: toContentState((bank.parent_bank && `${bank.parent_bank.id}`) || ''),
      leaderId: toContentState((bank.leader && `${bank.leader.id}`) || ''),
    });
  };

  checkMention = (rule, value, callback) => {
    const mentions = getMentions(value);
    if (mentions.length > 1) {
      callback(new Error('只能选择一个'));
    } else {
      callback();
    }
  };

  openModal = () => {
    this.setModalForm();
    this.setState({
      updateBankModalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      updateBankModalVisible: false,
    });
  };

  handleUserSuggestionChange = async searchWord => {
    const { dispatch } = this.props;
    const { result: users } = await dispatch({
      type: 'user/searchUserByName',
      payload: {
        searchWord,
      },
    });
    const suggestions = users.map(user => (
      <Nav value={user.id} data={user}>
        {user.id} - {user.name}
      </Nav>
    ));
    this.setState({
      userSuggestions: suggestions,
    });
  };

  handleBankSuggestionChange = async searchWord => {
    const { dispatch } = this.props;
    const { result: banks } = await dispatch({
      type: 'banks/searchBankByName',
      payload: {
        searchWord,
      },
    });
    const suggestions = banks.map(bank => {
      if (bank.id !== this.currentBankId) {
        return (
          <Nav value={bank.id} data={bank}>
            {bank.id} - {bank.name}
          </Nav>
        );
      }
    });
    this.setState({
      bankSuggestions: suggestions,
    });
  };

  render() {
    const {
      loading,
      bank = {},
      form: { getFieldDecorator },
      searchingBank,
      searchingUser,
    } = this.props;
    const { updateBankModalVisible, userSuggestions, bankSuggestions } = this.state;
    const descriptionListTitle = (
      <div className={styles.descriptionListTitle}>
        <p>{bank.name}</p>
        <Button type="primary" onClick={this.openModal}>
          <Icon type="edit" /> 编辑
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper title={`${bank.name}详情`} loading={loading} content={bank.description}>
        <Card bordered={false}>
          <DescriptionList size="large" title={descriptionListTitle} style={{ marginBottom: 32 }}>
            <Description term="银行id">{bank.id}</Description>
            <Description term="描述">{bank.description}</Description>
            <Description term="地址">{bank.address}</Description>
            <Description term="创建时间">{moment(bank.created_time).format('LL')}</Description>
            <Description term="联系方式">{bank.phone_number}</Description>
            <Description term="负责人">{(bank.leader && bank.leader.name) || '无'}</Description>
            <Description term="上级银行">
              {(bank.parent_bank && bank.parent_bank.name) || '无'}
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />

          <div className={styles.title}>职位列表</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={bank.jobs}
            columns={[
              {
                title: '职称',
                dataIndex: 'title',
                align: 'center',
              },
              {
                title: '岗位',
                dataIndex: 'post',
                align: 'center',
              },
              {
                title: '权限角色',
                dataIndex: 'role',
                align: 'center',
              },
              {
                title: '操作',
                width: 200,
                align: 'center',
                render: job => (
                  <div className={styles.tableActions}>
                    {/* <a>修改</a> */}
                    <Link to={`/users/list?bankId=${bank.id}&jobId=${job.id}`}>用户管理</Link>
                  </div>
                ),
              },
            ]}
            rowKey="id"
          />

          <div className={styles.title}>下属支行</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={bank.sub_banks}
            columns={[
              {
                title: 'id',
                dataIndex: 'id',
                align: 'center',
                width: '100px',
              },
              {
                title: '银行名称',
                dataIndex: 'name',
                align: 'center',
              },
              {
                title: '描述',
                dataIndex: 'description',
              },
              {
                title: '操作',
                render: item => <Link to={`/banks/${item.id}`}>查看</Link>,
              },
            ]}
            rowKey="id"
          />
        </Card>
        <Modal
          visible={updateBankModalVisible}
          onCancel={this.closeModal}
          onOk={this.handleSaveEditedBank}
          title="修改银行信息"
          okText="保存修改"
        >
          <Form labelCol={{ xs: 24, sm: 4 }} wrapperCol={{ xs: 24, sm: 16 }}>
            <Form.Item label="银行名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请填写银行名称',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="描述">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: '请填写银行简介',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入地址',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="联系方式">
              {getFieldDecorator('phone_number', {
                rules: [
                  {
                    required: true,
                    message: '请填写联系号码',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="负责人id">
              {getFieldDecorator('leaderId', {
                rules: [{ validator: this.checkMention }],
              })(
                <Mention
                  suggestions={userSuggestions}
                  placeholder="输入@名字来提及一个用户或直接输入id"
                  onSearchChange={this.handleUserSuggestionChange}
                  loading={searchingUser}
                />
              )}
            </Form.Item>
            <Form.Item label="上级银行id">
              {getFieldDecorator('parentBankId', {
                rules: [{ validator: this.checkMention }],
              })(
                <Mention
                  suggestions={bankSuggestions}
                  placeholder="输入@名字来提及一个银行或直接输入id"
                  onSearchChange={this.handleBankSuggestionChange}
                  loading={searchingBank}
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Bank;
