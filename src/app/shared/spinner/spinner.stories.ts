import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SpinnerSize } from './spinner-size.enum';
import { SpinnerVariant } from './spinner-variant.enum';
import { CustomSpinnerComponent } from './spinner.component';
import { CustomSpinnerModule } from './spinner.module';

export default {
  component: CustomSpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [CustomSpinnerModule],
      providers: [],
    }),
  ],
  title: 'UI/Spinner',
  argTypes: {
    size: {
      options: [SpinnerSize.SMALL, SpinnerSize.MEDIUM],
      control: { type: 'select' },
    },
    variant: {
      options: [
        SpinnerVariant.DEFAULT,
        SpinnerVariant.PRIMARY,
        SpinnerVariant.SUCCESS,
        SpinnerVariant.DANGER,
        SpinnerVariant.LIGHT,
      ],
      control: { type: 'select' },
    },
  },
} as Meta;

const TEMPLATE: Story<CustomSpinnerComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {
  size: SpinnerSize.MEDIUM,
  variant: SpinnerVariant.DEFAULT,
};
