-- 테이블이 없으면 생성: 긱 워커 퇴근 및 그룹사 수익 정산 원장
CREATE TABLE IF NOT EXISTS gig_revenue_ledger (
    tx_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    store_id TEXT NOT NULL,
    gross_pay INTEGER NOT NULL,
    net_deposit INTEGER NOT NULL,

    -- 1. 신한은행 (CASA 유입 + PG 수수료 절감)
    bank_casa_inflow INTEGER NOT NULL,
    bank_cac_saved INTEGER NOT NULL,
    bank_pg_fee_saved INTEGER NOT NULL DEFAULT 0,

    -- 2. 신한카드 (ACS 신용 데이터 가치)
    card_credit_score_up INTEGER NOT NULL,
    card_loan_limit_up INTEGER NOT NULL,
    card_acs_data_value REAL NOT NULL DEFAULT 0,

    -- 3. 신한투자증권 (끝전 스윕 + 에스크로 RP)
    invest_sweep_amount INTEGER NOT NULL,
    invest_rp_profit REAL NOT NULL,
    invest_aum_increase INTEGER NOT NULL DEFAULT 0,

    -- 4. 신한라이프 (온디맨드 보험료 직납)
    life_premium_collected INTEGER NOT NULL,

    -- 5. 신한DS (BaaS API 게이트웨이 수수료)
    ds_baas_fee INTEGER NOT NULL,
    ds_api_call_count INTEGER NOT NULL DEFAULT 4,

    invest_status TEXT DEFAULT 'COMPLETED',
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_ledger_user    ON gig_revenue_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_created ON gig_revenue_ledger(created_at);

-- 멱등성 보장
CREATE TABLE IF NOT EXISTS idempotency_keys (
    idempotency_key TEXT PRIMARY KEY,
    response_body TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Outbox Pattern (재처리)
CREATE TABLE IF NOT EXISTS outbox_events (
    event_id TEXT PRIMARY KEY,
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- AI 에이전트 세션
CREATE TABLE IF NOT EXISTS ai_agent_sessions (
    session_id TEXT PRIMARY KEY,
    worker_id TEXT NOT NULL,
    agent_type TEXT NOT NULL,
    input_payload TEXT NOT NULL,
    output_payload TEXT NOT NULL,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    model_used TEXT DEFAULT 'gpt-4o-mini',
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_agent_worker ON ai_agent_sessions(worker_id);
CREATE INDEX IF NOT EXISTS idx_agent_type   ON ai_agent_sessions(agent_type);

-- 1. 유저 테이블 (워커 및 점주)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL, -- 'worker' or 'employer'
  name TEXT NOT NULL,
  trust_score INTEGER DEFAULT 1000, -- D-GCS 신용점수
  current_lat REAL, -- 실시간 위도 (워커 위치 트래킹용)
  current_lng REAL  -- 실시간 경도
);

-- 2. 긱(알바) 공고 테이블 (지도 마커용)
CREATE TABLE IF NOT EXISTS gigs (
  id TEXT PRIMARY KEY,
  employer_id TEXT,
  title TEXT NOT NULL,
  hourly_wage INTEGER NOT NULL,
  is_surge BOOLEAN DEFAULT 0, -- 할증(다이내믹 프라이싱) 여부
  lat REAL NOT NULL, -- 매장 위도
  lng REAL NOT NULL, -- 매장 경도
  status TEXT DEFAULT 'OPEN' -- OPEN, MATCHED, COMPLETED
);

-- 3. S-BRIDGE 정산 원장 테이블
CREATE TABLE IF NOT EXISTS transactions (
  tx_id TEXT PRIMARY KEY,
  gig_id TEXT,
  worker_id TEXT,
  total_amount INTEGER,
  bank_status TEXT,   -- 신한은행 정산결과
  invest_status TEXT, -- 신한투자증권 스윕결과
  card_status TEXT,   -- 신한카드 한도증액결과
  life_status TEXT,   -- 신한라이프 보험결과
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
