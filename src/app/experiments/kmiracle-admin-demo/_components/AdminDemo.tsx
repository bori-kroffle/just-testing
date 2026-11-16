"use client";

import {
  Avatar,
  Badge,
  Button,
  Icon,
  Stage,
  Toast,
  Window,
  type Act,
} from "@/stageshow/kit";
import "./admin.css";

type View = "list" | "detail" | "contract" | "fee";
type StepId = "apply" | "consult" | "train" | "cert" | "hainan";

type Scene = {
  view: View;
  panel: boolean;
  step: StepId;
  toast: boolean;
};

const STEPS: { id: StepId; label: string }[] = [
  { id: "apply", label: "지원" },
  { id: "consult", label: "상담" },
  { id: "train", label: "교육" },
  { id: "cert", label: "인증" },
  { id: "hainan", label: "하이난 연수" },
];

const APPLICANTS = [
  {
    id: "gildong",
    name: "홍길동(예시)",
    role: "파트너 컨설턴트",
    step: "consult" as StepId,
    date: "2026.10.12",
  },
  {
    id: "a",
    name: "예시 지원자 A",
    role: "강사",
    step: "apply" as StepId,
    date: "2026.10.18",
  },
  {
    id: "b",
    name: "예시 지원자 B",
    role: "파트너 컨설턴트",
    step: "train" as StepId,
    date: "2026.09.30",
  },
  {
    id: "c",
    name: "예시 지원자 C",
    role: "강사",
    step: "cert" as StepId,
    date: "2026.09.14",
  },
  {
    id: "d",
    name: "예시 지원자 D",
    role: "파트너 컨설턴트",
    step: "hainan" as StepId,
    date: "2026.08.22",
  },
];

const CONTRACTS = [
  {
    company: "예시 기업 A",
    status: "진행 중",
    amount: "12,000,000원 (예시)",
    person: "홍길동(예시)",
    term: "2026.11–2027.01 (예시)",
    featured: true,
  },
  {
    company: "예시 기업 B",
    status: "검토 중",
    amount: "8,000,000원 (예시)",
    person: "예시 지원자 D",
    term: "2026.12–2027.02 (예시)",
    featured: false,
  },
];

const FEES = [
  {
    person: "홍길동(예시)",
    company: "예시 기업 A",
    rate: "10% (예시)",
    amount: "1,200,000원 (예시)",
  },
  {
    person: "예시 지원자 D",
    company: "예시 기업 B",
    rate: "10% (예시)",
    amount: "800,000원 (예시)",
  },
];

const initial: Scene = {
  view: "list",
  panel: false,
  step: "consult",
  toast: false,
};

const POSTER: Scene = {
  view: "list",
  panel: false,
  step: "consult",
  toast: false,
};

const REST = { wide: { x: 960, y: 450 }, compact: { x: 300, y: 470 } };

const stepLabel = (id: StepId) => STEPS.find((item) => item.id === id)!.label;

const stepTone = (
  id: StepId,
): "neutral" | "accent" | "success" | "warning" => {
  if (id === "apply") return "neutral";
  if (id === "consult") return "accent";
  if (id === "train") return "warning";
  return "success";
};

const script = async (act: Act<Scene>) => {
  await act.wait(2400);

  await act.move("row-gildong");
  await act.wait(280);
  await act.click();
  await act.set({ view: "detail" });
  await act.wait(2400);

  await act.move("btn-pipeline");
  await act.wait(220);
  await act.click();
  await act.set({ panel: true });
  await act.wait(700);

  await act.move("step-train");
  await act.wait(220);
  await act.click();
  await act.set({ step: "train", toast: true });
  await act.wait(2400);

  await act.move("nav-contract");
  await act.wait(220);
  await act.click();
  await act.set({ view: "contract", panel: false, toast: false });
  await act.wait(2400);

  await act.move("nav-fee");
  await act.wait(220);
  await act.click();
  await act.set({ view: "fee" });
  await act.wait(2800);
};

