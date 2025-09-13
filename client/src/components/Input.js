function Input({ type, placeholder, value, errorMessage, label, name, required = false, onChange}) {
  return (
    <div>
      <div className="form-group">
        <label>{label}</label>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Input;
