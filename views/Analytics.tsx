import React, { useState, useEffect, useMemo } from 'react';
import { getAnalyticsData } from '../lib/database';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        const result = await getAnalyticsData();
        setData(result);
        setLoading(false);
    };

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-yellow-900/30 text-yellow-500 border-yellow-900/40';
            case 'Review': return 'bg-green-900/30 text-green-500 border-green-900/40';
            case 'Final': return 'bg-blue-900/30 text-blue-400 border-blue-900/40';
            case 'Published': return 'bg-purple-900/30 text-purple-400 border-purple-900/40';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    // Process data for charts
    const activityData = useMemo(() => {
        if (!data?.aiGenerations) return [];
        // Create last 30 days map
        const map = new Map<string, number>();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            const key = d.toISOString().split('T')[0];
            map.set(key, 0);
            return key;
        });

        data.aiGenerations.forEach((gen: any) => {
            const date = gen.created_at.split('T')[0];
            if (map.has(date)) {
                map.set(date, (map.get(date) || 0) + gen.tokens_used);
            }
        });

        return Array.from(map.entries()).map(([date, tokens]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tokens
        }));
    }, [data]);

    const statusData = useMemo(() => {
        if (!data?.documentStats) return [];
        const counts: Record<string, number> = {};
        data.documentStats.forEach((doc: any) => {
            const status = doc.status || 'Draft';
            counts[status] = (counts[status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    const projectData = useMemo(() => {
        if (!data?.projects) return [];
        const counts: Record<string, number> = {};
        data.projects.forEach((p: any) => {
            const type = p.type || 'blog';
            counts[type] = (counts[type] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-dark">
            <header className="h-16 px-8 flex items-center justify-between bg-background-dark border-b border-border-dark shrink-0 z-10">
                <h2 className="text-lg font-bold text-text-primary tracking-tight">Usage Analytics</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Words"
                                value={(data?.totalWords || 0).toLocaleString()}
                                subtitle="In all documents"
                                icon="edit_note"
                                color="text-primary"
                            />
                            <StatCard
                                title="AI Queries"
                                value={(data?.totalAiQueries || 0).toLocaleString()}
                                subtitle="Generations used"
                                icon="auto_awesome"
                                color="text-purple-400"
                            />
                            <StatCard
                                title="Active Projects"
                                value={data?.projectCount || 0}
                                subtitle="Total projects"
                                icon="folder"
                                color="text-green-400"
                            />
                            <StatCard
                                title="Tokens Used"
                                value={(data?.totalTokens || 0).toLocaleString()}
                                subtitle="Estimate cost impact"
                                icon="token"
                                color="text-orange-400"
                            />
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* AI Activity Chart */}
                            <div className="lg:col-span-2 bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col">
                                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2 shrink-0">
                                    <span className="material-symbols-outlined text-orange-400">monitoring</span>
                                    AI Token Usage (30 Days)
                                </h3>
                                <div className="w-full h-[280px]">
                                    {(activityData.every(d => d.tokens === 0)) ? (
                                        <div className="h-full flex items-center justify-center text-text-secondary">No AI usage data yet</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={activityData}>
                                                <defs>
                                                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                                    itemStyle={{ color: '#fb923c' }}
                                                />
                                                <Area type="monotone" dataKey="tokens" stroke="#fb923c" fillOpacity={1} fill="url(#colorTokens)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                            {/* Document Status Pie Chart */}
                            <div className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col">
                                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2 shrink-0">
                                    <span className="material-symbols-outlined text-blue-400">pie_chart</span>
                                    Document Status
                                </h3>
                                <div className="w-full h-[280px]">
                                    {(statusData.length === 0) ? (
                                        <div className="h-full flex items-center justify-center text-text-secondary">No documents yet</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Project Types Chart */}
                        <div className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col">
                            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2 shrink-0">
                                <span className="material-symbols-outlined text-green-400">bar_chart</span>
                                Project Distribution
                            </h3>
                            <div className="w-full h-[240px]">
                                {(projectData.length === 0) ? (
                                    <div className="h-full flex items-center justify-center text-text-secondary">No projects yet</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={projectData} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                            <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                            <Tooltip cursor={{ fill: '#374151', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Recent Documents Table */}
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">description</span>
                                Recent Documents
                            </h3>
                            <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                                {(data?.recentDocs?.length ?? 0) === 0 ? (
                                    <div className="p-8 text-center text-text-secondary">
                                        <span className="material-symbols-outlined text-3xl mb-2 block">description</span>
                                        <p>No documents yet.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border-dark bg-black/20 text-xs uppercase tracking-wider text-text-secondary font-semibold">
                                                <th className="px-6 py-3">Document</th>
                                                <th className="px-6 py-3">Project</th>
                                                <th className="px-6 py-3">Words</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Updated</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-dark text-sm">
                                            {data.recentDocs.map((doc: any) => (
                                                <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-3 text-text-primary font-medium">{doc.title}</td>
                                                    <td className="px-6 py-3 text-text-secondary">{doc.projects?.name || '—'}</td>
                                                    <td className="px-6 py-3 text-text-secondary">{(doc.word_count || 0).toLocaleString()}</td>
                                                    <td className="px-6 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColor(doc.status)}`}>{doc.status}</span>
                                                    </td>
                                                    <td className="px-6 py-3 text-text-secondary">{formatTimeAgo(doc.updated_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Component for Stats
const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <div className="bg-surface-dark rounded-xl p-5 border border-border-dark hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">{title}</span>
            <span className={`material-symbols-outlined text-[22px] ${color}`}>{icon}</span>
        </div>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
    </div>
);

export default Analytics;