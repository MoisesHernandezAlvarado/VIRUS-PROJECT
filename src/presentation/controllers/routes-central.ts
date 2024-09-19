import {Router} from "express"
import { InfectionRoutes } from "./infections/routes";

export class AppRoutes{
    static get routes() : Router{
        const router = Router();
        router.use("/api/mpox",InfectionRoutes.routes);
        return router;
    }
}