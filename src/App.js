import React, { useState, useEffect } from "react";
import "./App.css";

/* ───────────────────────────────────────────
   DATA: Dimensions, Questions & Scoring
   ─────────────────────────────────────────── */

const DIM_COLORS = {
  OF: "#38E2CD",  // teal
  DI: "#8B5CF6",  // purple
  TA: "#E24080",  // magenta
  OR: "#F5C842",  // gold
  SC: "#5B9CF6",  // blue
};

const DIMENSIONS = [
  {
    id: "OF",
    name: "Operational Foundation",
    subtitle: "Process maturity, maintenance practices & operational discipline",
    icon: "/OF.svg",
    questions: [
      {
        id: "Q1.1",
        text: "How does your facility handle equipment maintenance?",
        options: [
          { label: "Reactive only — we fix machines when they break", points: 0 },
          { label: "Basic preventive schedules exist but are inconsistently followed", points: 1 },
          { label: "Preventive maintenance program in place and consistently executed", points: 2 },
          { label: "Mature PM program with condition-based monitoring and data-driven scheduling", points: 3 },
        ],
      },
      {
        id: "Q1.2",
        text: "How do you track production performance (e.g., OEE, throughput, yield)?",
        options: [
          { label: "We don't track systematically — performance is assessed anecdotally", points: 0 },
          { label: "Manual tracking via spreadsheets or whiteboards, reviewed periodically", points: 1 },
          { label: "Metrics tracked in a system (MES or equivalent), reviewed regularly", points: 2 },
          { label: "Real-time dashboards with automated data collection, acted upon daily", points: 3 },
        ],
      },
      {
        id: "Q1.3",
        text: "How standardized are your shop floor processes?",
        options: [
          { label: "Processes depend on individual operators — high variability, tribal knowledge", points: 0 },
          { label: "Some work instructions exist but aren't consistently followed or updated", points: 1 },
          { label: "Standardized work instructions in place for most operations, regularly audited", points: 2 },
          { label: "Fully documented, version-controlled processes integrated with quality system (e.g., AS9100)", points: 3 },
        ],
      },
      {
        id: "Q1.4",
        text: "What is the state of your CMMS?",
        options: [
          { label: "No CMMS — maintenance tracked on paper, spreadsheets, or not at all", points: 0 },
          { label: "CMMS exists but used primarily for work orders, not analytics", points: 1 },
          { label: "CMMS actively used for scheduling, parts inventory, and maintenance history", points: 2 },
          { label: "CMMS integrated with production scheduling and MES, data used for continuous improvement", points: 3 },
        ],
      },
    ],
  },
  {
    id: "DI",
    name: "Data Infrastructure",
    subtitle: "Sensor coverage, data connectivity, storage & contextualization",
    icon: "/DI.svg",
    questions: [
      {
        id: "Q2.1",
        text: "What is your current sensor coverage on critical production assets?",
        options: [
          { label: "No sensors beyond basic machine controls", points: 0 },
          { label: "Sensors on 1–2 machines or limited to temperature/pressure basics", points: 1 },
          { label: "Sensors on most critical assets (vibration, temperature, power)", points: 2 },
          { label: "Comprehensive coverage including advanced measurements with edge processing", points: 3 },
        ],
      },
      {
        id: "Q2.2",
        text: "How is your machine data stored and accessed?",
        options: [
          { label: "Paper logs, spreadsheets, or not stored at all", points: 0 },
          { label: "Basic data logging on individual machines — data is siloed", points: 1 },
          { label: "Centralized historian capturing time-series data from multiple machines", points: 2 },
          { label: "Unified data pipeline with cloud or on-prem storage, accessible for analysis", points: 3 },
        ],
      },
      {
        id: "Q2.3",
        text: "Is your machine data contextualized with operational information?",
        options: [
          { label: "Machine data has no link to job, material, operator, or tooling information", points: 0 },
          { label: "Some manual linkage possible (e.g., correlate by timestamp with effort)", points: 1 },
          { label: "Partial integration — some data sources connected (e.g., CMMS to historian)", points: 2 },
          { label: "Automatically enriched with job type, material, tool ID, and operator context", points: 3 },
        ],
      },
      {
        id: "Q2.4",
        text: "How would you describe your data quality and governance?",
        options: [
          { label: "Unknown — we haven't assessed data quality", points: 0 },
          { label: "Known issues with gaps and inconsistencies — no formal process to address them", points: 1 },
          { label: "Data quality monitored periodically, some cleaning processes in place", points: 2 },
          { label: "Formal governance program — quality monitored continuously, lineage tracked", points: 3 },
        ],
      },
    ],
  },
  {
    id: "TA",
    name: "Technology Architecture",
    subtitle: "Edge-to-cloud readiness, integration maturity & platform capability",
    icon: "/TA.svg",
    questions: [
      {
        id: "Q3.1",
        text: "What connectivity exists between your shop floor and enterprise/cloud systems?",
        options: [
          { label: "Air-gapped — machines are not connected to any network", points: 0 },
          { label: "Basic network connectivity but no structured data flow between OT and IT", points: 1 },
          { label: "Some integration via OPC-UA, MQTT, or similar protocols to a gateway layer", points: 2 },
          { label: "Fully architected OT/IT convergence with edge gateways and structured data pipeline", points: 3 },
        ],
      },
      {
        id: "Q3.2",
        text: "Do you have edge computing capability at or near the shop floor?",
        options: [
          { label: "No — all computing on individual machine controllers or desktop PCs", points: 0 },
          { label: "Basic gateway or industrial PC collecting data, no processing at the edge", points: 1 },
          { label: "Edge gateway performing data aggregation, protocol conversion, or local buffering", points: 2 },
          { label: "Dedicated edge platform running local analytics or inference before cloud transmission", points: 3 },
        ],
      },
      {
        id: "Q3.3",
        text: "What cloud or analytics platform infrastructure do you have?",
        options: [
          { label: "None for operational or manufacturing data", points: 0 },
          { label: "Basic cloud usage (file storage, email) but not connected to operational data", points: 1 },
          { label: "Cloud platform with some operational data (data lake, dashboards)", points: 2 },
          { label: "ML-ready infrastructure — data lake, model training compute, deployment pipeline", points: 3 },
        ],
      },
      {
        id: "Q3.4",
        text: "How integrated are your key operational systems (CMMS, MES, ERP, quality)?",
        options: [
          { label: "Completely siloed — no integration", points: 0 },
          { label: "Manual data transfer between systems (export/import, re-keying)", points: 1 },
          { label: "Some automated integration between 2–3 systems", points: 2 },
          { label: "Fully integrated stack with automated data flow across all systems", points: 3 },
        ],
      },
    ],
  },
  {
    id: "OR",
    name: "Organizational Readiness",
    subtitle: "Skills, culture, trust in data-driven decisions & change capacity",
    icon: "/OR.svg",
    questions: [
      {
        id: "Q4.1",
        text: "What data/analytics skills exist in your operations or engineering teams?",
        options: [
          { label: "No data analytics skills — teams rely entirely on experience and intuition", points: 0 },
          { label: "A few individuals comfortable with Excel-based analysis or basic reporting", points: 1 },
          { label: "Dedicated analysts or engineers who work with BI tools, SQL, or statistics", points: 2 },
          { label: "Internal ML/data science capability or established external data science partnership", points: 3 },
        ],
      },
      {
        id: "Q4.2",
        text: "How does your organization respond to data-driven recommendations?",
        options: [
          { label: "Decisions made by experience and gut feel — data is rarely consulted", points: 0 },
          { label: "Data is reviewed but often overridden by \"how we've always done it\"", points: 1 },
          { label: "Data-driven recommendations regularly considered and sometimes acted upon", points: 2 },
          { label: "Culture of evidence-based decision-making — operators and managers trust data", points: 3 },
        ],
      },
      {
        id: "Q4.3",
        text: "How would you rate your organization's capacity for technology-driven change?",
        options: [
          { label: "High resistance — past technology initiatives have largely failed or stalled", points: 0 },
          { label: "Mixed — some successful initiatives but adoption is inconsistent", points: 1 },
          { label: "Generally positive — change management processes exist and recent initiatives succeeded", points: 2 },
          { label: "Strong track record — organization embraces continuous improvement with executive backing", points: 3 },
        ],
      },
      {
        id: "Q4.4",
        text: "Who would own an AI/ML initiative in your organization?",
        options: [
          { label: "No clear owner — unclear who would lead or sponsor this type of initiative", points: 0 },
          { label: "IT would likely own it, with limited operational involvement", points: 1 },
          { label: "Cross-functional ownership possible but no formal structure", points: 2 },
          { label: "Clear executive sponsor with cross-functional team structure ready or in place", points: 3 },
        ],
      },
    ],
  },
  {
    id: "SC",
    name: "Strategic Clarity",
    subtitle: "Use case definition, success metrics, executive alignment & investment readiness",
    icon: "/SC.svg",
    questions: [
      {
        id: "Q5.1",
        text: "Have you identified specific operational problems you want AI/ML to solve?",
        options: [
          { label: "No — interest is general (\"we should do something with AI\")", points: 0 },
          { label: "Vague ideas (\"predictive maintenance\") without specific scoping", points: 1 },
          { label: "One or two specific use cases identified with operational context", points: 2 },
          { label: "Prioritized use case roadmap with business justification, mapped to specific assets", points: 3 },
        ],
      },
      {
        id: "Q5.2",
        text: "How would you measure success for an AI/ML initiative?",
        options: [
          { label: "Haven't thought about it yet", points: 0 },
          { label: "General expectations (\"reduce downtime\") without specific targets", points: 1 },
          { label: "Specific KPIs identified (e.g., \"reduce unplanned downtime by 15%\")", points: 2 },
          { label: "KPIs defined with baseline measurements in place, tied to financial impact", points: 3 },
        ],
      },
      {
        id: "Q5.3",
        text: "Is there executive sponsorship for investing in AI/ML for operations?",
        options: [
          { label: "No executive awareness or interest", points: 0 },
          { label: "Awareness exists but no commitment — \"let's look into it someday\"", points: 1 },
          { label: "Active executive interest with willingness to fund a pilot", points: 2 },
          { label: "Executive champion with allocated budget, defined timeline, and mandate", points: 3 },
        ],
      },
      {
        id: "Q5.4",
        text: "How do you view the relationship between AI investment and business outcomes?",
        options: [
          { label: "AI is a technology experiment — outcomes are unclear", points: 0 },
          { label: "AI should eventually reduce costs, but we haven't quantified returns", points: 1 },
          { label: "General business case framed around downtime, quality, or throughput gains", points: 2 },
          { label: "AI investment tied to strategic objective with financial modeling and payback period", points: 3 },
        ],
      },
    ],
  },
];

