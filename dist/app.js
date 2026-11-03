"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_2 = require("./config/cors");
const swagger_1 = require("./config/swagger");
const request_logger_1 = require("./middleware/request-logger");
const not_found_1 = require("./middleware/not-found");
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = require("./routes");
const createApp = () => {
    const app = (0, express_1.default)();
    // Security & Utility Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)(cors_2.corsOptions));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use(request_logger_1.requestLogger);
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.status(200).json({
            status: 'UP',
            service: 'PanelSphere Backend API',
            timestamp: new Date().toISOString(),
        });
    });
    // Swagger Documentation
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swagger_1.swaggerSpec);
    });
    // Main API Router
    app.use('/api/v1', routes_1.rootRouter);
    // 404 & Global Error Handling
    app.use(not_found_1.notFoundHandler);
    app.use(error_handler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
