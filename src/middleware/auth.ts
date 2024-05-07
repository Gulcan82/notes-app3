import { Request, Response, NextFunction } from "express";
import { getAdmins } from "../services/auth";

export async function hasAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).send("Unauthorized");
        }

        // Annahme: getAdmins gibt eine Liste der autorisierten Benutzer zurück
        const admins = await getAdmins();

        // Überprüfen, ob der autorisierte Benutzer in der Liste der Administratoren enthalten ist
        if (!admins.includes(authorization)) {
            return res.status(403).send("Forbidden");
        }

        // Wenn der Benutzer autorisiert ist, rufe den nächsten Middleware-Funktion auf
        next();
    } catch (error) {
        console.error("Fehler bei der Authentifizierung:", error);
        res.status(500).send("Internal Server Error");
    }
};
