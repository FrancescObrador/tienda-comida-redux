import { Middleware } from "@reduxjs/toolkit";
import logger from '../utilities/Logger';


const loggerMiddleware: Middleware = (store) => next => action => {

    logger.info("🚀 Enviando accción:" + JSON.stringify(action));
    logger.info("📦 Estado anterior:" + JSON.stringify(store.getState()));

    const result = next(action);

    logger.info("✅ Nuevo estado:" + JSON.stringify(store.getState()));

    return result;
}

export default loggerMiddleware;
