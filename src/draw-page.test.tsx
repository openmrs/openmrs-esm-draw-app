import React from 'react';
import { render } from '@testing-library/react';
import { isElementInDocument } from './test-utils'; 
import DrawPage from './draw-page.component';

jest.mock('./components/custom-annotate.component', () => {
  return () => <div data-testid="mock-svg-editor" />;
});

describe('DrawPage Component', () => {
  it('renders the DrawPage component', () => {
    const { container } = render(<DrawPage />);
    const editorContainer = container.querySelector('.editor-container');

    expect(isElementInDocument(editorContainer as HTMLElement)).toBe(true);
  });

  it('renders the SvgEditor component within the DrawPage', () => {
    const { getByTestId } = render(<DrawPage />);
    const svgEditor = getByTestId('mock-svg-editor');

    expect(isElementInDocument(svgEditor as HTMLElement)).toBe(true);
  });
});
