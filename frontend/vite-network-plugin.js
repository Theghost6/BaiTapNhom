import { networkInterfaces } from 'os';

// Plugin để hiển thị rõ ràng các network addresses
export function networkAddressPlugin() {
    return {
        name: 'network-address-display',
        configureServer(server) {
            server.middlewares.use('/__network_info', (req, res) => {
                const interfaces = networkInterfaces();
                const addresses = [];

                for (const name of Object.keys(interfaces)) {
                    for (const iface of interfaces[name]) {
                        if (iface.family === 'IPv4' && !iface.internal) {
                            addresses.push({
                                name: name,
                                address: iface.address,
                                url: `http://${iface.address}:${server.config.server.port || 5173}`
                            });
                        }
                    }
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ addresses }, null, 2));
            });

            // Hook vào server ready để log địa chỉ
            const originalPrintUrls = server.printUrls;
            server.printUrls = function () {
                // Gọi hàm gốc trước
                originalPrintUrls.call(this);

                // Sau đó thêm thông tin network
                const interfaces = networkInterfaces();
                console.log('\n🌐 Network addresses:');

                for (const name of Object.keys(interfaces)) {
                    for (const iface of interfaces[name]) {
                        if (iface.family === 'IPv4' && !iface.internal) {
                            const url = `http://${iface.address}:${server.config.server.port || 5173}`;
                            console.log(`  ➜ ${name}: \x1b[36m${url}\x1b[0m`);
                        }
                    }
                }
                console.log('\n📱 Use these addresses to access from other devices on your network');
            };
        },
    };
}
