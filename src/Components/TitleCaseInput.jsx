import { titleCase } from '../lib/titleCase';

export default function TitleCaseInput({ value, onChange, onBlur, ...rest }) {
    return (
        <input
            type="text"
            {...rest}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => {
                onChange(titleCase(e.target.value));
                onBlur?.(e);
            }}
        />
    );
}
