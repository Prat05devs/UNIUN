import type { Metadata } from "next";
import { DsxFooter, DsxNav } from "@/components/uniun/DsxChrome";
import { AdminDashboard } from "@/features/admin/component/admin-dashboard";

// Unlisted operator console. Not linked from anywhere, not indexed; the page
// renders a plain 404 for anyone whose key is not an admin key.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function OpsPage() {
  return (
    <div className="dsx" id="top">
      <DsxNav />

      <main>
        <section className="phead">
          <div className="wrap">
            <AdminDashboard />
          </div>
        </section>
      </main>

      <DsxFooter />
    </div>
  );
}
