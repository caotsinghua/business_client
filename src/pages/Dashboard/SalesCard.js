import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData = [
  {
    title: `招商银行总行`,
    total: 835,
  },
  {
    title: `招商银行南京分行`,
    total: 623,
  },
  {
    title: `招商银行南京分行第一支行`,
    total: 617,
  },
  {
    title: `招商银行北京分行第一支行`,
    total: 593,
  },
  {
    title: `招商银行浙江分行`,
    total: 481,
  },
  {
    title: `招商银行江苏分行`,
    total: 399,
  },
  {
    title: `招商银行河北分行`,
    total: 361,
  },
  {
    title: `招商银行安徽分行`,
    total: 320,
  },
];

const SalesCard = memo(
  ({ rangePickerValue, salesData, handleRangePickerChange, loading, selectDate }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{ width: 256 }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane tab="营销收益" key="sales">
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar height={400} title="趋势" data={salesData} />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>支行达成营销单数排名</h4>
                  <ul className={styles.rankingList}>
                    {rankingListData.map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {numeral(item.total).format('0,0')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
