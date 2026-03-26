import React, { useState } from 'react';
import { Input, Button } from '@/core/ui';
import type { SampleCreateData } from '../types';

interface SampleFormProps {
  initialData?: SampleCreateData;
  onSubmit: (data: SampleCreateData) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const SampleForm: React.FC<SampleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '저장',
}) => {
  const [formData, setFormData] = useState<SampleCreateData>(
    initialData ?? { name: '', value: 0, description: '' }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof SampleCreateData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SampleCreateData, string>> = {};
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (isNaN(formData.value)) newErrors.value = '유효한 숫자를 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="이름 *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="항목 이름을 입력하세요"
        error={errors.name}
      />

      <Input
        label="설명"
        value={formData.description ?? ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="설명 (선택)"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="값 *"
          type="number"
          step="any"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
          placeholder="수치 값"
          error={errors.value}
        />

        <Input
          label="점수"
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={formData.score ?? ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              score: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          placeholder="0.0 ~ 1.0"
          helperText="0.0에서 1.0 사이의 값"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
};
