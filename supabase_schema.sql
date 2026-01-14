-- Supabase Schema for AI Worker Project
-- 이 스크립트를 Supabase SQL Editor에서 실행하여 초기 테이블을 세팅하세요

-- connection_tests 테이블 생성
CREATE TABLE IF NOT EXISTS connection_tests (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT INTO connection_tests (message) VALUES ('Supabase 연결 성공! 🚀');

-- 테이블 생성 확인 쿼리
SELECT * FROM connection_tests;
