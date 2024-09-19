import { Router } from "express";
import { InfectionController } from "./controller";

export class InfectionRoutes {
    static get routes() {
        const router = Router();
        const controller = new InfectionController();

        // Ruta para obtener todas las infecciones
        router.get("/", controller.listAllInfections);

        // Ruta para crear una nueva infección
        router.post("/", controller.registerInfection);

        // Ruta para obtener infecciones de la última semana
        router.get("/last-week", controller.listInfectionsFromLastWeek);

        // Ruta para obtener una infección por ID
        router.get("/:id", controller.findInfectionById);

        // Ruta para actualizar una infección por ID
        router.put("/:id", controller.modifyInfection);

        // Ruta para eliminar una infección por ID
        router.delete("/:id", controller.removeInfection);

        return router;
    }
}
