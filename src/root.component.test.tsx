import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Root from './root.component';

describe('Root', () => {
  it('renders the Draw page at the /draw route', () => {
    window.history.pushState({}, '', '/openmrs/spa/draw/');
    render(<Root />);
    expect(screen.getByRole('heading', { name: 'Draw' }));
  });
});
