import React from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="flex items-center">
      <input
        className="field w-full sm:w-80"
        placeholder={placeholder || 'Search client or quotation ID...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
