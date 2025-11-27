import React, { useState } from 'react';
import { getAnalogy } from '../api';

const VectorArithmetic = () => {
        const [positive, setPositive] = useState(['king', 'woman']);
        const [negative, setNegative] = useState(['man']);
        const [results, setResults] = useState([]);
        const [loading, setLoading] = useState(false);
        const [newPosWord, setNewPosWord] = useState('');
        const [newNegWord, setNewNegWord] = useState('');

        const handleCalculate = async () => {
                setLoading(true);
                try {
                        const res = await getAnalogy(positive, negative);
                        setResults(res.results);
                } catch (error) {
                        console.error("Error calculating analogy:", error);
                }
                setLoading(false);
        };

        const addWord = (list, setList, word, setInput) => {
                if (word.trim()) {
                        setList([...list, word.trim()]);
                        setInput('');
                }
        };

        const removeWord = (list, setList, index) => {
                const newList = [...list];
                newList.splice(index, 1);
                setList(newList);
        };

        return (
                <div className="card">
                        <h2 className="card-header">
                                <span className="card-header-indicator indicator-pink"></span>
                                Vector Arithmetic
                        </h2>
                        <p style={{
                                fontSize: '13px',
                                color: '#6c757d',
                                marginBottom: '1.5rem',
                                lineHeight: 1.5
                        }}>
                                Perform word analogies using vector arithmetic. Example: "king" - "man" + "woman" = "queen"
                        </p>

                        <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '1.5rem',
                                alignItems: 'start'
                        }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {/* Equation Display */}
                                        <div style={{
                                                padding: '20px',
                                                background: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef',
                                                minHeight: '80px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '12px',
                                                fontSize: '16px',
                                                fontFamily: "'Courier New', monospace"
                                        }}>
                                                {positive.map((word, i) => (
                                                        <React.Fragment key={`pos-${i}`}>
                                                                {i > 0 && <span style={{ color: '#6c757d', fontWeight: 600 }}>+</span>}
                                                                <div style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        background: 'rgba(16, 185, 129, 0.1)',
                                                                        padding: '8px 12px',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                                                        color: '#059669',
                                                                        fontWeight: 500
                                                                }}>
                                                                        {word}
                                                                        <button
                                                                                onClick={() => removeWord(positive, setPositive, i)}
                                                                                style={{
                                                                                        background: 'none',
                                                                                        border: 'none',
                                                                                        color: '#059669',
                                                                                        cursor: 'pointer',
                                                                                        fontSize: '16px',
                                                                                        padding: 0,
                                                                                        opacity: 0.6,
                                                                                        transition: 'opacity 0.2s'
                                                                                }}
                                                                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                                                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                                                                        >
                                                                                ×
                                                                        </button>
                                                                </div>
                                                        </React.Fragment>
                                                ))}

                                                {negative.length > 0 && (
                                                        <>
                                                                <span style={{ color: '#6c757d', fontWeight: 600 }}>-</span>
                                                                {negative.map((word, i) => (
                                                                        <React.Fragment key={`neg-${i}`}>
                                                                                {i > 0 && <span style={{ color: '#6c757d', fontWeight: 600 }}>-</span>}
                                                                                <div style={{
                                                                                        display: 'inline-flex',
                                                                                        alignItems: 'center',
                                                                                        gap: '8px',
                                                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                                                        padding: '8px 12px',
                                                                                        borderRadius: '6px',
                                                                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                                                                        color: '#dc2626',
                                                                                        fontWeight: 500
                                                                                }}>
                                                                                        {word}
                                                                                        <button
                                                                                                onClick={() => removeWord(negative, setNegative, i)}
                                                                                                style={{
                                                                                                        background: 'none',
                                                                                                        border: 'none',
                                                                                                        color: '#dc2626',
                                                                                                        cursor: 'pointer',
                                                                                                        fontSize: '16px',
                                                                                                        padding: 0,
                                                                                                        opacity: 0.6,
                                                                                                        transition: 'opacity 0.2s'
                                                                                                }}
                                                                                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                                                                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                                                                                        >
                                                                                                ×
                                                                                        </button>
                                                                                </div>
                                                                        </React.Fragment>
                                                                ))}
                                                        </>
                                                )}

                                                <span style={{ color: '#6c757d', fontWeight: 600 }}>=</span>
                                                <span style={{ color: '#4f46e5', fontWeight: 700, fontSize: '18px' }}>?</span>
                                        </div>

                                        {/* Input Controls */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <div>
                                                        <label style={{
                                                                display: 'block',
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: '#1a1a1a',
                                                                marginBottom: '6px'
                                                        }}>
                                                                Add Positive Word
                                                        </label>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                <input
                                                                        type="text"
                                                                        value={newPosWord}
                                                                        onChange={(e) => setNewPosWord(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                        addWord(positive, setPositive, newPosWord, setNewPosWord);
                                                                                }
                                                                        }}
                                                                        placeholder="e.g., king"
                                                                        style={{
                                                                                flex: 1,
                                                                                padding: '10px 12px',
                                                                                border: '1px solid #e9ecef',
                                                                                borderRadius: '6px',
                                                                                fontSize: '14px',
                                                                                outline: 'none',
                                                                                transition: 'border-color 0.2s'
                                                                        }}
                                                                        onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                                                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                                                                />
                                                                <button
                                                                        onClick={() => addWord(positive, setPositive, newPosWord, setNewPosWord)}
                                                                        style={{
                                                                                padding: '10px 16px',
                                                                                background: '#10b981',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '6px',
                                                                                fontSize: '14px',
                                                                                fontWeight: 500,
                                                                                cursor: 'pointer',
                                                                                transition: 'background 0.2s'
                                                                        }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                                                                >
                                                                        +
                                                                </button>
                                                        </div>
                                                </div>

                                                <div>
                                                        <label style={{
                                                                display: 'block',
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                color: '#1a1a1a',
                                                                marginBottom: '6px'
                                                        }}>
                                                                Add Negative Word
                                                        </label>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                <input
                                                                        type="text"
                                                                        value={newNegWord}
                                                                        onChange={(e) => setNewNegWord(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                        addWord(negative, setNegative, newNegWord, setNewNegWord);
                                                                                }
                                                                        }}
                                                                        placeholder="e.g., man"
                                                                        style={{
                                                                                flex: 1,
                                                                                padding: '10px 12px',
                                                                                border: '1px solid #e9ecef',
                                                                                borderRadius: '6px',
                                                                                fontSize: '14px',
                                                                                outline: 'none',
                                                                                transition: 'border-color 0.2s'
                                                                        }}
                                                                        onFocus={(e) => e.currentTarget.style.borderColor = '#ef4444'}
                                                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                                                                />
                                                                <button
                                                                        onClick={() => addWord(negative, setNegative, newNegWord, setNewNegWord)}
                                                                        style={{
                                                                                padding: '10px 16px',
                                                                                background: '#ef4444',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '6px',
                                                                                fontSize: '14px',
                                                                                fontWeight: 500,
                                                                                cursor: 'pointer',
                                                                                transition: 'background 0.2s'
                                                                        }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                                                                >
                                                                        -
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>

                                        <button
                                                onClick={handleCalculate}
                                                disabled={loading}
                                                className="btn btn-primary"
                                                style={{ width: '100%', justifyContent: 'center' }}
                                        >
                                                {loading ? 'Calculating...' : 'Calculate Analogy'}
                                        </button>
                                </div>

                                {/* Results Panel */}
                                <div style={{
                                        minWidth: '280px',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        border: '1px solid #e9ecef'
                                }}>
                                        <h3 style={{
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: '#1a1a1a',
                                                marginBottom: '12px'
                                        }}>
                                                Results
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {results.map((res, idx) => (
                                                        <div
                                                                key={idx}
                                                                style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        padding: '12px',
                                                                        background: 'white',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid #e9ecef',
                                                                        transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                        e.currentTarget.style.borderColor = '#4f46e5';
                                                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                        e.currentTarget.style.borderColor = '#e9ecef';
                                                                        e.currentTarget.style.boxShadow = 'none';
                                                                }}
                                                        >
                                                                <span style={{
                                                                        fontFamily: "'Courier New', monospace",
                                                                        fontSize: '14px',
                                                                        color: '#1a1a1a',
                                                                        fontWeight: 500
                                                                }}>
                                                                        {res.token}
                                                                </span>
                                                                <span style={{
                                                                        fontSize: '12px',
                                                                        fontFamily: "'Courier New', monospace",
                                                                        color: '#6c757d'
                                                                }}>
                                                                        {res.score.toFixed(4)}
                                                                </span>
                                                        </div>
                                                ))}
                                                {results.length === 0 && !loading && (
                                                        <div style={{
                                                                textAlign: 'center',
                                                                padding: '32px 16px',
                                                                color: '#6c757d',
                                                                fontSize: '13px',
                                                                fontStyle: 'italic'
                                                        }}>
                                                                Add words and calculate to see results
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default VectorArithmetic;
