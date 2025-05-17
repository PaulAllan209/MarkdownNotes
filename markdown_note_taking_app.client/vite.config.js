import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import process from 'node:process';
import { env } from 'process';

// Check if running in Docker
const isDocker = fs.existsSync('/.dockerenv') || process.env.DOCKER_CONTAINER;

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "markdown_note_taking_app.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Only try to create certificates in local development
if (!isDocker) {
    try {
        if (!fs.existsSync(baseFolder)) {
            fs.mkdirSync(baseFolder, { recursive: true });
        }

        if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
            const certProcess = child_process.spawnSync('dotnet', [
                'dev-certs',
                'https',
                '--export-path',
                certFilePath,
                '--format',
                'Pem',
                '--no-password',
            ], { stdio: 'inherit' });

            if (certProcess.status !== 0) {
                console.warn("Warning: Could not create HTTPS certificate. HTTPS may not be available.");
            }
        }
    } catch (error) {
        console.warn("Warning: Error setting up HTTPS certificate:", error.message);
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7198';

// Configure HTTPS for local development only
const httpsConfig = !isDocker && fs.existsSync(keyFilePath) && fs.existsSync(certFilePath)
    ? {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    }
    : false;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            },
            // Add other API endpoints as needed
            '^/api': {
                target,
                secure: false
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '59650'),
        https: httpsConfig
    },
    build: {
        // Ensures proper output for hosting in various environments
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
    }
})
