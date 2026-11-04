// app/component/customers/CustomerActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "../../component/ui/Button";
import { deletePassenger } from "../../lib/api";

export function CustomerActions({ id, token }: { id: number; token: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm("آیا از حذف این مشتری اطمینان دارید؟ این عمل قابل بازگشت نیست.")
    )
      return;

    setIsDeleting(true);
    try {
      await deletePassenger(token, id);
      router.push("/admin/customers");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/customers/${id}/edit`}>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 ml-1" /> ویرایش
        </Button>
      </Link>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4 ml-1" />
        )}
        حذف
      </Button>
    </div>
  );
}
