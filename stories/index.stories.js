import React from 'react';

import { Assemble } from '../src/index';

export default {
  title: 'Example/Assemble',
  component: Assemble,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Assemble {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Assemble',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Assemble',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Assemble',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Assemble',
};