export default function AdminDemo() {
  return (
    <Stage
      width={1080}
      height={520}
      compact={{ below: 720, width: 358, height: 520 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      cursor={{ at: REST, ripple: true }}
      accent="oklch(0.26 0.085 268)"
      greys="cool"
      ground="orbs"
      fill
      className="kad"
    >
      {(scene) => (
        <Window
          title="K-미라클 관리자"
          sidebar={<Sidebar view={scene.view} />}
          sidebarWidth={188}
          toolbar={
            <span className="kad-toolbar-note" data-target="rest">
              예시 화면
            </span>
          }
          className="kad-window"
          body={{ "data-demo-view": scene.view }}
        >
          <div className="kad-shell" data-demo-view={scene.view}>
            {scene.view === "list" && <ListView />}
            {scene.view === "detail" && <DetailView scene={scene} />}
            {scene.view === "contract" && <ContractView />}
            {scene.view === "fee" && <FeeView />}
            <Toast show={scene.toast}>단계가 교육으로 변경되었습니다. (예시)</Toast>
          </div>
        </Window>
      )}
    </Stage>
  );
}

function Sidebar({ view }: { view: View }) {
  const applicants = view === "list" || view === "detail";
  return (
    <div className="kad-side">
      <div className="kad-brand">
        <span className="kad-brand-mark" aria-hidden />
        <span>K-미라클</span>
      </div>
      <nav className="kad-nav">
        <NavItem
          target="nav-applicants"
          icon="user"
          label="지원자"
          active={applicants}
        />
        <NavItem
          target="nav-contract"
          icon="file"
          label="기업 계약"
          active={view === "contract"}
        />
        <NavItem
          target="nav-fee"
          icon="card"
          label="수수료"
          active={view === "fee"}
        />
      </nav>
      <p className="kad-side-foot">데이터는 모두 예시입니다.</p>
    </div>
  );
}

function NavItem({
  target,
  icon,
  label,
  active,
}: {
  target: string;
  icon: "user" | "file" | "card";
  label: string;
  active: boolean;
}) {
  return (
    <div
      className="kad-nav-item"
      data-target={target}
      data-cursor="hand"
      data-active={active || undefined}
    >
      <Icon name={icon} size={15} />
      <span>{label}</span>
    </div>
  );
}

function ListView() {
  return (
    <section className="kad-view">
      <header className="kad-head">
        <div>
          <h2>지원자</h2>
          <p>파트너 컨설턴트 · 강사 · 5명 (예시)</p>
        </div>
      </header>
      <div className="kad-table-head">
        <span>이름</span>
        <span>역할</span>
        <span>단계</span>
        <span>지원일</span>
      </div>
      <div className="kad-list">
        {APPLICANTS.map((row) => (
          <div
            key={row.id}
            className="kad-row"
            data-target={row.id === "gildong" ? "row-gildong" : undefined}
            data-cursor={row.id === "gildong" ? "hand" : undefined}
            data-featured={row.id === "gildong" || undefined}
          >
            <span className="kad-who">
              <Avatar name={row.name} size={26} tone={row.id === "gildong" ? "accent" : "person"} />
              <strong>{row.name}</strong>
            </span>
            <span className="kad-muted">{row.role}</span>
            <Badge tone={stepTone(row.step)} dot>
              {stepLabel(row.step)}
            </Badge>
            <span className="kad-muted">{row.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DetailView({ scene }: { scene: Scene }) {
  const person = APPLICANTS[0];
  return (
    <section className="kad-view">
      <header className="kad-head">
        <div>
          <p className="kad-crumb">지원자</p>
          <h2>{person.name}</h2>
          <p>{person.role}</p>
        </div>
        <Button
          variant="primary"
          data-target="btn-pipeline"
          data-cursor="hand"
          className="kad-danger-btn"
        >
          단계 변경
        </Button>
      </header>
      <div className="kad-detail">
        <article className="kad-card kad-profile">
          <Avatar name={person.name} size={44} tone="accent" />
          <div>
            <strong>{person.name}</strong>
            <p>{person.role}</p>
          </div>
        </article>
        <dl className="kad-fields">
          <div>
            <dt>현재 단계</dt>
            <dd>
              <Badge tone={stepTone(scene.step)} dot>
                {stepLabel(scene.step)}
              </Badge>
            </dd>
          </div>
          <div>
            <dt>지원일</dt>
            <dd>{person.date} (예시)</dd>
          </div>
          <div>
            <dt>이메일</dt>
            <dd>gildong@example.test</dd>
          </div>
          <div>
            <dt>메모</dt>
            <dd>상담 일정 조율 중. (예시)</dd>
          </div>
        </dl>
      </div>
      <div className="kad-panel" data-show={scene.panel || undefined}>
        <div className="kad-panel-card">
          <h3>단계 변경</h3>
          <p>지원 · 상담 · 교육 · 인증 · 하이난 연수</p>
          <div className="kad-steps">
            {STEPS.map((item, index) => {
              const currentIndex = STEPS.findIndex((s) => s.id === scene.step);
              const done = index < currentIndex;
              const current = item.id === scene.step;
              return (
                <div
                  key={item.id}
                  className="kad-step"
                  data-target={item.id === "train" ? "step-train" : undefined}
                  data-cursor={item.id === "train" ? "hand" : undefined}
                  data-done={done || undefined}
                  data-current={current || undefined}
                >
                  <span className="kad-step-dot">{index + 1}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContractView() {
  return (
    <section className="kad-view">
      <header className="kad-head">
        <div>
          <h2>기업 계약</h2>
          <p>진행 중 계약 2건 (예시)</p>
        </div>
      </header>
      <div className="kad-contracts">
        {CONTRACTS.map((row) => (
          <article
            key={row.company}
            className="kad-card kad-contract"
            data-featured={row.featured || undefined}
          >
            <div className="kad-contract-top">
              <strong>{row.company}</strong>
              <Badge tone={row.featured ? "accent" : "neutral"} dot>
                {row.status}
              </Badge>
            </div>
            <p className="kad-amount">{row.amount}</p>
            <dl className="kad-meta">
              <div>
                <dt>담당</dt>
                <dd>{row.person}</dd>
              </div>
              <div>
                <dt>기간</dt>
                <dd>{row.term}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeeView() {
  return (
    <section className="kad-view">
      <header className="kad-head">
        <div>
          <h2>수수료</h2>
          <p>2026년 11월 정산 (예시)</p>
        </div>
        <p className="kad-total">
          합계 <strong>2,000,000원 (예시)</strong>
        </p>
      </header>
      <div className="kad-table-head kad-fee-head">
        <span>담당</span>
        <span>계약</span>
        <span>비율</span>
        <span>수수료</span>
      </div>
      <div className="kad-list">
        {FEES.map((row) => (
          <div key={row.person} className="kad-row kad-fee-row">
            <span className="kad-who">
              <Avatar name={row.person} size={26} />
              <strong>{row.person}</strong>
            </span>
            <span className="kad-muted">{row.company}</span>
            <span className="kad-muted">{row.rate}</span>
            <span className="kad-fee">{row.amount}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
