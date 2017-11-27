import React from 'react';
import App from '../src/components/App';

describe('Comment item', () => {
  const wrapper = shallow(<App />);

  it('should be a list item', () => {
    expect(wrapper.type()).to.eql('div');
  });
});