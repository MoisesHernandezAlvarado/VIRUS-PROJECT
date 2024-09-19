import { Router } from "express";
import { InfectionCase } from "./controller";

export class InfectionRoutes {
    static get routes() {
        const router = Router();
        const controller = new InfectionCase();

        // Ruta para obtener todas las infecciones
        router.get("/", controller.listAllCases);

        // Ruta para crear una nueva infección
        router.post("/", controller.registerCase);

        // Ruta para obtener infecciones de la última semana
        router.get("/last-week", controller.listCasesFromLastWeek);

        // Ruta para obtener una infección por ID
        router.get("/:id", controller.findCaseById);

        // Ruta para actualizar una infección por ID
        router.put("/:id", controller.modifyCase);

        // Ruta para eliminar una infección por ID
        router.delete("/:id", controller.registerCase);

        return router;
    }
}
