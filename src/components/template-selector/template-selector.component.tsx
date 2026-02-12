import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  Search,
  Button,
  Tag,
  ClickableTile,
  SkeletonPlaceholder,
} from "@carbon/react";
import {
  Template,
  Checkmark,
  ChevronRight,
  RecentlyViewed,
} from "@carbon/react/icons";
import {
  ANATOMICAL_REGIONS,
  CLINICAL_TEMPLATES,
  type ClinicalTemplate,
} from "../../constants/templates.constants";
import styles from "./template-selector.scss";

export interface TemplateSelectorProps {
  selectedTemplate: ClinicalTemplate | null;
  selectedRegion: string;
  onTemplateSelect: (template: ClinicalTemplate | null) => void;
  onRegionSelect: (region: string) => void;
  patientGender?: "male" | "female";
  onClose?: () => void;
}

/**
 * Component for selecting clinical image templates with region filtering
 */
const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  selectedRegion,
  onTemplateSelect,
  onRegionSelect,
  patientGender,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recentlyUsed, setRecentlyUsed] = useState<ClinicalTemplate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [imageLoadStatus, setImageLoadStatus] = useState<
    Record<string, "loading" | "loaded" | "error">
  >({});
  const gridRef = useRef<HTMLDivElement>(null);

  // Load recently used templates from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("openmrs-recent-templates");
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        const templates = ids
          .map((id) => CLINICAL_TEMPLATES.find((t) => t.id === id))
          .filter(Boolean) as ClinicalTemplate[];
        setRecentlyUsed(templates);
      } catch (e) {
        console.error("Failed to load recent templates", e);
      }
    }
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    CLINICAL_TEMPLATES.forEach((t) => cats.add(t.category));
    return Array.from(cats);
  }, []);

  const filteredTemplates = useMemo(() => {
    let templates = CLINICAL_TEMPLATES.filter(
      (template) =>
        !patientGender ||
        template.gender === "any" ||
        template.gender === patientGender,
    );

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "all") {
      templates = templates.filter((t) => t.category === selectedCategory);
    }

    if (selectedRegion) {
      templates = templates.filter((t) => t.regions.includes(selectedRegion));
    }

    return templates;
  }, [searchQuery, selectedCategory, selectedRegion, patientGender]);

  const handleTemplateClick = useCallback(
    (template: ClinicalTemplate) => {
      onTemplateSelect(template);

      const updated = [
        template,
        ...recentlyUsed.filter((t) => t.id !== template.id),
      ].slice(0, 3);
      setRecentlyUsed(updated);
      localStorage.setItem(
        "openmrs-recent-templates",
        JSON.stringify(updated.map((t) => t.id)),
      );
    },
    [onTemplateSelect, recentlyUsed],
  );

  const handleImageLoad = (templateId: string) => {
    setImageLoadStatus((prev) => ({ ...prev, [templateId]: "loaded" }));
  };

  const handleImageError = (templateId: string) => {
    setImageLoadStatus((prev) => ({ ...prev, [templateId]: "error" }));
  };

  const handleRegionSelect = (region: string) => {
    onRegionSelect(region);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const templatesInView = filteredTemplates;
      if (templatesInView.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % templatesInView.length);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          setSelectedIndex(
            (prev) =>
              (prev - 1 + templatesInView.length) % templatesInView.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < templatesInView.length) {
            handleTemplateClick(templatesInView[selectedIndex]);
            onClose?.();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTemplates, selectedIndex, onClose]);

  return (
    <ComposedModal
      open
      onClose={onClose}
      size="lg"
      className="template-selector-modal"
    >
      <ModalHeader title="Templates" closeModal={onClose}>
        <Search
          size="lg"
          placeholder="Search all templates..."
          labelText="Search templates"
          closeButtonLabelText="Clear search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />
      </ModalHeader>
      <ModalBody className={styles.templateModalBody}>
        <div className={styles.templateLayout}>
          {/* Left sidebar navigation */}
          <aside className={styles.templateSidebar}>
            <nav className={styles.templateNav}>
              <h4 className={styles.navTitle}>Categories</h4>
              <button
                className={`${styles.navItem} ${selectedCategory === "all" ? styles.active : ""}`}
                onClick={() => setSelectedCategory("all")}
                type="button"
              >
                <Template size={20} />
                <span>All templates</span>
              </button>
              {categories
                .filter((c) => c !== "all")
                .map((category) => (
                  <button
                    key={category}
                    className={`${styles.navItem} ${selectedCategory === category ? styles.active : ""}`}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    <ChevronRight size={20} />
                    <span>{category}</span>
                  </button>
                ))}
            </nav>

            <div className={styles.templateFilters}>
              <h4 className={styles.filterTitle}>Filter by region</h4>

              <button
                className={`${styles.filterItem} ${!selectedRegion ? styles.active : ""}`}
                onClick={() => handleRegionSelect("")}
                type="button"
              >
                All regions
              </button>
              {ANATOMICAL_REGIONS.map((region) => (
                <button
                  key={region.value}
                  className={`${styles.filterItem} ${selectedRegion === region.value ? styles.active : ""}`}
                  onClick={() => handleRegionSelect(region.value)}
                  type="button"
                >
                  {region.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main content area */}
          <main className={styles.templateMain}>
            {/* Recently Used Section */}
            {recentlyUsed.length > 0 &&
              !searchQuery &&
              selectedCategory === "all" &&
              !selectedRegion && (
                <section className={styles.recentSection}>
                  <div className={styles.sectionHeader}>
                    <RecentlyViewed size={20} />
                    <h3 className={styles.sectionTitle}>Recently Used</h3>
                  </div>
                  <div className={styles.recentGrid}>
                    {recentlyUsed.map((template) => (
                      <ClickableTile
                        key={`recent-${template.id}`}
                        className={`${styles.templateCard} ${styles.recentCard} ${selectedTemplate?.id === template.id ? styles.selected : ""}`}
                        onClick={() => handleTemplateClick(template)}
                      >
                        <div className={styles.templatePreview}>
                          {imageLoadStatus[template.id] === "loading" && (
                            <SkeletonPlaceholder
                              className={styles.imageSkeleton}
                            />
                          )}
                          <img
                            src={template.imagePath}
                            alt={template.name}
                            className={styles.previewImage}
                            onLoad={() => handleImageLoad(template.id)}
                            onError={() => handleImageError(template.id)}
                            style={{
                              display:
                                imageLoadStatus[template.id] === "loaded"
                                  ? "block"
                                  : "none",
                            }}
                          />
                          {imageLoadStatus[template.id] === "error" && (
                            <div className={styles.previewIcon}>
                              <Template size={32} />
                            </div>
                          )}
                          {selectedTemplate?.id === template.id && (
                            <div className={styles.selectedBadge}>
                              <Checkmark size={16} />
                            </div>
                          )}
                        </div>
                        <div className={styles.templateInfo}>
                          <h5 className={styles.templateName}>
                            {template.name}
                          </h5>
                        </div>
                      </ClickableTile>
                    ))}
                  </div>
                </section>
              )}

            {/* All Templates Section */}
            <div className={styles.templateHeaderInfo}>
              <h3 className={styles.sectionTitle}>
                {selectedCategory === "all"
                  ? "All Templates"
                  : selectedCategory}
              </h3>
              <p className={styles.templateCount}>
                {filteredTemplates.length} templates
              </p>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className={styles.noTemplates}>
                <Template size={48} />
                <h4>No templates found</h4>
                <p>Try adjusting your search or filters to find templates</p>
                <div className={styles.emptyActions}>
                  <Button
                    kind="ghost"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      onRegionSelect("");
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.templateGrid} ref={gridRef}>
                {filteredTemplates.map((template, index) => (
                  <ClickableTile
                    key={template.id}
                    className={`${styles.templateCard} ${
                      selectedTemplate?.id === template.id
                        ? styles.selected
                        : ""
                    } ${selectedIndex === index ? styles.keyboardFocused : ""}`}
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className={styles.templatePreview}>
                      {(!imageLoadStatus[template.id] ||
                        imageLoadStatus[template.id] === "loading") && (
                        <SkeletonPlaceholder className={styles.imageSkeleton} />
                      )}
                      <img
                        src={template.imagePath}
                        alt={template.name}
                        className={styles.previewImage}
                        onLoad={() => handleImageLoad(template.id)}
                        onError={() => handleImageError(template.id)}
                        style={{
                          display:
                            imageLoadStatus[template.id] === "loaded"
                              ? "block"
                              : "none",
                        }}
                      />
                      {imageLoadStatus[template.id] === "error" && (
                        <div className={styles.previewIcon}>
                          <Template size={32} />
                        </div>
                      )}
                      {selectedTemplate?.id === template.id && (
                        <div className={styles.selectedBadge}>
                          <Checkmark size={16} />
                        </div>
                      )}
                    </div>
                    <div className={styles.templateInfo}>
                      <h5 className={styles.templateName}>{template.name}</h5>
                      <p className={styles.templateDescription}>
                        {template.description}
                      </p>
                      <div className={styles.templateTags}>
                        {template.gender && template.gender !== "any" && (
                          <Tag type="blue" size="sm">
                            {template.gender === "male" ? "♂" : "♀"}
                          </Tag>
                        )}
                        {template.regions.slice(0, 2).map((regionId) => {
                          const region = ANATOMICAL_REGIONS.find(
                            (r) => r.value === regionId,
                          );
                          return region ? (
                            <Tag key={regionId} type="outline" size="sm">
                              {region.label}
                            </Tag>
                          ) : null;
                        })}
                        {template.regions.length > 2 && (
                          <Tag type="outline" size="sm">
                            +{template.regions.length - 2}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </ClickableTile>
                ))}
              </div>
            )}
          </main>
        </div>
      </ModalBody>
    </ComposedModal>
  );
};

export default TemplateSelector;
