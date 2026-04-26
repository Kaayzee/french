function GrammarOptionCard({ option, selected, onSelect }) {
  return (
    <button
      type="button"
      className={[
   "grammar-settings__option",
        selected ? "grammar-settings__option--selected" : "",
      ].join(" ")}
      onClick={() => onSelect(option.value)}
    >
      <span className="grammar-settings__option-label">
        {option.label}
      </span>

      <span className="grammar-settings__option-description">
        {option.description}
      </span>
    </button>
  );
}

export default GrammarOptionCard;