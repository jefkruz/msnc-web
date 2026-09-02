export default function BiodataStepNav({ sections = [], activeId, onSelect }) {
    const completedCount = sections.filter((section) => section.complete).length;
    const progress = sections.length ? Math.round((completedCount / sections.length) * 100) : 0;

    return (
        <nav className="biodata-step-nav" aria-label="Biodata sections">
            <div className="biodata-step-nav__header">
                <div>
                    <p className="biodata-step-nav__eyebrow">Your progress</p>
                    <p className="biodata-step-nav__summary">
                        {completedCount} of {sections.length} sections complete
                    </p>
                </div>
                <span className="biodata-step-nav__percent">{progress}%</span>
            </div>
            <div className="biodata-step-nav__track" aria-hidden="true">
                <div className="biodata-step-nav__bar" style={{ width: `${progress}%` }} />
            </div>
            <ol className="biodata-step-nav__list">
                {sections.map((section, index) => {
                    const isActive = section.id === activeId;
                    const stateClass = section.complete
                        ? 'biodata-step-nav__item--complete'
                        : isActive
                            ? 'biodata-step-nav__item--active'
                            : section.accessible
                                ? 'biodata-step-nav__item--accessible'
                                : 'biodata-step-nav__item--locked';

                    return (
                        <li key={section.id} className={`biodata-step-nav__item ${stateClass}`}>
                            <button
                                type="button"
                                className="biodata-step-nav__button"
                                onClick={() => section.accessible && onSelect?.(section.id)}
                                disabled={!section.accessible}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                <span className="biodata-step-nav__index" aria-hidden="true">
                                    {section.complete ? (
                                        <span className="material-symbols-outlined">check</span>
                                    ) : (
                                        index + 1
                                    )}
                                </span>
                                <span className="biodata-step-nav__copy">
                                    <span className="biodata-step-nav__label">{section.label}</span>
                                    <span className="biodata-step-nav__description">{section.description}</span>
                                </span>
                                <span className="material-symbols-outlined biodata-step-nav__icon">{section.icon}</span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
