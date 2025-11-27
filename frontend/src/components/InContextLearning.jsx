import React, { useState, useEffect } from 'react';
import { getInductionScore } from '../api';

const InContextLearning = ({ text }) => {
        const [behaviorData, setBehaviorData] = useState(null);
        const [loading, setLoading] = useState(false);
        const [selectedHead, setSelectedHead] = useState(0);

        useEffect(() => {
                if (!text) return;

                const fetchData = async () => {
                        setLoading(true);
                        try {
                                const data = await getInductionScore(text);
                                setBehaviorData(data);
                        } catch (error) {
                                console.error("Error fetching induction scores:", error);
                        }
                        setLoading(false);
                };

                fetchData();
        }, [text]);

        if (loading) {
                return <div className="card"><div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div></div>;
        }

        if (!behaviorData) {
                return null;
        }

        const getBehaviorColor = (type) => {
                const colors = {
                        'copying': '#34D399',
                        'induction': '#A78BFA',
                        'self-attention': '#60A5FA',
                        'previous-token': '#FBBF24',
                        'diffuse': '#64748b',
                        'mixed': '#94a3b8'
                };
                return colors[type] || '#64748b';
        };

        const getBehaviorIcon = (type) => {
                const icons = {
                        'copying': '📋',
                        'induction': '🔄',
                        'self-attention': '🎯',
                        'previous-token': '⬅️',
                        'diffuse': '💫',
                        'mixed': '🔀'
                };
                return icons[type] || '❓';
        };

        const currentBehavior = behaviorData.behaviors[selectedHead];

        return (
                <div className="card">
                        <h2 className="card-header">
                                <span className="card-header-indicator indicator-green"></span>
                                In-Context Learning Behaviors
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem', marginLeft: '0.75rem' }}>
                                Detecting copying heads (attend to identical tokens) and induction heads (attend to token after previous occurrence)
                        </p>

                        {/* Head selector grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {behaviorData.behaviors.map((behavior, idx) => (
                                        <button
                                                key={idx}
                                                onClick={() => setSelectedHead(idx)}
                                                className={`behavior-head-card ${selectedHead === idx ? 'active' : ''}`}
                                                style={{ borderColor: getBehaviorColor(behavior.behavior_type) }}
                                        >
                                                <div className="behavior-icon">{getBehaviorIcon(behavior.behavior_type)}</div>
                                                <div className="behavior-head-num">Head {behavior.head}</div>
                                                <div className="behavior-type">{behavior.behavior_type}</div>
                                        </button>
                                ))}
                        </div>

                        {/* Selected head details */}
                        <div className="behavior-details">
                                <div className="behavior-scores">
                                        <div className="score-item">
                                                <span className="score-label">Copying</span>
                                                <div className="score-bar">
                                                        <div className="score-fill" style={{ width: `${currentBehavior.copying_score * 100}%`, backgroundColor: '#34D399' }} />
                                                </div>
                                                <span className="score-value">{(currentBehavior.copying_score * 100).toFixed(1)}%</span>
                                        </div>

                                        <div className="score-item">
                                                <span className="score-label">Induction</span>
                                                <div className="score-bar">
                                                        <div className="score-fill" style={{ width: `${currentBehavior.induction_score * 100}%`, backgroundColor: '#A78BFA' }} />
                                                </div>
                                                <span className="score-value">{(currentBehavior.induction_score * 100).toFixed(1)}%</span>
                                        </div>

                                        <div className="score-item">
                                                <span className="score-label">Self-Attention</span>
                                                <div className="score-bar">
                                                        <div className="score-fill" style={{ width: `${currentBehavior.diagonal_score * 100}%`, backgroundColor: '#60A5FA' }} />
                                                </div>
                                                <span className="score-value">{(currentBehavior.diagonal_score * 100).toFixed(1)}%</span>
                                        </div>

                                        <div className="score-item">
                                                <span className="score-label">Previous Token</span>
                                                <div className="score-bar">
                                                        <div className="score-fill" style={{ width: `${currentBehavior.prev_token_score * 100}%`, backgroundColor: '#FBBF24' }} />
                                                </div>
                                                <span className="score-value">{(currentBehavior.prev_token_score * 100).toFixed(1)}%</span>
                                        </div>
                                </div>

                                {/* Examples */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                        {/* Copying examples */}
                                        <div className="examples-section">
                                                <h3 className="examples-title">Copying Examples</h3>
                                                {currentBehavior.copying_examples.length > 0 ? (
                                                        <div className="examples-list">
                                                                {currentBehavior.copying_examples.map((ex, idx) => (
                                                                        <div key={idx} className="example-item">
                                                                                <div className="example-token">"{ex.token}"</div>
                                                                                <div className="example-detail">
                                                                                        Pos {ex.from_pos} → {ex.to_pos}
                                                                                        <span className="example-attn">{(ex.attention * 100).toFixed(1)}%</span>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <div className="no-examples">No copying detected</div>
                                                )}
                                        </div>

                                        {/* Induction examples */}
                                        <div className="examples-section">
                                                <h3 className="examples-title">Induction Examples</h3>
                                                {currentBehavior.induction_examples.length > 0 ? (
                                                        <div className="examples-list">
                                                                {currentBehavior.induction_examples.map((ex, idx) => (
                                                                        <div key={idx} className="example-item">
                                                                                <div className="example-pattern">
                                                                                        "{ex.pattern_token}" → "{ex.next_token}"
                                                                                </div>
                                                                                <div className="example-detail">
                                                                                        Pattern@{ex.pattern_pos}, Query@{ex.query_pos}
                                                                                        <span className="example-attn">{(ex.attention * 100).toFixed(1)}%</span>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <div className="no-examples">No induction detected</div>
                                                )}
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default InContextLearning;
