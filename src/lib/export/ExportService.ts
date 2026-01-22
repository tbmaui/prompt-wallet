import { db } from '@/db/db';

export class ExportService {
    public static async exportToJson() {
        const prompts = await db.prompts.toArray();
        const collections = await db.collections.toArray();

        const data = {
            version: 1,
            timestamp: Date.now(),
            prompts,
            collections,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `promptwallet-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    public static async importFromJson(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const json = e.target?.result as string;
                    if (!json) return;

                    const data = JSON.parse(json);

                    // Basic validation
                    if (!data.prompts && !data.collections) {
                        throw new Error("Invalid backup file");
                    }

                    // Import using a transaction
                    await db.transaction('rw', db.prompts, db.collections, async () => {
                        if (data.prompts?.length) {
                            await db.prompts.bulkPut(data.prompts);
                        }
                        if (data.collections?.length) {
                            await db.collections.bulkPut(data.collections);
                        }
                    });

                    resolve();
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}
