"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Settings {
  salonName: string;
  salonNameEt: string;
  address: string;
  phone: string;
  email: string;
  timeSlotInterval: number;
  bookingLeadTime: number;
  maxAdvanceDays: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error("Failed to save");
    }
  }

  if (!settings) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Salon Settings</h1>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Salon Name (English)</Label>
              <Input
                value={settings.salonName}
                onChange={(e) =>
                  setSettings({ ...settings, salonName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Salon Name (Estonian)</Label>
              <Input
                value={settings.salonNameEt}
                onChange={(e) =>
                  setSettings({ ...settings, salonNameEt: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={settings.address || ""}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={settings.phone || ""}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={settings.email || ""}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Time Slot Interval (min)</Label>
              <Input
                type="number"
                value={settings.timeSlotInterval}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    timeSlotInterval: parseInt(e.target.value) || 15,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Booking Lead Time (min)</Label>
              <Input
                type="number"
                value={settings.bookingLeadTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bookingLeadTime: parseInt(e.target.value) || 60,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max Advance Days</Label>
              <Input
                type="number"
                value={settings.maxAdvanceDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxAdvanceDays: parseInt(e.target.value) || 30,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
