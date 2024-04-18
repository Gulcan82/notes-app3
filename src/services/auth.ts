import * as fs from 'node:fs'


export function getAdmins(): string[] {
    const admin = fs.readFileSync('data/admins.json', 'utf-8')
    return JSON.parse(admin).admins

}