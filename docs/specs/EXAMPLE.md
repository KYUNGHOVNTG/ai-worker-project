# specs/ 폴더 예시

> 이 폴더에는 **메뉴별 산출물** (요구사항, DDL, 레거시 참조 등)을 저장합니다.

## 폴더 구조

```
docs/specs/{feature-name}/
  README.md            # 기본 정보 (메뉴명, 도메인명, 라우터 URL 등)
  ddl.sql              # DDL / 테이블 정의 (선택)
  requirements.md      # 상세 요구사항 (선택)
  legacy/              # 레거시 참조 파일 (선택: SQL, 스크린샷 등)
```

## README.md 템플릿

```markdown
# {메뉴명}

| 항목 | 내용 |
|------|------|
| 메뉴명 | {메뉴명} |
| 도메인명 | {domain-name} |
| 프론트 경로 | /app/{path} |
| API 경로 | /api/v1/{path} |
| DB 테이블 | {테이블명} |
```
