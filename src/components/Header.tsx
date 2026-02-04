import Link from "next/link";

export default function Header() {
  return (
    <header style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link href="/" style={{ fontWeight: 700, textDecoration: "none" }}>
          Rocky Mountain Great Dane Rescue
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dogs" style={{ textDecoration: "none" }}>
            Dogs
          </Link>
        </div>
      </nav>
    </header>
  );
}
