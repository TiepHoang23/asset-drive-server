// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  jwtSecret: process.env.JWT_SECRET,
  port: parseInt(process.env.PORT, 10) || 3000,
}));
