import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TokenPrediction = ({ predictions }) => {
        // Custom tooltip for better UX
        const CustomTooltip = ({ active, payload }) => {
                if (active && payload && payload.length) {
                        return (
                                <div style={{
                                        background: '#1a1f2e',
                                        padding: '12px 16px',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
                                }}>
                                        <p style={{
                                                margin: 0,
                                                fontFamily: "'Courier New', monospace",
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: '#818cf8',
                                                marginBottom: '4px'
                                        }}>
                                                {payload[0].payload.token.replace(' ', '·')}
                                        </p>
                                        <p style={{
                                                margin: 0,
                                                fontSize: '13px',
                                                color: '#9ca3af'
                                        }}>
                                                Probability: <span style={{ fontWeight: 600, color: '#f9fafb' }}>{(payload[0].value * 100).toFixed(2)}%</span>
                                        </p>
                                </div>
                        );
                }
                return null;
        };

        return (
                <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                        gap: '1.5rem'
                }}>
                        {/* Bar Chart */}
                        <div className="card">
                                <h2 className="card-header">
                                        <span className="card-header-indicator indicator-blue"></span>
                                        Top Predictions
                                </h2>
                                <div className="chart-container">
                                        <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                        data={predictions}
                                                        layout="vertical"
                                                        margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                                                >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                                                        <XAxis
                                                                type="number"
                                                                domain={[0, 1]}
                                                                stroke="#9ca3af"
                                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                                                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                                        />
                                                        <YAxis
                                                                dataKey="token"
                                                                type="category"
                                                                stroke="#9ca3af"
                                                                width={90}
                                                                tick={{ fill: '#d1d5db', fontSize: 13, fontFamily: "'Courier New', monospace" }}
                                                                tickFormatter={(value) => value.replace(' ', '·')}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1f2937' }} />
                                                        <Bar dataKey="prob" radius={[0, 6, 6, 0]} maxBarSize={40}>
                                                                {predictions.map((entry, index) => (
                                                                        <Cell
                                                                                key={`cell-${index}`}
                                                                                fill={index === 0 ? '#6366f1' : `rgba(99, 102, 241, ${0.3 + (entry.prob * 0.7)})`}
                                                                        />
                                                                ))}
                                                        </Bar>
                                                </BarChart>
                                        </ResponsiveContainer>
                                </div>
                        </div>

                        {/* List View */}
                        <div className="card">
                                <h2 className="card-header">
                                        <span className="card-header-indicator indicator-purple"></span>
                                        Detailed Breakdown
                                </h2>
                                <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem',
                                        maxHeight: '350px',
                                        overflowY: 'auto',
                                        paddingRight: '4px'
                                }}>
                                        {predictions.map((pred, idx) => (
                                                <div
                                                        key={idx}
                                                        style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                padding: '14px 16px',
                                                                background: idx === 0 ? 'rgba(99, 102, 241, 0.1)' : '#111827',
                                                                borderRadius: '8px',
                                                                border: `1px solid ${idx === 0 ? 'rgba(99, 102, 241, 0.3)' : '#374151'}`,
                                                                transition: 'all 0.2s',
                                                                cursor: 'pointer'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                                e.currentTarget.style.borderColor = '#6366f1';
                                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(99, 102, 241, 0.2)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                                e.currentTarget.style.borderColor = idx === 0 ? 'rgba(99, 102, 241, 0.3)' : '#374151';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <span style={{
                                                                        fontSize: '13px',
                                                                        fontWeight: 600,
                                                                        color: '#9ca3af',
                                                                        minWidth: '24px'
                                                                }}>
                                                                        #{idx + 1}
                                                                </span>
                                                                <span style={{
                                                                        fontFamily: "'Courier New', monospace",
                                                                        fontSize: '14px',
                                                                        fontWeight: 500,
                                                                        color: '#f9fafb',
                                                                        background: '#1f2937',
                                                                        padding: '6px 12px',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid #374151'
                                                                }}>
                                                                        {pred.token.replace(' ', '·')}
                                                                </span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <div style={{
                                                                        width: '100px',
                                                                        height: '6px',
                                                                        background: '#1f2937',
                                                                        borderRadius: '999px',
                                                                        overflow: 'hidden'
                                                                }}>
                                                                        <div style={{
                                                                                width: `${pred.prob * 100}%`,
                                                                                height: '100%',
                                                                                background: idx === 0 ? '#6366f1' : '#818cf8',
                                                                                borderRadius: '999px',
                                                                                transition: 'width 0.5s ease'
                                                                        }} />
                                                                </div>
                                                                <span style={{
                                                                        fontSize: '14px',
                                                                        fontWeight: 600,
                                                                        color: '#f9fafb',
                                                                        minWidth: '55px',
                                                                        textAlign: 'right',
                                                                        fontFamily: "'Courier New', monospace"
                                                                }}>
                                                                        {(pred.prob * 100).toFixed(1)}%
                                                                </span>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        );
};

export default TokenPrediction;
