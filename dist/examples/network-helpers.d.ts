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
export declare function startUDPServer(port: number): Promise<UDPGeometricServer>;
/**
 * Stop all UDP servers
 */
export declare function stopAllServers(servers: UDPGeometricServer[]): Promise<void>;
/**
 * Create multiple UDP servers for network demos
 */
export declare function createNetworkTopology(ports: number[]): Promise<UDPGeometricServer[]>;
/**
 * Send a message between servers
 */
export declare function sendMessage(_fromServer: UDPGeometricServer, toPort: number, message: any): Promise<void>;
/**
 * Broadcast a message to multiple servers
 */
export declare function broadcastMessage(fromServer: UDPGeometricServer, toPorts: number[], message: any): Promise<void>;
/**
 * Wait for a message on a server
 */
export declare function waitForMessage(_server: UDPGeometricServer, _timeout?: number): Promise<any>;
