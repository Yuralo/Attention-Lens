import React, { useState } from 'react';

const AttentionMap = ({ data }) => {
        const { attention, tokens } = data;
        const [selectedHead, setSelectedHead] = useState(0);
        const [hoveredCell, setHoveredCell] = useState(null);
        const nHeads = attention.length;

        const currentAttention = attention[selectedHead];
        const maxValue = Math.max(...currentAttention.flat());

        return (
                <div className="card">
                        <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                flexWrap: 'wrap',
                                gap: '1rem'
                        }}>
                                <h2 className="card-header" style={{ marginBottom: 0 }}>
                                        <span className="card-header-indicator indicator-blue"></span>
                                        Attention Patterns
                                </h2>

                                {/* Head Selector */}
                                <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#111827',
                                        padding: '6px',
                                        borderRadius: '8px',
                                        border: '1px solid #374151'
                                }}>
                                        <span style={{
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: '#9ca3af',
                                                paddingLeft: '8px'
                                        }}>
                                                Head:
                                        </span>
                                        {Array.from({ length: nHeads }).map((_, i) => (
                                                <button
                                                        key={i}
                                                        onClick={() => setSelectedHead(i)}
                                                        style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '6px',
                                                                border: 'none',
                                                                background: selectedHead === i ? '#6366f1' : '#1f2937',
                                                                color: selectedHead === i ? 'white' : '#d1d5db',
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                boxShadow: selectedHead === i ? '0 2px 4px rgba(99, 102, 241, 0.3)' : 'none'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                                if (selectedHead !== i) {
                                                                        e.currentTarget.style.background = '#374151';
                                                                }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                                if (selectedHead !== i) {
                                                                        e.currentTarget.style.background = '#1f2937';
                                                                }
                                                        }}
                                                >
                                                        {i}
                                                </button>
                                        ))}
                                </div>
                        </div>

                        {/* Attention Matrix */}
                        <div style={{
                                overflowX: 'auto',
                                overflowY: 'auto',
                                maxHeight: '500px',
                                background: '#111827',
                                borderRadius: '8px',
                                padding: '16px',
                                border: '1px solid #374151'
                        }}>
                                <div style={{ minWidth: 'max-content' }}>
                                        {/* Column headers */}
                                        <div style={{
                                                display: 'flex',
                                                marginBottom: '12px',
                                                paddingLeft: '100px',
                                                gap: '2px'
                                        }}>
                                                {tokens.map((token, i) => (
                                                        <div
                                                                key={i}
                                                                style={{
                                                                        width: '40px',
                                                                        fontSize: '11px',
                                                                        fontFamily: "'Courier New', monospace",
                                                                        color: '#9ca3af',
                                                                        textAlign: 'center',
                                                                        transform: 'rotate(-45deg)',
                                                                        transformOrigin: 'left bottom',
                                                                        whiteSpace: 'nowrap',
                                                                        marginLeft: '20px'
                                                                }}
                                                        >
                                                                {token.replace(' ', '·')}
                                                        </div>
                                                ))}
                                        </div>

                                        {/* Matrix rows */}
                                        {currentAttention.map((row, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                                        {/* Row label */}
                                                        <div style={{
                                                                width: '90px',
                                                                fontSize: '12px',
                                                                fontFamily: "'Courier New', monospace",
                                                                color: '#d1d5db',
                                                                textAlign: 'right',
                                                                fontWeight: 500
                                                        }}>
                                                                {tokens[i].replace(' ', '·')}
                                                        </div>

                                                        {/* Cells */}
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                                {row.map((val, j) => (
                                                                        <div
                                                                                key={j}
                                                                                style={{
                                                                                        width: '40px',
                                                                                        height: '40px',
                                                                                        background: `rgba(99, 102, 241, ${val / maxValue})`,
                                                                                        borderRadius: '4px',
                                                                                        cursor: 'pointer',
                                                                                        transition: 'all 0.2s',
                                                                                        position: 'relative',
                                                                                        border: hoveredCell?.i === i && hoveredCell?.j === j ? '2px solid #818cf8' : '2px solid transparent'
                                                                                }}
                                                                                onMouseEnter={() => setHoveredCell({ i, j, val })}
                                                                                onMouseLeave={() => setHoveredCell(null)}
                                                                        />
                                                                ))}
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* Tooltip */}
                        {hoveredCell && (
                                <div style={{
                                        marginTop: '16px',
                                        padding: '12px 16px',
                                        background: '#1a1f2e',
                                        borderRadius: '8px',
                                        border: '1px solid #374151',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                }}>
                                        <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
                                                Attention Weight
                                        </div>
                                        <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                fontSize: '14px'
                                        }}>
                                                <span style={{ fontFamily: "'Courier New', monospace", color: '#d1d5db' }}>
                                                        From: <strong style={{ color: '#f9fafb' }}>{tokens[hoveredCell.j].replace(' ', '·')}</strong>
                                                </span>
                                                <span style={{ color: '#9ca3af' }}>→</span>
                                                <span style={{ fontFamily: "'Courier New', monospace", color: '#d1d5db' }}>
                                                        To: <strong style={{ color: '#f9fafb' }}>{tokens[hoveredCell.i].replace(' ', '·')}</strong>
                                                </span>
                                                <span style={{
                                                        marginLeft: 'auto',
                                                        fontWeight: 600,
                                                        color: '#818cf8',
                                                        fontFamily: "'Courier New', monospace"
                                                }}>
                                                        {(hoveredCell.val * 100).toFixed(2)}%
                                                </span>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default AttentionMap;
