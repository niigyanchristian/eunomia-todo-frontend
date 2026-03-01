import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ItemCounter from '../ItemCounter';

describe('ItemCounter Component', () => {
  it('renders correct count', () => {
    render(<ItemCounter count={5} />);

    expect(screen.getByText('5 items left')).toBeInTheDocument();
  });

  it('handles singular "1 item left"', () => {
    render(<ItemCounter count={1} />);

    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('handles plural "2 items left"', () => {
    render(<ItemCounter count={2} />);

    expect(screen.getByText('2 items left')).toBeInTheDocument();
  });

  it('handles zero "0 items left"', () => {
    render(<ItemCounter count={0} />);

    expect(screen.getByText('0 items left')).toBeInTheDocument();
  });

  it('renders with correct className', () => {
    const { container } = render(<ItemCounter count={3} />);

    const counterDiv = container.querySelector('.item-counter');
    expect(counterDiv).toBeInTheDocument();
  });

  it('handles large numbers correctly', () => {
    render(<ItemCounter count={100} />);

    expect(screen.getByText('100 items left')).toBeInTheDocument();
  });
});