const MATURITY_LEVELS = [
  {
    level: 0,
    label: "Ad Hoc",
    color: "#E24080",
    description: "Reactive, break-fix operations. No standardized data collection or process discipline to build upon.",
  },
  {
    level: 1,
    label: "Descriptive",
    color: "#F5C842",
    description: "You can see what happened. Basic reporting and process documentation provide historical visibility.",
  },
  {
    level: 2,
    label: "Diagnostic",
    color: "#5B9CF6",
    description: "You can analyze why it happened. Connected, contextualized data enables root cause analysis.",
  },
  {
    level: 3,
    label: "Predictive",
    color: "#8B5CF6",
    description: "You can anticipate what will happen. ML models running on rich, contextualized, streaming data.",
  },
  {
    level: 4,
    label: "Prescriptive",
    color: "#38E2CD",
    description: "The system recommends what to do. Closed-loop intelligence drives autonomous decisions.",
  },
];

/* ───────────────────────────────────────────
   LOGIC: Scoring & Gating
   ─────────────────────────────────────────── */

function normalize(raw) {
  return Math.round((raw / 12) * 10);
}

function computeMaturity(scores) {
  const { OF, DI, TA, OR, SC } = scores;
  if (OF >= 7 && DI >= 8 && TA >= 8 && OR >= 7 && SC >= 7) return 4;
  if (OF >= 6 && DI >= 7 && TA >= 6 && OR >= 5) return 3;
  if (OF >= 5 && DI >= 5 && (OR >= 4 || SC >= 4)) return 2;
  if (OF >= 4) return 1;
  return 0;
}

