// Labelled form control wrapper: the input/select itself is passed as children.
export default function Field({ label, error, grow = false, children }) {
  return (
    <label className={grow ? 'field field-grow' : 'field'}>
      <span>{label}</span>
      {children}
      {error && <small className="error">{error}</small>}
    </label>
  );
}
