import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useOrg } from '../contexts/OrgContext';
import { api } from '../lib/api';
import { Download, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { organization, refreshOrg } = useOrg();
  const [themeColor, setThemeColor] = useState(
    (organization as any)?.settings?.themeColor || '#4F46E5'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleExport = async () => {
    try {
      const response = await api.get('/org/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `org_export_${new Date().getTime()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      await api.put('/org', {
        settings: {
          ...((organization as any)?.settings || {}),
          themeColor
        }
      });
      await refreshOrg();
      toast.success('Theme color updated successfully');
    } catch (error) {
      console.error('Failed to update theme:', error);
      toast.error('Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Organization Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage your organization preferences and data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Data Management">
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Export all your organization data (products, sales, purchases, customers, etc.) as a JSON file for backup or migration.
            </p>
            <Button onClick={handleExport} className="w-full flex items-center justify-center gap-2">
              <Download size={18} />
              Export Organization Data
            </Button>
          </div>
        </Card>

        <Card title="Theme Customization">
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Personalize the primary color of your application interface.
            </p>
            
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Primary Color (Hex)</label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg border border-[var(--color-border)] shadow-sm shrink-0" 
                    style={{ backgroundColor: themeColor }}
                  />
                  <Input 
                    value={themeColor} 
                    onChange={(e) => setThemeColor(e.target.value)} 
                    placeholder="#4F46E5" 
                  />
                </div>
              </div>
              <Button onClick={handleSaveTheme} loading={isSaving} className="mb-1" variant="default">
                <Save size={18} className="mr-2" />
                Save Theme
              </Button>
            </div>
            
            <div className="p-4 bg-[var(--color-bg-page)] rounded-lg border border-[var(--color-border)] mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Preview</p>
              <div className="flex gap-2">
                <div className="px-4 py-2 text-white text-sm font-medium rounded-lg" style={{ backgroundColor: themeColor }}>Primary Button</div>
                <div className="px-4 py-2 text-sm font-medium rounded-lg border" style={{ color: themeColor, borderColor: themeColor }}>Outline Button</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