function getBlockingDimensions(scores, currentLevel) {
  const { OF, DI, TA, OR, SC } = scores;
  const nextLevel = currentLevel + 1;
  const blocks = [];

  if (nextLevel === 1) {
    if (OF < 4) blocks.push({ dim: "Operational Foundation", current: OF, needed: 4 });
  } else if (nextLevel === 2) {
    if (OF < 5) blocks.push({ dim: "Operational Foundation", current: OF, needed: 5 });
    if (DI < 5) blocks.push({ dim: "Data Infrastructure", current: DI, needed: 5 });
    if (OR < 4 && SC < 4) blocks.push({ dim: "Organizational Readiness or Strategic Clarity", current: Math.max(OR, SC), needed: 4 });
  } else if (nextLevel === 3) {
    if (OF < 6) blocks.push({ dim: "Operational Foundation", current: OF, needed: 6 });
    if (DI < 7) blocks.push({ dim: "Data Infrastructure", current: DI, needed: 7 });
    if (TA < 6) blocks.push({ dim: "Technology Architecture", current: TA, needed: 6 });
    if (OR < 5) blocks.push({ dim: "Organizational Readiness", current: OR, needed: 5 });
  } else if (nextLevel === 4) {
    if (OF < 7) blocks.push({ dim: "Operational Foundation", current: OF, needed: 7 });
    if (DI < 8) blocks.push({ dim: "Data Infrastructure", current: DI, needed: 8 });
    if (TA < 8) blocks.push({ dim: "Technology Architecture", current: TA, needed: 8 });
    if (OR < 7) blocks.push({ dim: "Organizational Readiness", current: OR, needed: 7 });
    if (SC < 7) blocks.push({ dim: "Strategic Clarity", current: SC, needed: 7 });
  }
  return blocks;
}

