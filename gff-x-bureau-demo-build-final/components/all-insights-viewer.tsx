'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandedSections {
  [key: string]: boolean;
}

export function AllInsightsViewer() {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    location: true,
    security: true,
    device: false,
    behavioral: false,
    risk: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toString();
    if (Array.isArray(value)) return `[${value.length} items]`;
    if (typeof value === 'object') return '{...}';
    return value.toString();
  };

  const sections = [
    {
      id: 'location',
      title: 'Location Intelligence',
      icon: '📍',
      items: [
        { label: 'GPS Location', value: 'Navi Mumbai, Maharashtra' },
        { label: 'City', value: 'Navi Mumbai' },
        { label: 'Country', value: 'India' },
        { label: 'Region', value: 'Maharashtra' },
        { label: 'Latitude', value: '19.02681142' },
        { label: 'Longitude', value: '73.03800618' },
        { label: 'IP Location', value: 'Mumbai' },
        { label: 'IP Latitude', value: '19.07597541809082' },
        { label: 'IP Longitude', value: '72.87738037109375' },
      ],
    },
    {
      id: 'security',
      title: 'IP Security',
      icon: '🔒',
      items: [
        { label: 'IP Address', value: '114.79.136.217' },
        { label: 'IP Type', value: 'v4' },
        { label: 'ISP', value: 'D-Vois Broadband Private Limited' },
        { label: 'VPN Detected', value: 'No' },
        { label: 'Proxy Detected', value: 'No' },
        { label: 'Tor Detected', value: 'No' },
        { label: 'Crawler', value: 'No' },
        { label: 'Threat Level', value: 'Low' },
      ],
    },
    {
      id: 'device',
      title: 'Device Information',
      icon: '📱',
      items: [
        { label: 'OS', value: 'Android' },
        { label: 'Model', value: 'SM-S931B' },
        { label: 'ADB Enabled', value: 'No' },
        { label: 'Debuggable', value: 'No' },
        { label: 'Developer Mode', value: 'No' },
        { label: 'Accessibility Enabled', value: 'No' },
        { label: 'Package', value: 'id.bureau.deviceintelligence' },
        { label: 'App Installer', value: 'Google Play Store' },
        { label: 'App Cloned', value: 'No' },
        { label: 'App Tampered', value: 'Yes' },
        { label: 'Root Access', value: 'No' },
        { label: 'Emulator', value: 'No' },
        { label: 'Remote Desktop', value: 'No' },
        { label: 'Screen Sharing', value: 'No' },
      ],
    },
    {
      id: 'behavioral',
      title: 'Behavioral Metrics',
      icon: '👤',
      items: [
        { label: 'Behavioral Risk Level', value: 'Low' },
        { label: 'Behavioral Risk Score', value: '0.0' },
        { label: 'Bot Detection Score', value: '0.0' },
        { label: 'User Similarity Score', value: '32.47' },
        { label: 'Autofill Activity', value: 'Low' },
        { label: 'Copy Paste Activity', value: 'Low' },
        { label: 'Field Focus Activity', value: 'Low' },
        { label: 'Background App Push', value: 'Low' },
        { label: 'Session Duration (ms)', value: '87915.0' },
        { label: 'Swipe Activity Detected', value: 'No' },
        { label: 'Confidence Score', value: '98.0%' },
      ],
    },
    {
      id: 'risk',
      title: 'Risk Assessment',
      icon: '⚠️',
      items: [
        { label: 'Device Risk Level', value: 'Medium' },
        { label: 'Device Risk Score', value: '60.0' },
        { label: 'First Seen Days', value: '0.0' },
        { label: 'Factory Reset Risk', value: 'Low' },
        { label: 'Is Hooked', value: 'No' },
        { label: 'MITM Attack Detected', value: 'No' },
        { label: 'Mock GPS', value: 'No' },
        { label: 'Fingerprint', value: '3239bd0e-7d34-493b-b519...' },
        { label: 'Session ID', value: '7d2c401f-5b79-49b3-bc92...' },
        { label: 'Request ID', value: 'fc931a17-f66d-4dff-a5dc...' },
        { label: 'Timestamp', value: '1.77217829424215E12' },
        { label: 'Status Code', value: '200' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{section.icon}</span>
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <ChevronDown
              size={20}
              className="transition-transform"
              style={{
                transform: expandedSections[section.id] ? 'rotate(180deg)' : 'rotate(0)',
              }}
            />
          </button>

          {expandedSections[section.id] && (
            <div className="px-6 py-4 border-t border-border bg-secondary/20 space-y-3 max-h-96 overflow-y-auto">
              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start py-2 border-b border-border/50 last:border-b-0"
                >
                  <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                  <span className="text-sm text-foreground font-semibold ml-4">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
