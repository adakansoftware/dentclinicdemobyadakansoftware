import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import AdminBlockedSlotsClient from "@/components/admin/AdminBlockedSlotsClient";

export const dynamic = "force-dynamic";

export default async function AdminBlockedSlotsPage() {
  await requireAdmin();
  const [spRows, bsRows] = await Promise.all([
    safeQuery("admin blocked slot specialists", () => prisma.specialist.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }), []),
    safeQuery(
      "admin blocked slots",
      () =>
        prisma.blockedSlot.findMany({
          orderBy: [{ date: "desc" }, { startTime: "asc" }],
          include: { specialist: { select: { nameTr: true } } },
        }),
      []
    ),
  ]);

  const specialists = spRows.map((sp) => ({ id: sp.id, nameTr: sp.nameTr }));
  const blockedSlots = bsRows.map((bs) => ({
    id: bs.id, specialistId: bs.specialistId,
    date: bs.date.toISOString(),
    startTime: bs.startTime, endTime: bs.endTime, reason: bs.reason,
    specialist: { nameTr: bs.specialist.nameTr },
  }));

  return <AdminBlockedSlotsClient specialists={specialists} blockedSlots={blockedSlots} />;
}
