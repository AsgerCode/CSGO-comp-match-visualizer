import { render, screen } from '@testing-library/react';
import Home from '../../src/pages/index';

jest.mock('next/router', () => require('next-router-mock'));

describe('Home', () => {
  it('renders the file upload input', () => {
    const { container } = render(<Home />);
    const input = screen.getByRole('fileInput');
    expect(input).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});