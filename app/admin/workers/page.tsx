// app/admin/workers/page.tsx
import { WorkersSummary } from "../../component/workers/WorkersSummary";
import { WorkerCardDetailed } from "../../component/workers/WorkerCardDetailed";
import { WorkerLogs } from "../../component/workers/WorkerLogs";
import { mockWorkers } from "../../lib/mock-data";

export default function AdminWorkersPage() {
  return (
    <div className="space-y-6">
      {/* سرصفحه */}
      <div>
        <h1 className="text-2xl font-black text-amber-50">Workerها</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          پایش و مدیریت Workerهای اختصاصی هر سفارش
        </p>
      </div>

      {/* خلاصه */}
      <WorkersSummary workers={mockWorkers} />

      {/* گرید Workerها + لاگ‌ها */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-amber-50">لیست Workerها</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mockWorkers.map((w) => (
              <WorkerCardDetailed key={w.id} worker={w} />
            ))}
          </div>
        </div>

        <div>
          <WorkerLogs />
        </div>
      </div>
    </div>
  );
}