function getRecommendations(scores) {
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const recs = [];
  const dimNames = {
    OF: "Operational Foundation",
    DI: "Data Infrastructure",
    TA: "Technology Architecture",
    OR: "Organizational Readiness",
    SC: "Strategic Clarity",
  };
  const recMap = {
    OF: {
      low: "Establish standardized maintenance and production tracking processes before investing in AI. A CMMS and basic OEE tracking are prerequisites.",
      high: "Your operational foundation is strong. Ensure CMMS/MES integration is feeding contextualized data to your analytics pipeline.",
    },
    DI: {
      low: "Close your data infrastructure gap first. Assess sensor coverage on critical machines, establish connectivity protocols (MQTT/OPC-UA), and ensure your historian captures operational context — not just time-series.",
      high: "Your data infrastructure is well-positioned. Focus on data contextualization — linking sensor data to job, material, and tooling context for model training.",
    },
    TA: {
      low: "Your technology architecture needs attention before ML initiatives can succeed. Start with OT/IT connectivity and edge computing capability.",
      high: "Strong architecture foundation. Evaluate ML-ready cloud infrastructure and deployment pipeline readiness.",
    },
    OR: {
      low: "Invest in organizational readiness — build data literacy, identify an executive sponsor, and address cultural resistance to data-driven decision-making.",
      high: "Your organization shows readiness for AI adoption. Formalize the cross-functional team structure and define clear ownership.",
    },
    SC: {
      low: "Define specific, measurable use cases tied to business outcomes before selecting any technology. \"We should do AI\" is not a strategy.",
      high: "Sharpen your business case with baseline measurements and financial modeling to secure sustained investment.",
    },
  };

  for (let i = 0; i < Math.min(3, sorted.length); i++) {
    const [key, val] = sorted[i];
    const rec = val <= 5 ? recMap[key].low : recMap[key].high;
    recs.push({ dimension: dimNames[key], score: val, recommendation: rec });
  }
  return recs;
}

