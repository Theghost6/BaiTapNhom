import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './WafStatus.css';
import { Shield, AlertTriangle, Activity, Clock, Ban, CheckCircle, XCircle, BarChart3, Zap, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { setWafEnabled, getWafEnabled } from './waf';
import { toast } from 'react-toastify';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, TimeScale, Filler);

const WafDashboard = () => {
    const [wafData, setWafData] = useState({
        blockedIPs: [],
        log: [],
        stats: {},
        riskLevel: 'low'
    });
    const [wafEnabled, setWafEnabledState] = useState(getWafEnabled());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [banIpValue, setBanIpValue] = useState('');
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const [realTimeMode, setRealTimeMode] = useState(true);
    const [showFullLog, setShowFullLog] = useState(false);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const BACKEND_URL = import.meta.env.VITE_SOCKET_URL;
    const [socket, setSocket] = useState(null);

    const fetchWafInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BACKEND_URL}/api/waf-status`, {
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to fetch WAF data');

            const data = await response.json();
            // Fetch WAF stats for blockedIPDetails and chart data
            let stats = {};
            try {
                const statsRes = await fetch(`${BACKEND_URL}/api/waf-stats`, {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });
                if (statsRes.ok) {
                    stats = await statsRes.json();
                }
            } catch { }
            // Merge log and blockedIPDetails from both endpoints
            setWafData(prevData => ({
                ...data,
                ...stats,
                log: Array.isArray(data.log) && data.log.length > 0 ? data.log : (Array.isArray(stats.log) ? stats.log : []),
                blockedIPDetails: Array.isArray(stats.blockedIPDetails) && stats.blockedIPDetails.length > 0 ? stats.blockedIPDetails : (Array.isArray(data.blockedIPDetails) ? data.blockedIPDetails : []),
                riskLevel: calculateRiskLevel(data)
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateRiskLevel = (data) => {
        function parseLogTime(str) {
            // Try ISO first
            const iso = new Date(str);
            if (!isNaN(iso.getTime())) return iso;
            // Try 'HH:mm:ss dd/MM/yyyy'
            const match = str.match(/(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/);
            if (match) {
                const [_, h, m, s, d, M, y] = match;
                return new Date(`${y}-${M}-${d}T${h}:${m}:${s}`);
            }
            return new Date(); // fallback: now
        }
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentThreats = data.log?.filter(entry => {
            const entryTime = parseLogTime(entry.time);
            return entryTime > oneHourAgo && /XSS|threat|attack|block/i.test(entry.message);
        }).length || 0;

        if (recentThreats > 20) return 'critical';
        if (recentThreats > 10) return 'high';
        if (recentThreats > 5) return 'medium';
        return 'low';
    };

    const handleBanIP = async (ip) => {
        if (!ip.trim()) return;

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/ban-ip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip: ip.trim() })
            });

            if (response.ok) {
                setBanIpValue('');
                await fetchWafInfo();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to ban IP');
            }
        } catch (err) {
            setError('Network error while banning IP');
        } finally {
            setLoading(false);
        }
    };

    const handleUnbanIP = async (ip) => {
        try {
            setLoading(true);
            let ipAddress = '';
            if (typeof ip === 'string') {
                ipAddress = ip;
            } else if (ip.address) {
                ipAddress = ip.address;
            } else if (ip.ip) {
                ipAddress = ip.ip;
            }
            if (ipAddress === '::1') ipAddress = '127.0.0.1';
            if (!ipAddress || typeof ipAddress !== 'string') {
                setError('Không tìm thấy IP để gỡ block');
                setLoading(false);
                return;
            }
            const response = await fetch(`${BACKEND_URL}/api/unban-ip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip: ipAddress })
            });

            if (response.ok) {
                await fetchWafInfo();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to unban IP');
            }
        } catch (err) {
            setError('Network error while unbanning IP');
        } finally {
            setLoading(false);
        }
    };

    // Khi load dashboard, luôn lấy trạng thái WAF từ server và thiết lập socket
    useEffect(() => {
        const fetchWafState = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/waf-status`, {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setWafEnabledState(data.wafEnabled);
                }
            } catch { }
        };
        fetchWafState();

        // Thiết lập kết nối socket
        const sock = io(BACKEND_URL, { transports: ['websocket'] });
        setSocket(sock);

        // Lắng nghe sự kiện thay đổi trạng thái WAF
        sock.on('waf_state_changed', (data) => {
            if (typeof data?.wafEnabled === 'boolean') {
                setWafEnabledState(data.wafEnabled);
            }
            if (realTimeMode) fetchWafInfo();
        });

        // Lắng nghe sự kiện cập nhật log/threats
        sock.on('waf_log_updated', () => {
            if (realTimeMode) fetchWafInfo();
        });

        return () => {
            sock.disconnect();
        };
    }, [realTimeMode]);

    // Khi bật/tắt WAF, sau khi gửi API thì reload lại trạng thái từ server
    const handleToggleWaf = async (enabled) => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/waf-toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled })
            });
            if (response.ok) {
                toast.success(`WAF đã được ${enabled ? 'bật' : 'tắt'}`);
                // Reload trạng thái từ server
                const stateRes = await fetch(`${BACKEND_URL}/api/waf-status`, {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });
                if (stateRes.ok) {
                    const stateData = await stateRes.json();
                    setWafEnabledState(stateData.wafEnabled);
                }
            } else {
                setError('Không thể thay đổi trạng thái WAF');
            }
        } catch (err) {
            setError('Lỗi mạng khi thay đổi trạng thái WAF');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWafInfo();
    }, []);

    // Helper to get processed blocked IPs list (array of objects)
    const getBlockedIpList = () => {
        // Prefer blockedIPDetails if available (from backend getWAFStats)
        if (Array.isArray(wafData.blockedIPDetails) && wafData.blockedIPDetails.length > 0) {
            return wafData.blockedIPDetails;
        }
        let ipList = [];
        if (Array.isArray(wafData.blockedIPs)) {
            ipList = wafData.blockedIPs.map(ip => {
                if (typeof ip === 'string') return { ip };
                if (ip && typeof ip === 'object') return { ip: ip.ip || ip.address || '', ...ip };
                return null;
            }).filter(Boolean);
        } else if (wafData.blockedIPs && typeof wafData.blockedIPs === 'object') {
            ipList = Object.entries(wafData.blockedIPs).map(([ip, info]) => ({ ip, ...info }));
        }
        return ipList;
    };

    // Helper to render blocked IPs with details and Unban button
    const renderBlockedIPs = () => {
        const ipList = getBlockedIpList();
        if (!ipList.length) {
            return <span style={{ color: '#888' }}>Không có IP nào bị chặn</span>;
        }
        return ipList.map((ipObj, idx) => {
            const ipStr = ipObj.ip;
            const details = (
                <span style={{ fontSize: '0.85em', color: '#444', marginLeft: '0.5em' }}>
                    {ipObj.reason && <span>Lý do: {ipObj.reason} | </span>}
                    {ipObj.timestamp && <span>Thời gian: {new Date(ipObj.timestamp).toLocaleString('vi-VN')} | </span>}
                    {ipObj.attempts && typeof ipObj.attempts === 'object' && Object.keys(ipObj.attempts).length > 0 && (
                        <span>Vi phạm: {Object.entries(ipObj.attempts).map(([k, v]) => `${k}: ${v}`).join(', ')} | </span>
                    )}
                    {ipObj.expires && <span>Hết hạn: {new Date(ipObj.expires).toLocaleString('vi-VN')}</span>}
                </span>
            );
            if (!ipStr) return null;
            return (
                <span key={ipStr + idx} style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '4px', padding: '0.2rem 0.6rem', marginRight: '0.3rem', display: 'inline-flex', alignItems: 'center' }}>
                    {ipStr}
                    {details}
                    <button
                        onClick={() => handleUnbanIP(ipStr)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', marginLeft: '0.3rem', cursor: 'pointer', fontSize: '1rem' }}
                        title={`Unban ${ipStr}`}
                        disabled={loading}
                    >
                        <Trash2 className="icon" style={{ verticalAlign: 'middle' }} />
                    </button>
                </span>
            );
        });
    };

    // Helper to get color class for risk level
    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'critical': return 'risk-critical';
            case 'high': return 'risk-high';
            case 'medium': return 'risk-medium';
            case 'low': return 'risk-low';
            default: return 'risk-default';
        }
    };

    const getStatusIcon = (level) => {
        switch (level) {
            case 'critical': return <XCircle className="icon" />;
            case 'high': return <AlertTriangle className="icon" />;
            case 'medium': return <Clock className="icon" />;
            case 'low': return <CheckCircle className="icon" />;
            default: return <Activity className="icon" />;
        }
    };

    const formatTimeRemaining = (ms) => {
        if (ms <= 0) return 'Expired';
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    };

    const getThreatTypeIcon = (threatType) => {
        if (threatType.includes('XSS')) return '🔒';
        if (threatType.includes('BLOCKED_IP')) return '🚫';
        return '⚠️';
    };

    const getLogEntryType = (message) => {
        if (message.includes('[WAF] IP') && message.includes('blocked')) return 'blocked';
        if (message.includes('XSS')) return 'threat';
        if (message.includes('unbanned')) return 'unblocked';
        return 'info';
    };

    const getLogEntryColor = (type) => {
        switch (type) {
            case 'blocked': return 'log-blocked';
            case 'threat': return 'log-threat';
            case 'unblocked': return 'log-unblocked';
            default: return 'log-info';
        }
    };

    const displayedLog = showFullLog ? wafData.log : wafData.log.slice(-10);

    // Tính toán dữ liệu cho biểu đồ bar - chỉ giữ lại XSS và Blocked
    const xssCount = wafData.log.filter(entry => entry.message.includes('XSS')).length;
    const blockedCount = wafData.log.filter(entry => entry.message.includes('blocked')).length;

    const chartData = {
        labels: ['XSS', 'Blocked'],
        datasets: [
            {
                label: 'Threats',
                data: [xssCount, blockedCount],
                backgroundColor: [
                    '#f43f5e', // XSS
                    '#dc2626'  // Blocked
                ],
                borderRadius: 8,
                borderWidth: 1
            }
        ]
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Threat Statistics',
                font: { size: 18 }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Threat Type', font: { size: 14 } }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Count', font: { size: 14 } },
                grid: { color: '#e5e7eb' }
            }
        }
    };

    // Biểu đồ line: số lượng từng loại theo từng giờ trong ngày hiện tại - chỉ giữ lại XSS và Blocked
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // yyyy-mm-dd
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    function isValidDate(d) {
        return d instanceof Date && !isNaN(d.getTime());
    }
    function countThreatsByHour(type) {
        function parseLogTime(str) {
            const iso = new Date(str);
            if (!isNaN(iso.getTime())) return iso;
            const match = str.match(/(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/);
            if (match) {
                const [_, h, m, s, d, M, y] = match;
                return new Date(`${y}-${M}-${d}T${h}:${m}:${s}`);
            }
            return new Date();
        }
        return hours.map((h, idx) =>
            wafData.log.filter(entry => {
                if (!entry.time || typeof entry.time !== 'string') return false;
                const d = parseLogTime(entry.time);
                if (!isValidDate(d)) return false;
                const entryDay = d.toISOString().slice(0, 10);
                return entryDay === today && d.getHours() === idx && entry.message.includes(type);
            }).length
        );
    }
    const lineData = {
        labels: hours,
        datasets: [
            {
                label: 'XSS',
                data: countThreatsByHour('XSS'),
                borderColor: '#f43f5e',
                backgroundColor: 'rgba(244,63,94,0.1)',
                tension: 0.3,
                fill: true,
            },
            {
                label: 'Blocked',
                data: countThreatsByHour('blocked'),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220,38,38,0.1)',
                tension: 0.3,
                fill: true,
            }
        ]
    };
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: `Threats Over Time (Today: ${today})`,
                font: { size: 16 }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Hour', font: { size: 13 } },
                grid: { color: '#e5e7eb' },
                ticks: { maxTicksLimit: 24, font: { size: 11 } }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Count', font: { size: 13 } },
                grid: { color: '#e5e7eb' }
            }
        }
    };

    return (
        <div className="waf-dashboard">
            <div className="container">
                {/* Nút tạo log mẫu để test dashboard - chỉ tạo XSS và blocked */}
                <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                    <button
                        style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => {
                            const now = new Date();
                            const today = now.toISOString().slice(0, 10);
                            const sampleLog = [
                                { time: `${today}T08:00:00`, message: 'XSS attack detected' },
                                { time: `${today}T09:00:00`, message: 'XSS attack detected' },
                                { time: `${today}T10:00:00`, message: 'XSS attack detected' },
                                { time: `${today}T11:00:00`, message: 'XSS attack detected' },
                                { time: `${today}T12:00:00`, message: '[WAF] IP 1.2.3.4 blocked' }
                            ];
                            setWafData(prev => ({
                                ...prev,
                                log: sampleLog,
                                blockedIPs: ['1.2.3.4'],
                                riskLevel: calculateRiskLevel({ log: sampleLog })
                            }));
                        }}
                    >Tạo log mẫu để test biểu đồ</button>
                </div>
                {error && (
                    <div className="waf-card blocked">
                        <div className="waf-status">
                            <div className="row">
                                <AlertTriangle className="icon" />
                                <span>{error}</span>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="close-btn"
                            >
                                <XCircle className="icon" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="waf-card">
                    <div className="waf-status">
                        <div className="row">
                            <Shield className="icon" />
                            <div>
                                <h1 className="dashboard-title">WAF Security Dashboard</h1>
                                <p className="dashboard-desc">Web Application Firewall Monitoring & Control</p>
                            </div>
                        </div>
                        <div className="row">
                            <button
                                className={`waf-toggle${!wafEnabled ? ' off' : ''}`}
                                onClick={() => handleToggleWaf(!wafEnabled)}
                                disabled={loading}
                                title="Bật/Tắt WAF"
                            >
                                <Shield className="icon" style={{ fontSize: '1.5rem' }} />
                                {wafEnabled ? 'WAF Đang bật' : 'WAF Đang tắt'}
                            </button>
                            <button
                                className={`realtime-toggle${!realTimeMode ? ' off' : ''}`}
                                onClick={() => setRealTimeMode(!realTimeMode)}
                                disabled={loading}
                                title="Bật/Tắt Real-time"
                            >
                                <Zap className={realTimeMode ? 'icon zap-on' : 'icon zap-off'} style={{ fontSize: '1.5rem' }} />
                                Real-time
                            </button>
                            <button
                                onClick={fetchWafInfo}
                                disabled={loading}
                                className="refresh-btn"
                                title="Làm mới dữ liệu"
                            >
                                <RefreshCw className={loading ? 'icon spin' : 'icon'} style={{ fontSize: '1.3rem' }} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="waf-statistics">
                    <div className={`stat ${getRiskLevelColor(wafData.riskLevel)}`}>
                        <p className="stat-label">Security Level</p>
                        <p className="level">{wafData.riskLevel}</p>
                        {getStatusIcon(wafData.riskLevel)}
                    </div>
                    <div className="stat">
                        <p className="stat-label">Blocked IPs</p>
                        <p className="level">{getBlockedIpList().length}</p>
                        <Ban className="icon text-red" />
                    </div>
                    <div className="stat">
                        <p className="stat-label">Log Entries</p>
                        <p className="level">{wafData.log.length}</p>
                        <Activity className="icon text-blue" />
                    </div>
                    <div className="stat">
                        <p className="stat-label">Recent Threats</p>
                        <p className="level">{wafData.log.filter(entry => /threat|attack|XSS/i.test(entry.message)).length}</p>
                        <AlertTriangle className="icon text-orange" />
                    </div>
                </div>
                {/* Ban/Unban IP UI */}
                <div className="waf-card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                    <h2 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                        <Ban className="icon" /> Quản lý IP bị chặn
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Nhập IP để ban"
                            value={banIpValue}
                            onChange={e => setBanIpValue(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: '180px' }}
                        />
                        <button
                            onClick={() => handleBanIP(banIpValue)}
                            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
                            disabled={loading || !banIpValue.trim()}
                        >Ban IP</button>
                        {getBlockedIpList().length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 'bold' }}>Đã chặn:</span>
                                {renderBlockedIPs()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chỉ hiển thị một biểu đồ line Threats Over Time (Today) */}
                <div className="waf-card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                    <h2 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                        <BarChart3 className="icon" />
                        Threats Over Time (Today)
                    </h2>
                    {lineData.datasets.every(ds => ds.data.every(v => v === 0)) ? (
                        <div style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>
                            Không có dữ liệu để hiển thị biểu đồ hôm nay
                        </div>
                    ) : (
                        <Line data={lineData} options={lineOptions} height={180} />
                    )}
                </div>

                <div className="waf-main">
                    {/* ...existing code... */}
                    <div className="waf-card">
                        <div className="waf-status mb-4">
                            <h2 className="section-title">
                                <Activity className="icon" />
                                Activity Monitor
                            </h2>
                            <button
                                onClick={() => setShowFullLog(!showFullLog)}
                                className="activity-toggle"
                            >
                                {showFullLog ? <EyeOff className="icon" /> : <Eye className="icon" />}
                                <span>{showFullLog ? 'Show Less' : 'Show All'}</span>
                            </button>
                        </div>
                        <div className="waf-activity-log">
                            {displayedLog.length === 0 ? (
                                <p className="empty">No activity logged</p>
                            ) : (
                                displayedLog.map((entry, index) => {
                                    const logType = getLogEntryType(entry.message);
                                    return (
                                        <div key={index} className={`waf-activity-entry ${getLogEntryColor(logType)}`}>
                                            <div className="waf-status">
                                                <div className="info">
                                                    <p className="font-medium">{entry.message}</p>
                                                    <p>{entry.time}</p>
                                                </div>
                                                <span className="icon">
                                                    {getThreatTypeIcon(entry.message)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="waf-footer">
                    <p>WAF Dashboard - Last updated: {new Date().toLocaleString('vi-VN')}</p>
                </div>
            </div>
        </div>
    );
};

export default WafDashboard;