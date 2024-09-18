import { Request, Response } from 'express';
import { InfectionModel } from '../../../data/models/infection.model';
import { endOfDay, startOfDay, subDays } from 'date-fns';


export class InfectionController {
    public getInfections = async (req: Request, res: Response) => {
        try {
            const infections = await InfectionModel.find();
            return res.json(infections);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener los casos" });
        }
    }

    public getInfectionsLastWeek = async (req: Request, res: Response) => {
        try {
            // Obtener la fecha y hora actual en UTC
            const now = new Date();
            const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
            const sevenDaysAgo = subDays(startOfDay(utcToday), 7);

            const infections = await InfectionModel.find({
                creationDate: {
                    $gte: sevenDaysAgo
                }
            });
    
            if (infections.length === 0) {
                return res.status(404).json({ message: "No se encontraron casos en la última semana." });
            }
    
            return res.json({ data: infections });
        } catch (error) {
            console.error('Error al obtener los casos de la última semana:', error);
            return res.status(500).json({ message: "Error al obtener los casos de la última semana" });
        }
    }
    
    public createInfection = async (req: Request, res: Response) => {
        try {
            const { lat, lng, genre, age } = req.body;
            const newInfection = await InfectionModel.create({
                lat,
                lng,
                genre,
                age,
                creationDate: new Date(),
                isSent: false
            });
            res.json(newInfection);
        } catch (error:any) {
            if (error.name === 'ValidationError') {

                return res.status(400).json({ message: "Datos inválidos: " + error.message });
            }
            return res.status(500).json({ message: "Error al crear el caso" });
        }
    }  

  
    public getInfectionById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const infection = await InfectionModel.findById(id);
            if (!infection) {
                return res.status(404).json({ message: "Caso no encontrado" });
            }
            return res.json(infection);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener el caso" });
        }
    }

    
    public updateInfection = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { lat, lng, genre, age, isSent } = req.body;
    
            const updatedInfection = await InfectionModel.findByIdAndUpdate(
                id,
                { lat, lng, genre, age, isSent },
                { new: true, runValidators: true } 
            );
    
            if (!updatedInfection) {
                return res.status(404).json({ message: "Caso no encontrado" });
            }
    
            return res.json(updatedInfection);
        } catch (error:any) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Datos inválidos: " + error.message });
            }
            return res.status(500).json({ message: "Error al actualizar el caso" });
        }
    }

    
    public deleteInfection = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const infection = await InfectionModel.findByIdAndDelete(id);

            if (!infection) {
                return res.status(404).json({ message: "Caso no encontrado" });
            }
            return res.json({ message: "Caso eliminado" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el caso" });
        }
    }
}
