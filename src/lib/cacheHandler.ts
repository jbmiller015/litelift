'use server'

import {revalidatePath} from "next/cache";

export default async function emptyCacheAtTarget(url: string): Promise<void> {
    if (url.length > 0)
        revalidatePath(url);
}
