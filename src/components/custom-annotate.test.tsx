import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import SvgEditor from './custom-annotate.component';
import { isElementInDocument } from '../test-utils';

/* The code is a test suite for the `SvgEditor` component. It contains multiple test cases that verify
different functionalities of the component. */
describe('SvgEditor Component', () => {
  it('renders the SvgEditor component', () => {
    const { container } = render(<SvgEditor />);
    const canvasContainer = container.querySelector('.canvas-container');
    expect(isElementInDocument(canvasContainer)).toBe(true);
  });

  it('can add a shape to the canvas', () => {
    const { getByText } = render(<SvgEditor />);
    const addShapeButton = getByText('Add Shape');
    fireEvent.click(addShapeButton);
  });

  it('can select drawing mode', () => {
    const { getByText } = render(<SvgEditor />);
    const freehandButton = getByText('Freehand');
    fireEvent.click(freehandButton);
  });

  it('can add text to the canvas', () => {
    const { getByText } = render(<SvgEditor />);
    const addTextButton = getByText('Add Text');
    fireEvent.click(addTextButton);
  });

  it('can change the color of an object on the canvas', () => {
    const { getByText, container } = render(<SvgEditor />);
    const addShapeButton = getByText('Add Shape');
    fireEvent.click(addShapeButton);

    const colorPicker = container.querySelector('input[type="color"]');
    fireEvent.change(colorPicker, { target: { value: '#ff0000' } });

  });

  it('can undo and redo actions', () => {
    const { getByText } = render(<SvgEditor />);
    const addShapeButton = getByText('Add Shape');
    fireEvent.click(addShapeButton);

    const undoButton = getByText('Undo');
    const redoButton = getByText('Redo');
    fireEvent.click(undoButton);

    fireEvent.click(redoButton);
  });

  it('can upload an image', () => {
    const { getByLabelText } = render(<SvgEditor />);
    const fileInput = getByLabelText('Upload Image');
  });

  it('can save an annotated image', () => {
    const { getByText } = render(<SvgEditor />);
    const addShapeButton = getByText('Add Shape');
    fireEvent.click(addShapeButton);

    const saveButton = getByText('Save');
  });
});
