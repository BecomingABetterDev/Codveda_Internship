import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const projectRoot = path.dirname(fileURLToPath(
    import.meta.url));
export default {
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(projectRoot, './src'),
        },
    },
};