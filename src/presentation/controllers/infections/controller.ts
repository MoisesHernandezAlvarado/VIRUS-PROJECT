import { Request, Response } from 'express';
import { InfectionMpox } from '../../../data/models/caseModel';
import { endOfDay, startOfDay, subDays } from 'date-fns';

export class InfectionCase {
  
    // Endpoint para obtener todos los casos de infecciones
    public listAllCases = async (req: Request, res: Response) => {
        try {
            const infections = await InfectionMpox.find();
            return res.json(infections);
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving infections" });
        }
    }

    // Endpoint para obtener infecciones de la última semana
    public listCasesFromLastWeek = async (req: Request, res: Response) => {
        try {
            const now = new Date();
            const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            const sevenDaysAgo = subDays(startOfDay(utcToday), 7);

            const infections = await InfectionMpox.find({
                creationDate: {
                    $gte: sevenDaysAgo
                }
            });
    
            if (infections.length === 0) {
                return res.status(404).json({ message: "No infections found in the last week" });
            }
    
            return res.json({ data: infections });
        } catch (error) {
            console.error('Error retrieving infections from last week:', error);
            return res.status(500).json({ message: "Error retrieving infections from last week" });
        }
    }

    // Endpoint para crear un nuevo caso de infección
    public registerCase = async (req: Request, res: Response) => {
        try {
            const { lat, lng, genre, age } = req.body;
            const newInfection = await InfectionMpox.create({
                lat,
                lng,
                genre,
                age,
                creationDate: new Date(),
                isSent: false
            });
            res.json(newInfection);
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Invalid data: " + error.message });
            }
            return res.status(500).json({ message: "Error registering the infection" });
        }
    }

    // Endpoint para obtener un caso de infección por ID
    public findCaseById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const infection = await InfectionMpox.findById(id);
            if (!infection) {
                return res.status(404).json({ message: "Infection not found" });
            }
            return res.json(infection);
        } catch (error) {
            return res.status(500).json({ message: "Error retrieving the infection" });
        }
    }

    // Endpoint para actualizar un caso de infección
    public modifyCase = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { lat, lng, genre, age, isSent } = req.body;
    
            const updatedInfection = await InfectionMpox.findByIdAndUpdate(
                id,
                { lat, lng, genre, age, isSent },
                { new: true, runValidators: true }
            );
    
            if (!updatedInfection) {
                return res.status(404).json({ message: "Infection not found" });
            }
    
            return res.json(updatedInfection);
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Invalid data: " + error.message });
            }
            return res.status(500).json({ message: "Error updating the infection" });
        }
    }

    // Endpoint para eliminar un caso de infección
    public removeCase = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const infection = await InfectionMpox.findByIdAndDelete(id);

            if (!infection) {
                return res.status(404).json({ message: "Infection not found" });
            }
            return res.json({ message: "Infection removed successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error removing the infection" });
        }
    }
}
