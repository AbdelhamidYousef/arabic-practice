import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Alert } from './Alert';
import { Badge } from './Badge';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { Input } from './Input';
import { Spinner } from './Spinner';
import { Textarea } from './Textarea';

describe('Alert', () => {
  it('interrupts for errors and announces politely for everything else', () => {
    const { rerender } = render(<Alert tone="danger">Broken</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Broken');
    rerender(<Alert tone="info">Heads up</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Heads up');
  });
});

describe('Input and Textarea', () => {
  it('label the control and link the hint', () => {
    render(<Input label="Email" hint="We never share it" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('We never share it');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('mark the control invalid and describe it with the error instead of the hint', () => {
    render(<Textarea label="Message" hint="Hint" error="Too short" />);
    const area = screen.getByLabelText('Message');
    expect(area).toHaveAttribute('aria-invalid', 'true');
    expect(area).toHaveAccessibleDescription('Too short');
  });

  it('accept typing', async () => {
    render(<Input label="Name" />);
    await userEvent.setup().type(screen.getByLabelText('Name'), 'Sara');
    expect(screen.getByLabelText('Name')).toHaveValue('Sara');
  });
});

describe('small display components', () => {
  it('Spinner speaks its label, or stays silent with null', () => {
    const { rerender } = render(<Spinner label="Loading" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    rerender(<Spinner label={null} />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('EmptyState shows title, text and the way out', () => {
    render(
      <EmptyState title="Nothing yet" description="Start a lesson" action={<a href="/">Go</a>} />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing yet' })).toBeInTheDocument();
    expect(screen.getByText('Start a lesson')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go' })).toBeInTheDocument();
  });

  it('Card and Badge render their children', () => {
    render(
      <Card>
        <Badge tone="accent">Fix</Badge>
      </Card>,
    );
    expect(screen.getByText('Fix')).toBeInTheDocument();
  });
});
