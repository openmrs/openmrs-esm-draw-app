import { type FilerobotImageEditorConfig, TABS, TOOLS } from 'react-filerobot-image-editor';
import { DEFAULT_SHAPE_CONFIGS, DEFAULT_COLOR, DEFAULT_STROKE_WIDTH } from './annotation-editor.constants';
import { defaultThemeOverrideConfigs } from './annotation-editor.theme';

export const DEFAULT_EDITOR_CONFIGS: Partial<FilerobotImageEditorConfig> = {
  defaultSavedImageName: 'annotation',
  defaultSavedImageType: 'png',
  theme: defaultThemeOverrideConfigs,
  annotationsCommon: DEFAULT_SHAPE_CONFIGS,
  Text: {
    fill: DEFAULT_COLOR,
    fontSize: 16,
    align: 'center',
    lineHeight: 1.2,
    letterSpacing: 0,
    text: 'Add text here',
    strokeWidth: 0,
  },
  Arrow: { strokeWidth: DEFAULT_STROKE_WIDTH },
  Line: { strokeWidth: DEFAULT_STROKE_WIDTH },
  Pen: { strokeWidth: DEFAULT_STROKE_WIDTH },
  tabsIds: [TABS.ANNOTATE],
  defaultTabId: TABS.ANNOTATE,
  defaultToolId: TOOLS.PEN,
  avoidChangesNotSavedAlertOnLeave: false,
  removeSaveButton: true,
};
