import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WeightAnalysis = ({ data }) => {
        // Transform data for chart
        const chartData = [];
        if (data && data.length > 0) {
                const numSV = data[0].singular_values.length;
                for (let i = 0; i < numSV; i++) {
                        const point = { index: i + 1 };
                        data.forEach(headData => {
                                point[`Head ${headData.head}`] = headData.singular_values[i];
                        });
                        chartData.push(point);
                }
        }

        const colors = [
                '#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6',
                '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#a855f7'
        ];

        const CustomTooltip = ({ active, payload, label }) => {
                if (active && payload && payload.length) {
                        return (
                                <div style={{
                                        background: 'white',
                                        padding: '12px 16px',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        maxWidth: '250px'
                                }}>
                                        <p style={{
                                                margin: 0,
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#1a1a1a',
                                                marginBottom: '8px'
                                        }}>
                                                Singular Value #{label}
                                        </p>
                                        {payload.map((entry, index) => (
                                                <div key={index} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        fontSize: '12px',
                                                        marginBottom: '4px'
                                                }}>
                                                        <span style={{ color: entry.color, fontWeight: 500 }}>{entry.name}</span>
                                                        <span style={{ fontWeight: 600, color: '#1a1a1a', marginLeft: '12px' }}>
                                                                {entry.value.toFixed(4)}
                                                        </span>
                                                </div>
                                        ))}
                                </div>
                        );
                }
                return null;
        };

        return (
                <div className="card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                        <h2 className="card-header">
                                <span className="card-header-indicator indicator-yellow"></span>
                                Singular Value Analysis
                        </h2>
                        <p style={{
                                fontSize: '13px',
                                color: '#6c757d',
                                marginBottom: '1rem',
                                lineHeight: 1.5
                        }}>
                                Singular values of the OV matrix (W_O × W_V) for each attention head.
                                Steeper drops indicate more specialized heads.
                        </p>
                        <div style={{ flex: 1, minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                                                <XAxis
                                                        dataKey="index"
                                                        stroke="#6c757d"
                                                        tick={{ fill: '#6c757d', fontSize: 12 }}
                                                        label={{ value: 'Singular Value Index', position: 'bottom', fill: '#6c757d', fontSize: 12, offset: 10 }}
                                                />
                                                <YAxis
                                                        stroke="#6c757d"
                                                        tick={{ fill: '#6c757d', fontSize: 12 }}
                                                        label={{ value: 'Value', angle: -90, position: 'left', fill: '#6c757d', fontSize: 12 }}
                                                        scale="log"
                                                        domain={[0.001, 'auto']}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend
                                                        wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                                                        iconType="line"
                                                />
                                                {data.map((headData, i) => (
                                                        <Line
                                                                key={headData.head}
                                                                type="monotone"
                                                                dataKey={`Head ${headData.head}`}
                                                                stroke={colors[i % colors.length]}
                                                                dot={false}
                                                                strokeWidth={2.5}
                                                                activeDot={{ r: 6, strokeWidth: 0 }}
                                                        />
                                                ))}
                                        </LineChart>
                                </ResponsiveContainer>
                        </div>
                </div>
        );
};

export default WeightAnalysis;
