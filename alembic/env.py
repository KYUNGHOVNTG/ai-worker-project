"""Alembic Environment Configuration

This module configures Alembic to work with SQLAlchemy 2.0 async engine.
It loads database configuration from .env file and supports both online and offline migrations.
"""

import asyncio
import os
from logging.config import fileConfig

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# Load environment variables from .env file
load_dotenv()

# This is the Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import all models here to ensure they are registered with SQLAlchemy
# This is critical for autogenerate to work properly
from server.app.core.database import Base  # noqa: E402

# Import all domain models to register them with Base.metadata
from server.app.domain.sample.models import SampleDataModel  # noqa: F401

# Add more domain model imports here as you create new domains:
# from server.app.domain.auth.models import User

# Set target metadata for autogenerate support
target_metadata = Base.metadata

# Override sqlalchemy.url from environment variable
database_url = os.getenv("DATABASE_URL")
if database_url:
    # Ensure we're using asyncpg driver for PostgreSQL
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    config.set_main_option("sqlalchemy.url", database_url)
else:
    # SQLite 기본 폴백
    config.set_main_option("sqlalchemy.url", "sqlite+aiosqlite:///./dev.db")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine,
    though an Engine is acceptable here as well. By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,  # Detect column type changes
        compare_server_default=True,  # Detect default value changes
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """Execute migrations with the given connection.

    Args:
        connection: SQLAlchemy connection object
    """
    # SQLite는 ALTER TABLE 제약이 있으므로 batch mode 사용
    is_sqlite = connection.dialect.name == "sqlite"

    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,  # Detect column type changes
        compare_server_default=True,  # Detect default value changes
        render_as_batch=is_sqlite,  # SQLite batch mode
        # Include schemas if using multi-schema setup
        # include_schemas=True,
        # version_table_schema=target_metadata.schema,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations in 'online' mode with async engine.

    In this scenario we need to create an Engine and associate a connection with the context.
    This is the recommended approach for SQLAlchemy 2.0 async applications.
    """
    # Get configuration for async engine
    configuration = config.get_section(config.config_ini_section, {})

    # Create async engine
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # Don't use connection pooling for migrations
    )

    async with connectable.connect() as connection:
        # Run migrations synchronously within async context
        await connection.run_sync(do_run_migrations)

    # Dispose engine
    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    Creates an async engine and runs migrations asynchronously.
    This is the standard mode for production deployments.
    """
    asyncio.run(run_async_migrations())


# Determine which mode to run
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
