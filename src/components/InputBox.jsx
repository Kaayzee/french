import "../styles/InputBox.css";

export default function InputBox({
  input,
  setInput,
  onSubmit,
  disabled
}) {
  return (
    <div className="mt-3 input-box d-flex gap-2">
      <input
        className="form-control"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type answer..."
        disabled={disabled}
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />

      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={disabled}
      >
        Submit
      </button>
    </div>
  );
}