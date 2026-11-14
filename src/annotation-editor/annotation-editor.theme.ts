import { type FilerobotImageEditorConfig } from 'react-filerobot-image-editor';

/**
 * Theme overrides that make the Filerobot image editor match the OpenMRS (Carbon) look.
 *
 * Each key is a Filerobot palette token. Values are CSS variables provided by the
 * OpenMRS shell (`--brand-*`) and Carbon (`--cds-*`), each with a hex fallback that
 * is used when the variable is not defined.
 *
 * Filerobot only exposes palette keys, not component classes, so the comment on each
 * key says which part of the editor it paints.
 *
 * @see FilerobotImageEditorConfig['theme']
 */
export const defaultThemeOverrideConfigs: FilerobotImageEditorConfig['theme'] = {
  palette: {
    /** Selected tool background */
    'bg-primary-active': 'var(--brand-primary-10, #d9fbfb)',

    /** Selected tool text and icon */
    'accent-primary-active': 'var(--brand-01, #005d5d)',

    /** Editor card and popups */
    'bg-secondary': 'var(--cds-background, #ffffff)',

    /** Open icon button and Cancel button */
    'bg-active': 'var(--cds-layer-selected-01, #e0e0e0)',

    /** Hover state for bg-active items */
    'active-secondary-hover': 'var(--cds-layer-selected-hover-01, #cacaca)',

    /** Tool labels, zoom %, font and size inputs */
    'txt-primary': 'var(--cds-text-primary, #161616)',

    /** Image dimensions label */
    'txt-placeholder': 'var(--cds-text-secondary, #525252)',

    /** Tool icons, bottom action icons, Bold/Italic */
    'icons-primary': 'var(--cds-icon-primary, #161616)',

    /** Top bar: reset/undo/redo, zoom +/-, split view */
    'icons-muted': 'var(--cds-icon-secondary, #525252)',

    /** Top bar line, position grid, dividers */
    'borders-secondary': 'var(--cds-border-subtle-01, #e0e0e0)',

    /** Apply button, slider handles and tracks */
    'accent-stateless': 'var(--brand-03, #007d79)',
  },
  typography: {
    /** Inherit the font from the OpenMRS shell */
    fontFamily: 'inherit',
  },
};
