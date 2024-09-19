import cron from 'node-cron';
import { InfectionMpox } from '../../data/models/caseModel';
import { EmailService } from '../services/email.service';
import { generateInfectionEmailTemplate } from '../templates/email.template';

const emailService = new EmailService();

export const emailJob = () => {
    cron.schedule("*/10 * * * * *", async () => {
        try {
            const infections = await InfectionMpox.find({ isSent: false });
            
            if (!infections.length) {
                console.log("No hay casos de virulea del mono pendientes por enviar");
                return;
            }

            console.log(`Procesando ${infections.length} casos de viruela del mono`);

            await Promise.all(
                infections.map(async (infection) => {
                    try {
                        const htmlBody = generateInfectionEmailTemplate(
                            infection.genre,
                            infection.age,
                            infection.lat,
                            infection.lng
                        );

                        await emailService.sendEmail({
                            to: "moiseshernandezalvarado@hotmail.com",
                            subject: `MPOX CASE`,
                            htmlBody: htmlBody,
                        });

                        console.log(`Email enviado para el caso con Id ${infection._id}`);

                        await InfectionMpox.findByIdAndUpdate(infection._id, { isSent: true });

                        console.log(`Caso de viruela del mono con Id ${infection._id} actualizado como email enviado`);
                    } catch (error) {
                        console.error(`Error al procesar el caso con Id ${infection._id}:`, error);
                    }
                })
            );
        } catch (error) {
            console.error("Error durante el envío de correos:", error);
        }
    });
};
