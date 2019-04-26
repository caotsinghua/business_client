import React, { PureComponent } from 'react';
import { Input } from 'antd';

class InputBetween extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      min: value.min || 0,
      max: value.max || 0,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  handleChangeMin = e => {
    const min = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(min)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ min });
    }
    this.triggerChange({ min });
  };

  handleChangeMax = e => {
    const max = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(max)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ max });
    }
    this.triggerChange({ max });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { min, max } = this.state;
    return (
      <Input.Group compact>
        <Input
          style={{ width: 100, textAlign: 'center' }}
          value={min}
          onChange={this.handleChangeMin}
          placeholder="最小值"
        />
        <Input
          style={{
            width: 30,
            borderLeft: 0,
            pointerEvents: 'none',
            backgroundColor: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input
          style={{ width: 100, textAlign: 'center', borderLeft: 0 }}
          value={max}
          onChange={this.handleChangeMax}
          placeholder="最大值"
        />
      </Input.Group>
    );
  }
}

export default InputBetween;
