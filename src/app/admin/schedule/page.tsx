"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface Barber {
  id: string;
  name: string;
}

interface ScheduleDay {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

interface ScheduleBreak {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  label: string;
}

export default function SchedulePage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [schedules, setSchedules] = useState<ScheduleDay[]>([]);
  const [breaks, setBreaks] = useState<ScheduleBreak[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/barbers")
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((b: Barber & { isActive: boolean }) => b.isActive);
        setBarbers(active);
        if (active.length > 0) setSelectedBarber(active[0].id);
      });
  }, []);

  useEffect(() => {
    if (!selectedBarber) return;
    setLoading(true);
    fetch(`/api/schedule/${selectedBarber}`)
      .then((res) => res.json())
      .then((data) => {
        // Fill in missing days with defaults
        const sched: ScheduleDay[] = [];
        for (let day = 0; day < 7; day++) {
          const existing = data.schedules.find(
            (s: ScheduleDay) => s.dayOfWeek === day
          );
          sched.push(
            existing || {
              dayOfWeek: day,
              startTime: "09:00",
              endTime: "18:00",
              isWorking: day >= 1 && day <= 5,
            }
          );
        }
        setSchedules(sched);
        setBreaks(
          data.breaks.map((b: ScheduleBreak) => ({
            dayOfWeek: b.dayOfWeek,
            startTime: b.startTime,
            endTime: b.endTime,
            label: b.label || "",
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [selectedBarber]);

  function updateSchedule(dayOfWeek: number, field: string, value: string | boolean) {
    setSchedules((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
      )
    );
  }

  function addBreak(dayOfWeek: number) {
    setBreaks((prev) => [
      ...prev,
      { dayOfWeek, startTime: "12:00", endTime: "13:00", label: "Lunch" },
    ]);
  }

  function removeBreak(index: number) {
    setBreaks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateBreak(index: number, field: string, value: string) {
    setBreaks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  }

  async function saveSchedule() {
    setSaving(true);
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barberId: selectedBarber,
        schedules,
        breaks,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Schedule saved");
    } else {
      toast.error("Failed to save schedule");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <Button onClick={saveSchedule} disabled={saving || !selectedBarber}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Schedule"}
        </Button>
      </div>

      <div className="mb-6 max-w-xs">
        <Label>Select Barber</Label>
        <Select value={selectedBarber} onValueChange={setSelectedBarber}>
          <SelectTrigger>
            <SelectValue placeholder="Select barber" />
          </SelectTrigger>
          <SelectContent>
            {barbers.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {schedules.map((sched) => (
            <Card key={sched.dayOfWeek}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {DAYS[sched.dayOfWeek]}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sched.isWorking}
                      onChange={(e) =>
                        updateSchedule(
                          sched.dayOfWeek,
                          "isWorking",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Working</span>
                  </div>
                </div>
              </CardHeader>
              {sched.isWorking && (
                <CardContent className="py-3 px-4 pt-0 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Start</Label>
                      <Input
                        type="time"
                        value={sched.startTime}
                        onChange={(e) =>
                          updateSchedule(
                            sched.dayOfWeek,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">End</Label>
                      <Input
                        type="time"
                        value={sched.endTime}
                        onChange={(e) =>
                          updateSchedule(
                            sched.dayOfWeek,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBreak(sched.dayOfWeek)}
                      className="mt-5"
                    >
                      + Break
                    </Button>
                  </div>
                  {/* Breaks for this day */}
                  {breaks
                    .map((b, idx) => ({ ...b, idx }))
                    .filter((b) => b.dayOfWeek === sched.dayOfWeek)
                    .map((brk) => (
                      <div
                        key={brk.idx}
                        className="flex items-center gap-3 pl-4 border-l-2 border-muted"
                      >
                        <Input
                          type="time"
                          value={brk.startTime}
                          onChange={(e) =>
                            updateBreak(brk.idx, "startTime", e.target.value)
                          }
                          className="w-28"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="time"
                          value={brk.endTime}
                          onChange={(e) =>
                            updateBreak(brk.idx, "endTime", e.target.value)
                          }
                          className="w-28"
                        />
                        <Input
                          value={brk.label}
                          onChange={(e) =>
                            updateBreak(brk.idx, "label", e.target.value)
                          }
                          placeholder="Label"
                          className="w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBreak(brk.idx)}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
