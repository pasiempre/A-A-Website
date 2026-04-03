"use client";

import { FirstRunWizardClient } from "@/components/admin/FirstRunWizardClient";
import { PostJobAutomationSettingsClient } from "@/components/admin/PostJobAutomationSettingsClient";
import { QuoteTemplateManagerClient } from "@/components/admin/QuoteTemplateManagerClient";

export function ConfigurationClient() {
  return (
    <div className="space-y-6">
      <QuoteTemplateManagerClient />
      <PostJobAutomationSettingsClient />
      <FirstRunWizardClient />
    </div>
  );
}
