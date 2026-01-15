"""
Base 클래스 모듈

모든 도메인에서 상속받아 사용할 추상 베이스 클래스들을 정의합니다.
"""

from server.app.shared.base.calculator import BaseCalculator
from server.app.shared.base.formatter import BaseFormatter
from server.app.shared.base.repository import BaseRepository
from server.app.shared.base.service import BaseService

# 하위 호환성을 위한 별칭 (deprecated)
BaseProvider = BaseRepository

__all__ = [
    "BaseService",
    "BaseRepository",
    "BaseCalculator",
    "BaseFormatter",
    "BaseProvider",  # deprecated, use BaseRepository instead
]
