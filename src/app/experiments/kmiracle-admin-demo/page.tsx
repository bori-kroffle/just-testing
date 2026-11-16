import Link from "next/link";
import AdminDemo from "./_components/AdminDemo";

export default function KmiracleAdminDemoPage() {
  return (
    <div className="kad-page">
      <main className="kad-page-main">
        <Link href="/" className="kad-page-back">
          ← 실험 목록
        </Link>

        <header className="kad-page-header">
          <p className="kad-page-eyebrow">K-미라클 관리자 (예시)</p>
          <h1 className="kad-page-title">지원부터 수수료까지</h1>
          <p className="kad-page-lead">
            지원자 목록에서 상세로 들어가 단계를 바꾸고, 기업 계약과 수수료
            화면으로 이어집니다. 이름과 금액은 모두 예시입니다.
          </p>
        </header>

        <div className="kad-page-stage" data-ss-fill>
          <AdminDemo />
        </div>
      </main>
    </div>
  );
}
