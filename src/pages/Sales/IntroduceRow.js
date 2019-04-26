import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ChartCard, Field } from '@/components/Charts';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData, total }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="目标客户数"
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(visitData.target_customers_count).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            value={`${Number((visitData.joined_count / total) * 100).toFixed(2)}%`}
          />
        }
        contentHeight={46}
      >
        <Field label="全部客户数" value={total} />
        <Field label="加入客户数" value={visitData.joined_count} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="目标转入资金"
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={<Yuan>{visitData.target_money}</Yuan>}
        footer={
          <Field
            label={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            value={`${Number((visitData.money_total / visitData.target_money) * 100).toFixed(2)}%`}
          />
        }
        contentHeight={46}
      >
        <Field label="当前转入资金" value={<Yuan>{visitData.money_total}</Yuan>} />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
