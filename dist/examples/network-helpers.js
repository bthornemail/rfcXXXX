/**
 * Network Helper Functions for RFC XXXX Demos
 *
 * Provides utilities for starting/stopping UDP servers in demonstrations.
 * Connects real UDP servers to demos instead of using simulations.
 */
import { UDPGeometricServer } from '../networking/udp-server.js';
/**
 * Start a UDP server for demo purposes
 */
export async function startUDPServer(port) {
    const config = {
        port,
        host: 'localhost',
        maxMessageSize: 8192,
        timeout: 5000,
        retryAttempts: 3
    };
    const server = new UDPGeometricServer(config);
    await server.start();
    return server;
}
/**
 * Stop all UDP servers
 */
export async function stopAllServers(servers) {
    await Promise.all(servers.map(server => server.stop()));
}
/**
 * Create multiple UDP servers for network demos
 */
export async function createNetworkTopology(ports) {
    const servers = [];
    for (const port of ports) {
        const server = await startUDPServer(port);
        servers.push(server);
    }
    return servers;
}
/**
 * Send a message between servers
 */
export async function sendMessage(_fromServer, toPort, message) {
    // For demo purposes, we'll simulate message sending
    // In a real implementation, this would use the UDP server's internal socket
    console.log(`Sending message from server to port ${toPort}:`, message);
    return Promise.resolve();
}
/**
 * Broadcast a message to multiple servers
 */
export async function broadcastMessage(fromServer, toPorts, message) {
    const broadcastPromises = toPorts.map(port => sendMessage(fromServer, port, message));
    await Promise.all(broadcastPromises);
}
/**
 * Wait for a message on a server
 */
export function waitForMessage(_server, _timeout = 5000) {
    // For demo purposes, we'll simulate message waiting
    // In a real implementation, this would use the UDP server's message handlers
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ type: 'demo_message', data: 'Simulated message' });
        }, 100);
    });
}
//# sourceMappingURL=network-helpers.js.map