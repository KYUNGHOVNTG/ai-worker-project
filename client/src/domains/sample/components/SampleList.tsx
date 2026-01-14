/**
 * SampleList Component (Skeleton)
 *
 * Sample 아이템 목록 컴포넌트
 *
 * @example
 * <SampleList />
 */

import React, { useEffect } from 'react';
import { useSampleStore } from '../store';
import { Card, CardBody } from '@/core/ui';

export const SampleList: React.FC = () => {
  const { items, loading, error, fetchItems: _fetchItems } = useSampleStore();

  useEffect(() => {
    // TODO: 컴포넌트 마운트 시 데이터 로드
    // fetchItems();
  }, []);

  // TODO: 로딩 스피너 추가
  // TODO: 에러 메시지 표시
  // TODO: 빈 상태 처리
  // TODO: Framer Motion 애니메이션

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="sample-list">
      <h2>Sample Items</h2>

      <div className="sample-list-grid">
        {items.map((item) => (
          <Card key={item.id}>
            <CardBody>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </CardBody>
          </Card>
        ))}

        {items.length === 0 && (
          <div>No items found</div>
        )}
      </div>
    </div>
  );
};
