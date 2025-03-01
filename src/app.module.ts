import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [MonitoringModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Aplica logs a todas as rotas
  }
}
