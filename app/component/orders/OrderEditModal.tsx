"use client";
import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { updateOrder } from "@/app/lib/api";
import { Loader2, RefreshCw } from "lucide-react";

interface Props {
  order: any; // OrderListSchema
  token: string;
  onClose: () => void;
  onRefresh: () => void;
}

export function OrderEditModal({ order, token, onClose, onRefresh }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: order.origin || "",
    destination: order.destination || "",
    travel_date: order.travel_date || "",
    train_number: order.train_number || "",
    salon: order.salon || "",
    phone: order.phone || "",
    restart_robot: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateOrder(token, order.id, formData);
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-amber-50 mb-4">
          ویرایش سفارش #{order.id}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                مبدا
              </label>
              <input
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2 text-sm text-amber-50"
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                مقصد
              </label>
              <input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2 text-sm text-amber-50"
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                شماره قطار
              </label>
              <input
                name="train_number"
                value={formData.train_number}
                onChange={handleChange}
                className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2 text-sm text-amber-50"
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                شماره موبایل
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2 text-sm text-amber-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
            <input
              type="checkbox"
              id="restart_robot"
              name="restart_robot"
              checked={formData.restart_robot}
              onChange={handleChange}
              className="h-4 w-4 rounded border-amber-500/20 bg-[#0f0d0a] text-amber-500"
            />
            <label
              htmlFor="restart_robot"
              className="flex items-center gap-2 text-sm text-amber-50 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-amber-400" />
              شروع مجدد ربات با اطلاعات جدید
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-amber-500/10">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "ذخیره تغییرات"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
