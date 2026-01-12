/**
 * SampleForm Component (Skeleton)
 *
 * Sample 아이템 생성/수정 폼
 *
 * @example
 * <SampleForm onSubmit={handleSubmit} />
 */

import React, { useState } from 'react';
import { Input, Button } from '@/core/ui';
import type { SampleFormData } from '../types';

interface SampleFormProps {
  initialData?: SampleFormData;
  onSubmit: (data: SampleFormData) => void;
  onCancel?: () => void;
}

export const SampleForm: React.FC<SampleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<SampleFormData>(
    initialData || {
      title: '',
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 폼 유효성 검사
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="sample-form">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        placeholder="Enter title"
        required
      />

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Enter description"
        required
      />

      <div className="form-actions">
        <Button type="submit" variant="primary">
          Submit
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
