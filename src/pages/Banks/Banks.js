import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link'
import { Card, Button, Icon, List, Modal, Form, Input, message, Tag } from 'antd';
import { getAuthority } from '@/utils/authority';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Banks.less';

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

@connect(({ banks, loading }) => ({
  banks: banks.banks,
  loadingAllBanks: loading.effects['banks/getBanks'],
  loadingUserBanks: loading.effects['banks/getUserBanks'],
}))
@Form.create()
class Banks extends Component {
  constructor() {
    super();
    this.state = {
      createBankModalVisible: false,
    };
    const roles = getAuthority();
    if (roles.find(role => role === 'root')) {
      this.isRoot = true; // 是管理员用户
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'banks/getBanks',
    });
  }

  openModal = () => {
    this.setState({
      createBankModalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      createBankModalVisible: false,
    });
  };

  handleCreateBank = () => {
    const { form, dispatch } = this.props;
    form.validateFields(async (error, values) => {
      if (!error) {
        const response = await dispatch({
          type: 'banks/createBank',
          payload: values,
        });
        if (response) {
          message.success('创建成功');
          this.closeModal();
        }
      }
    });
  };

  render() {
    const { createBankModalVisible } = this.state;
    const {
      form: { getFieldDecorator },
      banks,
      loadingAllBanks,
      loadingUserBanks,
    } = this.props;
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>这里是您所在银行所在的支行列表，您可以添加新的支行或者对员工进行管理。</p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="银行列表"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    return (
      <PageHeaderWrapper title="银行列表" content={content} extraContent={extraContent}>
        <div className={styles.banks}>
          <List
            rowKey="id"
            loading={loadingAllBanks || loadingUserBanks}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...banks]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card} actions={[<Link to={`/banks/${item.id}`}>进入管理</Link>]}>
                    <Card.Meta
                      avatar={
                        <img
                          alt=""
                          className={styles.cardAvatar}
                          src={
                            item.avatar ||
                            'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
                          }
                        />
                      }
                      title={<a>{item.name}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                    <div className={styles.bankInfo}>
                      <div className={styles.infoItem}>
                        <Tag color={item.parent_bank ? '#2db7f5' : '#f50'}>
                          {item.parent_bank ? `${item.parent_bank.name}-支行` : '总/分行'}
                        </Tag>
                      </div>
                      <div className={styles.infoItem}>
                        <Icon type="user" />
                        &nbsp;{(item.leader && item.leader.name) || '暂无主管'}
                      </div>
                      <div className={styles.infoItem}>
                        <Icon type="home" />
                        &nbsp;{item.address || '暂无地址'}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton} onClick={this.openModal}>
                    <Icon type="plus" /> {this.isRoot ? '新建银行' : '新建下属支行'}
                  </Button>
                </List.Item>
              )
            }
          />
          <Modal
            visible={createBankModalVisible}
            onCancel={this.closeModal}
            onOk={this.handleCreateBank}
            width="600px"
            title="创建银行"
          >
            <Form {...formItemLayout}>
              <FormItem label="名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '必须填写银行名称',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="简介">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: '必须填写简介',
                    },
                  ],
                })(<Input.TextArea placeholder="输入银行简介" />)}
              </FormItem>
              <FormItem label="地址">{getFieldDecorator('address', {})(<Input />)}</FormItem>
              <FormItem label="联系方式">
                {getFieldDecorator('phone_number', {})(<Input />)}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Banks;
