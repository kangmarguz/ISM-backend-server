import 'dotenv/config';
import express from 'express';
// == CONFIG ==
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// == MIDDLEWARE ==
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//== ROUTE ==
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesPath = path.join(__dirname, 'routes');

const app = express();
const PORT = process.env.ISM_SERVER_PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

//=== DYNAMIC ROUTE LOADING ===
const files = readdirSync(routesPath).filter((f) => f.endsWith('.js'));

for (const file of files) {
    const route = await import(`./routes/${file}`);
    app.use('/api', route.default);
}

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
