![Node.js CI](https://github.com/openmrs/openmrs-esm-draw-app/workflows/Node.js%20CI/badge.svg)

# OpenMRS ESM Clinical Image Annotation Tool

A professional OpenMRS frontend module for annotating clinical images with template support, structured metadata, and region-based organization.

Read the related [OpenMRS Talk post](https://talk.openmrs.org/t/gsoc-2023-o3-draw-on-body-diagram-app-project-updates-discussion/39544) for some background on this project.

## Features

### Core Functionality
- **Template-Based Annotations** - Pre-loaded clinical diagrams (body maps, wound assessments, breast exams, etc.)
- **Region Filtering** - Automatic template filtering by anatomical region and patient gender
- **Rich Drawing Tools** - Freehand, highlighter, shapes, text, measurements
- **Structured Metadata** - Classify annotations by type, severity, and clinical notes
- **Query Capabilities** - Find annotations by region, type, date, or other criteria
- **Patient Integration** - Seamless workspace integration in patient charts

### UI Features
- Horizontal collapsible toolbar for maximum canvas space
- Keyboard shortcuts for efficient workflow
- Real-time collaboration support (coming soon)
- Export and download annotated images

## Documentation

- **[Template System Guide](./TEMPLATE-SYSTEM.md)** - Complete guide to templates, regions, and queries
- **[Integration Guide](./INTEGRATION.md)** - Patient chart integration details
- **[API Reference](./TEMPLATE-SYSTEM.md#api-reference)** - Developer API documentation

## Running this code

```sh
yarn  # to install dependencies
yarn start  # to run the dev server
```

Once it is running, a browser window should open with the OpenMRS 3 application. Log in and then navigate to `/openmrs/spa/draw` or access via patient chart navigation.
