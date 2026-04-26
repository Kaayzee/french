import GrammarOptionCard from "./GrammarOptionCard";

function GrammarSettingsSection({
    step,
    title,
    selectedValue,
    options,
    onSelect,
}) {
    return (
        <section className="grammar-settings__section">
            <div className="grammar-settings__section-header">
                <span className="grammar-settings__step">{step}</span>
                <h2>{title}</h2>
            </div>

            <div className="grammar-settings__options">
                {options.map((option) => (
                    <GrammarOptionCard
                        key={option.value}
                        option={option}
                        selected={selectedValue === option.value}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </section>
    );
}

export default GrammarSettingsSection;