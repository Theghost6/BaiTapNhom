import { networkInterfaces } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getNetworkAddresses() {
    const interfaces = networkInterfaces();
    const addresses = [];

    console.log('\n🌐 Available Network Addresses:');
    console.log('══════════════════════════════════════');

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                const address = iface.address;
                const url = `http://${address}:5173`;
                addresses.push({ name, address, url });

                console.log(`📱 ${name.padEnd(15)} → ${url}`);
            }
        }
    }

    if (addresses.length === 0) {
        console.log('❌ No external network interfaces found');
    } else {
        console.log('══════════════════════════════════════');
        console.log('💡 Use these URLs to access from other devices');
        console.log('🔧 Make sure Windows Firewall allows the connection\n');
    }

    return addresses;
}

// Chạy function khi file được execute trực tiếp
getNetworkAddresses();

export { getNetworkAddresses };
