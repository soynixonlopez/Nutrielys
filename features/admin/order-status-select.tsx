"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (value: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      if (res.ok) router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Select value={currentStatus} onValueChange={handleChange} disabled={isLoading}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(statusLabels) as OrderStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {statusLabels[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        variant="outline"
        disabled={isLoading || currentStatus === "confirmed"}
        onClick={() => handleChange("confirmed")}
      >
        Aceptar
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isLoading || currentStatus === "cancelled"}
        onClick={() => handleChange("cancelled")}
      >
        Rechazar
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isLoading || currentStatus === "delivered"}
        onClick={() => handleChange("delivered")}
      >
        Confirmar entrega
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={isLoading}
        onClick={async () => {
          if (!window.confirm("¿Eliminar este pedido? Esta accion no se puede deshacer.")) return;
          setIsLoading(true);
          try {
            const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
            if (res.ok) router.refresh();
          } finally {
            setIsLoading(false);
          }
        }}
      >
        Eliminar
      </Button>
    </div>
  );
}
