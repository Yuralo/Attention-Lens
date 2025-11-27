import React, { useState, useEffect } from 'react';
import { getEigenvalues } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EigenvalueAnalysis = ({ text }) => {
        const [eigenData, setEigenData] = useState(null);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
                if (!text) return;

                const fetchData = async () => {
                        setLoading(true);
                        try {
                                const data = await getEigenvalues(text);
                                setEigenData(data);
                        } catch (error) {
                                console.error("Error fetching eigenvalues:", error);
                        }
                        setLoading(false);
                };

                fetchData();
        }, [text]);

        if (loading) {
                return <div className="card"><div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div></div>;
        }

        if (!eigenData) {
                return null;
        }

        // Transform data for chart
        const chartData = [];
        const maxLen = Math.max(...eigenData.eigenvalues.map(h => h.eigenvalues.length));

        for (let i = 0; i < maxLen; i++) {
                const point = { index: i + 1 };
                eigenData.eigenvalues.forEach(headData => {
                        if (i < headData.eigenvalues.length) {
                                point[`Head ${headData.head}`] = headData.eigenvalues[i];
                        }
                });
                chartData.push(point);
        }

        const colors = [
                '#60A5FA', '#34D399', '#F87171', '#FBBF24', '#A78BFA',
                '#EC4899', '#6366F1', '#10B981', '#EF4444', '#F59E0B',
                '#8B5CF6', '#DB2777'
        ];

        return (
                <div className="card" style={{ height: '600px' }}>
                        <h2 className="card-header">
                                <span className="card-header-indicator indicator-purple"></span>
                                Eigenvalue Spectrum Analysis
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem', marginLeft: '0.75rem' }}>
                                Eigenvalue spectrum of attention patterns. Low-rank heads (few dominant eigenvalues) are more specialized.
                        </p>

                        {/* Head summaries */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {eigenData.eigenvalues.map((head, idx) => (
                                        <div key={idx} className="eigen-summary-card">
                                                <div className="eigen-head-label">Head {head.head}</div>
                                                <div className="eigen-stat">
                                                        <span className="eigen-stat-label">Rank:</span>
                                                        <span className="eigen-stat-value">{head.rank_estimate}</span>
                                                </div>
                                                <div className="eigen-stat">
                                                        <span className="eigen-stat-label">Significant:</span>
                                                        <span className="eigen-stat-value">{head.num_significant}</span>
                                                </div>
                                        </div>
                                ))}
                        </div>

                        <ResponsiveContainer width="100%" height="70%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis
                                                dataKey="index"
                                                stroke="#64748b"
                                                label={{ value: 'Eigenvalue Index', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                                        />
                                        <YAxis
                                                stroke="#64748b"
                                                label={{ value: 'Magnitude', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                                                scale="log"
                                                domain={[0.001, 'auto']}
                                        />
                                        <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '0.5rem' }}
                                                itemStyle={{ color: '#f1f5f9' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        {eigenData.eigenvalues.map((headData, i) => (
                                                <Line
                                                        key={headData.head}
                                                        type="monotone"
                                                        dataKey={`Head ${headData.head}`}
                                                        stroke={colors[i % colors.length]}
                                                        dot={false}
                                                        strokeWidth={2}
                                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                                />
                                        ))}
                                </LineChart>
                        </ResponsiveContainer>
                </div>
        );
};

export default EigenvalueAnalysis;