/* ───────────────────────────────────────────
   COMPONENTS
   ─────────────────────────────────────────── */

function RadarChart({ scores }) {
  const size = 440;
  const dims = ["OF", "DI", "TA", "OR", "SC"];
  const labels = ["Operations", "Data", "Technology", "Organization", "Strategy"];
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.28;
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;

  function polarToCart(angle, radius) {
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  const gridLevels = [2, 4, 6, 8, 10];
  const dataPoints = dims.map((d, i) => {
    const angle = startAngle + i * angleStep;
    const val = scores[d] / 10;
    return polarToCart(angle, r * val);
  });
  const pathD = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar-chart">
      {/* Grid */}
      {gridLevels.map((lv) => {
        const gr = dims.map((_, i) => polarToCart(startAngle + i * angleStep, r * (lv / 10)));
        const gPath = gr.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return <path key={lv} d={gPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
      })}
      {/* Spokes */}
      {dims.map((_, i) => {
        const end = polarToCart(startAngle + i * angleStep, r);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
      })}
      {/* Data shape */}
      <path d={pathD} fill="rgba(56,226,205,0.12)" stroke="rgba(56,226,205,0.6)" strokeWidth={2} />
      {/* Data points and labels */}
      {dims.map((d, i) => {
        const angle = startAngle + i * angleStep;
        const lp = polarToCart(angle, r + 44);
        const anchor = Math.abs(lp.x - cx) < 5 ? "middle" : lp.x > cx ? "start" : "end";
        const color = DIM_COLORS[d];
        return (
          <g key={d}>
            <circle cx={dataPoints[i].x} cy={dataPoints[i].y} r={5} fill={color} stroke="#0D0A1A" strokeWidth={2} />
            <text x={lp.x} y={lp.y - 2} textAnchor={anchor} dominantBaseline="middle" className="radar-label" fill={color}>
              {labels[i]}
            </text>
            <text x={lp.x} y={lp.y + 16} textAnchor={anchor} dominantBaseline="middle" className="radar-score" fill={color}>
              {scores[d]}/10
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MaturityGauge({ level }) {
  const ml = MATURITY_LEVELS[level];
  return (
    <div className="maturity-gauge">
      <div className="gauge-bars">
        {MATURITY_LEVELS.map((m) => (
          <div
            key={m.level}
            className="gauge-bar"
            style={{
              background: m.level <= level ? m.color : "rgba(255,255,255,0.08)",
              opacity: m.level <= level ? 1 : 0.4,
              boxShadow: m.level <= level ? `0 0 10px ${m.color}40` : "none",
            }}
          />
        ))}
      </div>
      <div className="gauge-labels">
        {MATURITY_LEVELS.map((m) => (
          <div
            key={m.level}
            className={`gauge-label ${m.level === level ? "active" : ""}`}
            style={{ color: m.level === level ? m.color : undefined }}
          >
            {m.label}
          </div>
        ))}
      </div>
      <div className="maturity-badge" style={{ background: `${ml.color}15`, borderColor: `${ml.color}40` }}>
        <div className="maturity-badge-label" style={{ color: ml.color }}>
          Your Maturity Level
        </div>
        <div className="maturity-badge-value" style={{ color: ml.color }}>
          {ml.label}
        </div>
      </div>
      <p className="maturity-description">{ml.description}</p>
    </div>
  );
}

function LandingScreen({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-badge">ClarityPoint Solutions</div>
      <h1 className="landing-title">
        Industrial Machine Intelligence
        <br />
        Readiness Assessment
      </h1>
      <p className="landing-subtitle">
        Evaluate your facility's readiness across five critical dimensions and discover exactly where you stand on the path
        from reactive operations to prescriptive intelligence.
      </p>
      <div className="dimension-pills">
        {DIMENSIONS.map((d) => (
          <div key={d.id} className="dimension-pill">
            <div className="dimension-pill-icon"><img src={d.icon} alt={d.name} style={{height: 40, width: 'auto'}} /></div>
            <div className="dimension-pill-name">{d.name}</div>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={onStart}>
        Begin Assessment
      </button>
      <p className="landing-meta">20 questions · 5 minutes · Immediate results</p>
    </div>
  );
}

function AssessmentScreen({ dimIndex, answers, onSelect, onNext, onBack, onViewResults }) {
  const currentDim = DIMENSIONS[dimIndex];
  const answeredCount = Object.keys(answers).length;
  const dimComplete = currentDim.questions.every((q) => answers[q.id] !== undefined);
  const allAnswered = DIMENSIONS.every((d) => d.questions.every((q) => answers[q.id] !== undefined));

  return (
    <div className="assessment">
      {/* Progress */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Dimension {dimIndex + 1} of 5</span>
          <span className="progress-count">{answeredCount}/20 answered</span>
        </div>
        <div className="progress-track">
          {DIMENSIONS.map((_, i) => (
            <div
              key={i}
              className={`progress-segment ${i < dimIndex ? "complete" : i === dimIndex ? "current" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Dimension Header */}
      <div className="dim-header">
        <div className="dim-icon"><img src={currentDim.icon} alt={currentDim.name} style={{height: 48, width: 'auto'}} /></div>
        <h2 className="dim-title">{currentDim.name}</h2>
        <p className="dim-subtitle">{currentDim.subtitle}</p>
      </div>

      {/* Questions */}
      {currentDim.questions.map((q, qi) => (
        <div key={q.id} className={`question-card ${answers[q.id] !== undefined ? "answered" : ""}`}>
          <div className="question-number">Question {qi + 1} of 4</div>
          <p className="question-text">{q.text}</p>
          <div className="options-list">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === opt.points;
              return (
                <button
                  key={oi}
                  className={`option-btn ${selected ? "selected" : ""}`}
                  onClick={() => onSelect(q.id, opt.points)}
                >
                  <div className={`option-radio ${selected ? "checked" : ""}`}>
                    {selected && <div className="option-radio-dot" />}
                  </div>
                  <span className="option-label">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Navigation */}
      <div className="nav-buttons">
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
        {dimIndex < 4 ? (
          <button className={`btn-next ${dimComplete ? "" : "disabled"}`} onClick={() => dimComplete && onNext()}>
            Next Dimension →
          </button>
        ) : (
          <button
            className={`btn-results ${allAnswered ? "" : "disabled"}`}
            onClick={() => allAnswered && onViewResults()}
          >
            View Results →
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ scores, onRestart }) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const maturity = computeMaturity(scores);
  const blockers = maturity < 4 ? getBlockingDimensions(scores, maturity) : [];
  const recs = getRecommendations(scores);

  return (
    <div className="results">
      <div className="results-header">
        <div className="results-badge">Assessment Complete</div>
        <h1 className="results-title">Your IMI Readiness Profile</h1>
        <p className="results-total">
          Aggregate Score: <strong>{total}/50</strong>
        </p>
      </div>

      <MaturityGauge level={maturity} />

      {/* Radar Chart */}
      <div className="card radar-card">
        <h3 className="card-title">Dimensional Profile</h3>
        <p className="card-subtitle">Your readiness shape across all five dimensions</p>
        <RadarChart scores={scores} />
      </div>

      {/* Score Breakdown */}
      <div className="card">
        <h3 className="card-title">Score Breakdown</h3>
        {DIMENSIONS.map((d) => {
          const s = scores[d.id];
          const color = DIM_COLORS[d.id];
          return (
            <div key={d.id} className="score-row">
              <div className="score-row-header">
                <span className="score-row-name">
                  <img src={d.icon} alt={d.name} style={{height: 20, width: 'auto', display: 'inline-block', verticalAlign: 'middle', marginRight: 8}} /> {d.name}
                </span>
                <span className="score-row-value" style={{ color }}>
                  {s}/10
                </span>
              </div>
              <div className="score-bar-track">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${s * 10}%`,
                    background: color,
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Blockers */}
      {blockers.length > 0 && (
        <div className="card blockers-card">
          <h3 className="card-title">What's Blocking Your Next Level</h3>
          <p className="card-subtitle">
            To reach <strong style={{ color: "#F5C842" }}>{MATURITY_LEVELS[maturity + 1]?.label}</strong>, these dimensions need improvement:
          </p>
          {blockers.map((b, i) => (
            <div key={i} className="blocker-row">
              <span className="blocker-name">{b.dim}</span>
              <span className="blocker-gap">
                Current: {b.current} → Needed: {b.needed}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="card">
        <h3 className="card-title">Priority Recommendations</h3>
        {recs.map((r, i) => (
          <div key={i} className="rec-row">
            <div className="rec-dimension">
              {r.dimension} — {r.score}/10
            </div>
            <p className="rec-text">{r.recommendation}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-card">
        <h3 className="cta-title">Ready to Close the Gaps?</h3>
        <p className="cta-text">
          Schedule a 30-minute IMI readiness conversation to discuss your results and explore what a tailored roadmap
          looks like for your facility.
        </p>
        <button className="btn-cta">Schedule a Conversation →</button>
        <div className="cta-footer">ClarityPoint Solutions · Machine-Intelligence-Driven Operations Excellence</div>
      </div>

      {/* Restart */}
      <div className="restart-section">
        <button className="btn-restart" onClick={onRestart}>
          Retake Assessment
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   APP
   ─────────────────────────────────────────── */

function App() {
  const [screen, setScreen] = useState("landing");
  const [dimIndex, setDimIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [screen, dimIndex]);

  function handleSelect(qId, points) {
    setAnswers((prev) => ({ ...prev, [qId]: points }));
  }

  function dimScore(dim) {
    let raw = 0;
    dim.questions.forEach((q) => {
      raw += answers[q.id] || 0;
    });
    return normalize(raw);
  }

  function allScores() {
    const s = {};
    DIMENSIONS.forEach((d) => {
      s[d.id] = dimScore(d);
    });
    return s;
  }

  function transition(fn) {
    setFadeIn(false);
    setTimeout(() => {
      fn();
      window.scrollTo(0, 0);
    }, 200);
  }

  return (
    <div className="app-root">
      <div className={`app-container ${fadeIn ? "visible" : "hidden"}`}>
        {screen === "landing" && (
          <LandingScreen onStart={() => transition(() => setScreen("assessment"))} />
        )}

        {screen === "assessment" && (
          <AssessmentScreen
            dimIndex={dimIndex}
            answers={answers}
            onSelect={handleSelect}
            onNext={() => transition(() => setDimIndex(dimIndex + 1))}
            onBack={() =>
              transition(() => (dimIndex === 0 ? setScreen("landing") : setDimIndex(dimIndex - 1)))
            }
            onViewResults={() => transition(() => setScreen("results"))}
          />
        )}

        {screen === "results" && (
          <ResultsScreen
            scores={allScores()}
            onRestart={() => {
              setAnswers({});
              setDimIndex(0);
              transition(() => setScreen("landing"));
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;